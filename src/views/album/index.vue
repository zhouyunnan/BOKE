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
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: "",
      dialogVisible: false,
      xcs: []
    };
  },
  created() {
    this.getcolumu();
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
            span: 4
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
            span: 4
          },
          {
            label: "透明度",
            prop: "opacity",
            span: 4
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
    }
  }
};
</script>
<style scoped lang="scss">
.xc_ {
  margin: 0 auto;
  width: 99%;
}
.update {
  width: 100%;
}
</style>