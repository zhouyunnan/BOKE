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
        title: "文章栏目",
        page: false,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "名称",
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
            label: "隐藏该栏目",
            prop: "show",
            type: "switch",
            dicData: [
              {
                label: "否",
                value: 0
              },
              {
                label: "是",
                value: 1
              }
            ],
            formatter: function(row, value, label, column) {
              if (row.show == 1) {
                return "是";
              }
              if (row.show == 0) {
                return "否";
              }
            }
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
      let { name, show } = this.obj;
      if (show == "") {
        show = 0;
      }
      this.$httpajax
        .post(
          "/app.php/home/cloumn/save",
          this.$qs.stringify({ name, show, type: 1 })
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
      let { name, show, id } = this.obj;
      if (show == "") {
        show = 0;
      }
      this.$httpajax
        .post(
          "/app.php/home/cloumn/update",
          this.$qs.stringify({ id, name, show, type: 1 })
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
        .post("/app.php/home/cloumn/getlist", this.$qs.stringify({ type: 1 }))
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
              "/app.php/home/cloumn/delete",
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