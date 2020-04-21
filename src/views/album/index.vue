<template>
  <div class="xc_">
    <el-button type="primary" size="small" @click="dialogVisible=!dialogVisible">
      上传图片
      <i class="el-icon-upload el-icon--right"></i>
    </el-button>

    <el-dialog :visible.sync="dialogVisible" width="90%" height="30%" :before-close="handleClose">
      <div class="update">
        <avue-form :option="option" v-model="form" @submit="submit" ref="formData"></avue-form>
      </div>
    </el-dialog>
    <el-row>
      <el-col :span="4" v-for="(xc,k) in xcs__" :key="k">
        <div class="album_box" :style="{opacity:xc.show==0?1:0.3}">
          <div class="album_box_show">{{xc.urls.length}}</div>
          <el-image
            class="album_box_img"
            fit="cover"
            :src="xc.urls.length>0?xc.urls[xc.urls.length-1]['url']:''"
            @click="getinfo(xc)"
          >
            <div slot="error" class="image-slotaaa" style="text-align: center">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="album_box_tit">
            {{xc.name}}
            <span>
              <i class="el-icon-s-tools" @click="set(xc)"></i>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="info_data.tit"
      :visible.sync="dialogVisible2"
      width="90%"
      top="30px"
      :before-close="handleClose"
    >
      <div class="info" :style="{height:info_h+'px'}">
        <el-row>
          <el-col :span="4" v-for="(img,k) in info_data.lists" :key="k">
            <div class="info_box">
              <div class="info_box_boxx">
                <el-tooltip class="item" effect="dark" :content="img.createtime" placement="top">
                  <el-image
                    class="info_box_img"
                    fit="cover"
                    :src="img.url"
                    :previewSrcList="srcList"
                  ></el-image>
                </el-tooltip>
                <div class="info_box_tit">
                  <span>{{img.name}}</span>
                  <i class="el-icon-delete" @click="deleimg(img.id,k)"></i>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: "",
      dialogVisible: false,
      xcs: [],
      xcs__: [],
      dialogVisible2: false,
      info_h: 500,
      info_data: {
        tit: "",
        lists: []
      },
      srcList: []
    };
  },
  created() {
    this.getcolumu();
    this.getxcs();
  },
  computed: {
    dicData() {
      let xcx = this.xcs;
      let arr = [];
      for (let i = 0; i < xcx.length; i++) {
        arr.push({
          label: xcx[i]["name"],
          value: xcx[i]["id"]
        });
      }
      return arr;
    },
    option() {
      let dicData = this.dicData;
      return {
        labelWidth: 80,
        menuPosition: "right",
        column: [
          {
            label: "上传到",
            prop: "tree1",
            type: "tree",
            span: 4,
            dicData,
            rules: [
              {
                required: true,
                message: "请选择上传相册",
                trigger: "blur"
              }
            ]
          },
          {
            label: "压缩率",
            prop: "ratio",
            span: 4,
            type: "select",
            placeholder: "默认上传原图",
            dicData: [
              {
                label: "0.1",
                value: 0.1
              },
              {
                label: "0.2",
                value: 0.2
              },
              {
                label: "0.3",
                value: 0.3
              },
              {
                label: "0.4",
                value: 0.4
              },
              {
                label: "0.5",
                value: 0.5
              },
              {
                label: "0.6",
                value: 0.6
              },
              {
                label: "0.7",
                value: 0.7
              },
              {
                label: "0.8",
                value: 0.8
              },
              {
                label: "0.9",
                value: 0.9
              },
              {
                label: "1",
                value: 1
              }
            ]
          },
          {
            label: "水印文字",
            prop: "text",
            span: 4
          },
          {
            label: "颜色",
            prop: "color",
            type: "color",
            span: 4
          },
          {
            label: "大小",
            prop: "fontSize",
            span: 4,
            tip: "字体像素",
            type: "number"
          },
          {
            label: "透明度",
            prop: "opacity",
            span: 4,
            tip: "1-100数字",
            type: "number"
          },
          {
            prop: "imgUrl",
            type: "upload",
            span: 24,
            listType: "picture-card",
            propsHttp: {
              res: "data",
              name: "label",
              url: "value"
            },
            action: "/app.php/home/UploadImg/index",
            canvasOption: {
              text: this.form.text || "  ",
              ratio: Number(this.form.ratio) || "1",
              color: this.form.color || "red",
              fontSize: this.form.fontSize || "16",
              opacity: this.form.opacity || "100"
            }
          }
        ]
      };
    }
  },
  watch: {},
  methods: {
    deleimg(id, k) {
      let thiz = this;
      this.$confirm("是否需要删除该图片?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$httpajax
            .post("/app.php/home/Album/dele", this.$qs.stringify({ id }))
            .then(response => {
              let res = response.data;
              if (res.result) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                thiz.getxcs();
                thiz.info_data.lists.splice(k, 1);
                thiz.srcList.splice(k, 1);
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(e => {
              this.$message.error("网络错误");
              return;
            });
        })
        .catch(() => {});
    },
    set(row) {
      let thiz = this;
      let $str = "";
      let show = "";
      if (row.show == 0) {
        $str = "是否需要隐藏该相册？";
        show = 1;
      }
      if (row.show == 1) {
        $str = "是否需要显示该相册？";
        show = 0;
      }
      let id = row.id;
      let name = row.name;

      this.$confirm($str, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$httpajax
            .post(
              "/app.php/home/cloumn/update",
              thiz.$qs.stringify({ id, name, show, type: 2 })
            )
            .then(response => {
              this.dnzt = false;
              let re = response.data;
              if (re.result) {
                this.$message({
                  message: re.msg,
                  type: "success"
                });
                thiz.getxcs();
              } else {
                this.$message.error(re.msg);
                return;
              }
            })
            .catch(() => {
              this.$message.error("网络错误");
              return;
            });
        })
        .catch(() => {});
    },
    getxcs() {
      this.$httpajax
        .post("/app.php/home/Album/getlists", this.$qs.stringify({ type: 2 }))
        .then(response => {
          let res = response.data;
          if (res.result) {
            this.xcs__ = res.lists;
          }
        })
        .catch(() => {
          this.$message.error("网络错误");
          return;
        });
    },
    submit(row, done) {
      this.$httpajax
        .post(
          "/app.php/home/Album/save",
          this.$qs.stringify({
            imgUrl: JSON.stringify(this.form["imgUrl"]),
            column: this.form.tree1
          })
        )
        .then(response => {
          let res = response.data;
          done();
          if (res.result) {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.dialogVisible = false;
            this.$refs["formData"].resetFields();
            this.getxcs();
          } else {
          }
        })
        .catch(() => {
          done();
          this.$message.error("网络错误");
          return;
        });
    },
    getcolumu() {
      this.$httpajax
        .post("/app.php/home/cloumn/getlist", this.$qs.stringify({ type: 2 }))
        .then(response => {
          let res = response.data;
          if (res.result) {
            this.xcs = res.data;
          } else {
          }
        })
        .catch(() => {
          this.$message.error("网络错误");
          return;
        });
    },
    getinfo(row) {
      this.srcList = [];
      this.info_data.lists = [];
      this.dialogVisible2 = true;
      this.info_data.tit = row.name;
      this.info_data.lists = row.urls;
      let lists = [];
      for (let i = 0; i < row.urls.length; i++) {
        lists.push(row.urls[i]["url"]);
      }
      this.srcList = lists;
    }
  },
  mounted() {
    let h = document.body.clientHeight - 194;
    this.info_h = h;
  }
};
</script>
<style scoped lang="scss">
.info {
  width: 100%;
  overflow-y: auto;
  &_box {
    padding-top: calc(100% + 40px);
    position: relative;
    &_boxx {
      position: absolute;
      top: 0px;
      left: 0px;
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      margin: 10px;
      background: #f5f7fa;
    }
    &_img {
      cursor: pointer;
      top: 0px;
      width: calc(100% - 20px);
      height: calc(100% - 65px);
      margin: 10px;
    }
    &_tit {
      width: 100%;
      border-top: 1px solid rgb(235, 234, 234);
      height: 40px;
      line-height: 40px;
      text-indent: 10px;
      display: flex;
      span {
        flex: 1;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      i {
        width: 20px;
        float: right;
        margin-right: 12px;
        cursor: pointer;
        margin-top: 14px;
        font-size: 14px;
      }
    }
  }
}
.xc_ {
  margin: 0 auto;
  width: 99%;
}
.update {
  width: 100%;
}
.album_box {
  width: calc(100% - 40px);
  padding-top: calc(100% - 40px);
  background: rgb(248, 248, 248);
  border: 1px solid rgb(228, 227, 227);
  margin-top: 30px;
  position: relative;
  opacity: 1;
  &_show {
    position: absolute;
    right: 0px;
    bottom: 50px;
    margin-right: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    color: white;
    z-index: 999;
  }
  &_tit {
    height: 50px;
    border-top: 1px solid rgb(228, 227, 227);
    line-height: 50px;
    font-size: 14px;
    text-indent: 10px;
    background: rgba(248, 248, 248, 0.466);
    color: rgb(105, 105, 105);
    span {
      float: right;
      margin-right: 10px;
      font-size: 14px;
      color: rgb(122, 122, 122);
      cursor: pointer;
    }
  }
  &_img {
    position: absolute;
    cursor: pointer;
    top: 0px;
    width: 100%;
    height: calc(100% - 50px);
  }
}
.image-slotaaa {
  margin: 0 auto;
  text-align: center !important;
  i {
    margin: 0 auto;
    margin-top: calc(50% - 30px);
    font-size: 60px;
    color: rgb(194, 194, 194);
  }
}
</style>