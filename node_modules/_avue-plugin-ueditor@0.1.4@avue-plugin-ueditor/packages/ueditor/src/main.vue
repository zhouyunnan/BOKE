<template>
  <div class="avue-ueditor">
    <div :id="id"></div>
    <el-dialog title="源代码编辑"
               :before-close="handleClose"
               :visible.sync="dialogVisible"
               width="100%"
               fullscreen
               append-to-body>
      <el-input v-model="textall"
                autosize
                type="textarea"></el-input>
    </el-dialog>
  </div>
</template>
<script>
import { getClient } from "./upload/ali";
import { getToken } from "./upload/qiniu";
import { getObjValue, HTMLFormat } from "./upload/util";
import E from 'wangeditor'
export default {
  name: "AvueUeditor",
  computed: {
    domId () {
      return '#' + this.id
    },
    imgFlag () {
      return this.img.url == '';
    },
    isImg () {
      return this.img.obj.src
    },
    urlKey () {
      return this.props.url || 'url';
    },
    props () {
      return this.options.props || this.upload.props || {};
    },
    oss () {
      return this.options.oss || this.upload.oss;
    },
    action () {
      return this.options.action || this.upload.action;
    },
    qiniu () {
      return this.options.qiniu || this.upload.qiniu;
    },
    ali () {
      return this.options.ali || this.upload.ali;
    },
    isQiniuOSS () {
      return this.oss === "qiniu";
    },
    isAliOSS () {
      return this.oss === "ali";
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      }
    },
    id: {
      type: String,
      default: () => {
        return 'avue-ueditor-' + Math.ceil(Math.random() * 100)
      }
    },
    upload: {
      type: Object,
      default: () => {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
  },
  data () {
    return {
      textall: '',
      text: '',
      dialogVisible: false,
      editor: ''
    };
  },
  watch: {
    disabled (val) {
      this.editor.$textElem.attr('contenteditable', !val)
    },
    value (newVal) {
      if (this.editor) {
        if (newVal && newVal !== this.text) {
          this.text = newVal;
          this.editor.txt.html(newVal);
        } else if (!newVal) {
          this.text = '';
          this.editor.txt.html('');
        }
      }
    },
  },
  mounted () {
    this.initEdit();
  },
  methods: {
    initEdit () {
      this.editor = new E(this.domId)
      window.wangEditor = E;
      this.editor.customConfig.zIndex = 100
      this.editor.customConfig.onchange = (html) => {
        this.text = html;
        this.$emit('input', this.text)
      }
      this.initUploadImg();
      this.editor.create()
      this.initPlugins();
      if (this.disabled) {
        this.editor.$textElem.attr('contenteditable', false)
      }
      this.editor.txt.html(this.value)
      this.handlePaste();
    },
    initUploadImg () {
      this.editor.customConfig.customUploadImg = (file, insert) => {
        this.uploadFile(file[0]).then(res => {
          insert(res)
        })
      }
    },
    uploadFile (file) {
      return new Promise((resolve, reject) => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        const headers = { "Content-Type": "multipart/form-data" };
        let oss_config = {};
        let client;
        let param = new FormData();
        let url = this.action;
        param.append("file", file);
        if (this.isQiniuOSS) {
          oss_config = this.qiniu;
          const token = getToken(oss_config.AK, oss_config.SK, {
            scope: oss_config.scope,
            deadline: new Date().getTime() + oss_config.deadline * 3600
          });
          param.append("token", token);
          url = "http://up.qiniu.com/";
        } else if (this.isAliOSS) {
          oss_config = this.ali;
          client = getClient({
            region: oss_config.region,
            endpoint: oss_config.endpoint,
            accessKeyId: oss_config.accessKeyId,
            accessKeySecret: oss_config.accessKeySecret,
            bucket: oss_config.bucket
          });
        }
        (() => {
          if (this.isAliOSS) {
            return client.put(file.name, file);
          } else {
            return this.$httpajax.post(url, param, { headers });
          }
        })().then(res => {
          let list = {};
          var result = '';
          if (this.isAliOSS) {
            list = res;
            result = list.url;
          } else if (this.isQiniuOSS) {
            list = res.data;
            list.key = oss_config.url + list.key;
            result = list.key;
          } else {
            list = getObjValue(res.data, this.props.res, "object");
            result = list[this.urlKey];
          }
          var html = result
          loading.close();
          resolve(html)
        }).catch(err => {
          loading.close();
          reject(err);
        });
      })

    },
    handleClose (done) {
      this.$emit('input', HTMLFormat(this.textall))
      done()
    },
    getUEContent () {
      return this.editor.txt.html()
    },
    HTMLFormat,
    handlePaste () {
      //粘贴键
      document.addEventListener("paste", e => {
        //获取剪切板文件
        const getFile = event => {
          if (event.clipboardData || event.originalEvent) {
            var clipboardData =
              event.clipboardData || event.originalEvent.clipboardData;
            if (clipboardData.items) {
              var items = clipboardData.items,
                len = items.length,
                blob = null;
              for (var i = 0; i < len; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                  blob = items[i].getAsFile();
                  return blob;
                }
              }
            }
          }
        };
        const file = getFile(e);
        if (file) {
          this.uploadFile(file).then(res => {
            this.editor.txt.append('<img src="' + res + '" />')
          })
        }
      });
    },
    initPlugins () {
      E.fullscreen = {
        // editor create之后调用
        init: function (editorSelector) {
          document.querySelector(editorSelector + " .w-e-toolbar").appendHTML('<div class="w-e-menu"><span class="_wangEditor_btn_fullscreen" href="###" onclick="window.wangEditor.fullscreen.toggleFullscreen(\'' + editorSelector + '\')">全屏</span></div>');
        },
        toggleFullscreen: function (editorSelector) {
          document.querySelector(editorSelector).toggleClass('fullscreen-editor');
          if (document.querySelector(editorSelector + ' ._wangEditor_btn_fullscreen').innerText == '全屏') {
            document.querySelector(editorSelector + ' ._wangEditor_btn_fullscreen').innerText = '退出全屏';
          } else {
            document.querySelector(editorSelector + ' ._wangEditor_btn_fullscreen').innerText = '全屏';
          }
        }
      };
      E.fullscreen.init(this.domId);
      E.views = {
        init: function (editorSelector) {
          document.querySelector(editorSelector + " .w-e-toolbar").appendHTML('<div class="w-e-menu"><span class="_wangEditor_btn_fullscreen" href="###" onclick="window.wangEditor.views.toggleFullscreen(\'' + editorSelector + '\')">源代码</span></div>');
        },
        toggleFullscreen: () => {
          this.textall = HTMLFormat(this.value);
          this.dialogVisible = true;
        }
      };
      E.views.init(this.domId);
    },
  }
};
</script>
<style lang="scss">
@import "../../theme-chack/src/index.scss";
</style>
