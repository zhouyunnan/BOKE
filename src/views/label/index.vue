<template>
  <div>
    <avue-crud
      :data="data"
      :option="option"
      v-model="obj"
      @row-save="save"
      @row-update="update"
      @row-del="del"
      @refresh-change="getList"
    ></avue-crud>
  </div>
</template>
<script>
export default {
  data() {
    return {
      obj: {
        show: "1"
      },
      data: [],
      option: {
        page: false,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "标签名称",
            prop: "name",
            rules: [
              {
                required: true,
                message: "请输入栏目名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "文章数量",
            prop: "number",
            disabled: true,
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "字体颜色",
            prop: "color",
            type: 'color',
          }
        ]
      }
    };
  },
  created() {
   this.getList();
  },
  methods: {
    save(row, done, loading) {
      let { name, color } = this.obj;
      this.$httpajax
        .post(
          "/app.php/home/label/save",
          this.$qs.stringify({ name, color,})
        )
        .then(response => {
          loading();
          done();
          this.dnzt = false;
          let re = response.data;
          if (re.result) {
            this.$message({
              message: re.msg,
              type: "success"
            });
          this.getList();
          } else {
            this.$message.error(re.msg);
            return;
          }
        })
        .catch(() => {
          loading();
          done();
          this.$message.error("网络错误");
          return;
        });
    },
    update(row, index, done, loading) {
      let { name, color, id } = this.obj;
      this.$httpajax
        .post(
          "/app.php/home/label/update",
          this.$qs.stringify({ id, name, color, })
        )
        .then(response => {
          loading();
          done();
          this.dnzt = false;
          let re = response.data;
          if (re.result) {
            this.$message({
              message: re.msg,
              type: "success"
            });
            this.getList();
          } else {
            this.$message.error(re.msg);
            return;
          }
        })
        .catch(() => {
          loading();
          done();
          this.$message.error("网络错误");
          return;
        });
    },
    getList() {
      this.data = [];
      this.$httpajax
        .post("/app.php/home/label/getlist", this.$qs.stringify({  }))
        .then(response => {
          let res = response.data;
          if (res.result) {
            this.data = res.data;
          } else {
          }
        })
        .catch(() => {
          this.$message.error("网络错误");
          return;
        });
    },
    del(row, index) {
      let thiz = this;
      this.$confirm("此操作将永久删除该栏目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$httpajax
            .post(
              "/app.php/home/label/delete",
              this.$qs.stringify({ id: row.id })
            )
            .then(response => {
              let res = response.data;
              if (res.result) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                thiz.getList();
              } else {
              }
            })
            .catch((e) => {
              this.$message.error("网络错误");
              return;
            });
        })
        .catch(() => {});
    }
  }
};
</script>