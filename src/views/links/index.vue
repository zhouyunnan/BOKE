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
            label: "名称",
            prop: "name",
            rules: [
              {
                required: true,
                message: "请输入网站名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "超链接",
            prop: "url",
          type: 'url'
          },
          {
            label: "创建日期",
            prop: "createtime",
            editDisplay:false,
            addDisplay:false,
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
      let { name, url } = this.obj;
      this.$httpajax
        .post(
          "/app.php/home/link/save",
          this.$qs.stringify({ name, url,})
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
      let { name, url, id } = this.obj;
      this.$httpajax
        .post(
          "/app.php/home/link/update",
          this.$qs.stringify({ id, name, url, })
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
        .post("/app.php/home/link/getlist", this.$qs.stringify({  }))
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
              "/app.php/home/link/delete",
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