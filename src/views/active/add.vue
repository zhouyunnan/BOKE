<template>
  <div class="page_">
    <avue-form ref="formData" v-model="obj" :option="option"></avue-form>
    <div class="fbw">
      <avue-ueditor v-model="text" :upload="upload"></avue-ueditor>
    </div>
    <div class="btn">
      <!-- <el-button size="medium">保存为草稿</el-button> -->
      <el-button type="primary" size="medium" @click="save()">发表</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page_ {
  margin-top: 20px;
  padding: 0 20px;
  .fbw,
  .btn {
    padding: 0 10px;
  }
  .btn {
    float: right;
    margin-top: 30px;
  }
}
</style>
<script>
export default {
  data() {
    return {
      lms: [],
      label: [],
      obj: {
        show: "1"
      },
      text: "",
      upload: {
        action: "/app.php/home/UploadImg/index",
        props: {
          res: "data",
          name: "label",
          url: "value"
        }
      }
    };
  },
  created() {
    this.getlm();
    this.getlabel();
  },
  computed: {
    option() {
      return {
        emptyBtn: false,
        enter: false,
        submitBtn: false,
        column: [
          {
            label: "文章标题",
            prop: "name",
            span: 12,
            rules: [
              {
                required: true,
                message: "请输入姓名",
                trigger: "blur"
              }
            ]
          },
          {
            label: "栏目",
            prop: "type",
            span: 12,
            type: "select",
            dicData: this.lms,
            rules: [
              {
                required: true,
                message: "请选择栏目",
                trigger: "blur"
              }
            ]
          },
          {
            label: "标签",
            prop: "label",
            span: 12,
            type: "select",
            drag: true,
            multiple: true,
            dicData: this.label
          },
          {
            label: "是否隐藏",
            prop: "show",
            span: 12,
            type: "switch",
            dicData: [
              {
                label: "否",
                value: "1"
              },
              {
                label: "是",
                value: "0"
              }
            ]
          }
        ]
      };
    }
  },
  methods: {
    save() {
      let label = this.obj.label.length>0 ? this.obj.label.join(",") : "";
      let { show, name, type } = this.obj;
      let text = this.text;
      if (!/\S/.test(name)) {
        this.$message.error("请填写文章标题");
        return;
      }
      if (!/\S/.test(type)) {
        this.$message.error("请选择栏目");
        return;
      }
      let thiz = this;
      this.$confirm("确认发布吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          thiz.$httpajax
            .post(
              "/app.php/home/Ac/save",
              this.$qs.stringify({ label, show, name, type, text })
            )
            .then(response => {
              let res = response.data;
              if (res.result) {
                thiz.$message({
                  message: res.msg,
                  type: "success"
                });

                thiz.$refs["formData"].resetFields();
                thiz.text = "";
              } else {
                thiz.$message.error(res.msg);
              }
            })
            .catch(e => {
              thiz.$message.error("网络错误");
              return;
            });
        })
        .catch(() => {});
    },
    getlm() {
      this.data = [];
      this.$httpajax
        .post("/app.php/home/cloumn/getlist", this.$qs.stringify({ type: 1 }))
        .then(response => {
          let res = response.data;
          if (res.result) {
            let arr = [];
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              arr.push({
                label: data[i]["name"],
                value: data[i]["id"]
              });
            }
            this.lms = arr;
          } else {
          }
        })
        .catch(() => {
          this.$message.error("网络错误");
          return;
        });
    },
    getlabel() {
      this.$httpajax
        .post("/app.php/home/label/getlist", this.$qs.stringify({}))
        .then(response => {
          let res = response.data;
          if (res.result) {
            let arr = [];
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              arr.push({
                label: data[i]["name"],
                value: data[i]["id"]
              });
            }
            this.label = arr;
          } else {
          }
        })
        .catch(() => {
          this.$message.error("网络错误");
          return;
        });
    }
  }
};
</script>