<template>
  <div>
    <avue-crud
      :data="data"
      :option="option"
      v-model="obj"
      :page.sync="page"
      @row-save="save"
      @row-update="update"
      @row-del="del"
      @refresh-change="getList"
      @size-change="size"
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="dels">删 除</el-button>
      </template>
      <template slot="label" slot-scope="scope">
        <el-tag
          v-for="(label,k) in scope.row.label_arr"
          :key="k"
          style="margin:0 2px"
        >{{label.name}}</el-tag>
      </template>
    </avue-crud>
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
      selectionList: [],
      page: {
        pageSize: 10,
        pagerCount: 4,
        total: 0
      },
      p: 1,
      label: [],
      lms: []
    };
  },
  computed: {
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
    option() {
      return {
        selection: true,
        index: true,
        addBtn: false,
        align: "center",
        menuAlign: "center",
        height: "auto",
        calcHeight: 80,
        column: [
          {
            label: "文章名称",
            prop: "name",
            rules: [
              {
                required: true,
                message: "请输入文章名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "栏目",
            prop: "type",
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
            type: "select",
            drag: true,
            multiple: true,
            dicData: this.label,
            slot: true
          },
          {
            label: "发布时间",
            prop: "createtime",
            editDisabled:true,
            editDisplay:false
          },
          {
            label: "是否隐藏",
            prop: "show",
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
  created() {
    this.getlm();
    this.getlabel();
  },
  watch: {
    page: {
      handler() {
        if (this.page.currentPage) {
          this.p = this.page.currentPage;
          this.getList();
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
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
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    size(pageSize) {
      this.getList();
    },
    save(row, done, loading) {
      let { name, color } = this.obj;
      this.$httpajax
        .post("/app.php/home/label/save", this.$qs.stringify({ name, color }))
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
      let { type, show, name,id} = this.obj;
      let label = this.obj.label.length>0 ? this.obj.label.join(",") : "";
      this.$httpajax
        .post(
          "/app.php/home/ac/update",
          this.$qs.stringify({ label, type, show, name,id })
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
      let { pageSize } = this.page;
      let { p } = this;
      this.$httpajax
        .post("/app.php/home/Ac/getlist", this.$qs.stringify({ pageSize, p }))
        .then(response => {
          let res = response.data;
          if (res.result) {
            this.data = res.list;
            this.page.total = Number(res.total);
          } else {
          }
        })
        .catch(e => {
          this.$message.error(e);
          return;
        });
    },
    del(row, index) {
      let thiz = this;
      this.$confirm("确认操作删除？, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$httpajax
            .post("/app.php/home/ac/delete", this.$qs.stringify({ id: row.id }))
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
            .catch(e => {
              this.$message.error("网络错误");
              return;
            });
        })
        .catch(() => {});
    },
    dels() {
      if (this.selectionList.length < 1) {
        this.$message.error("请至少选择一条数据！");
        return;
      }
      let thiz = this;
      this.$confirm("确认删除选中文章？, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$httpajax
            .post(
              "/app.php/home/ac/deletes",
              this.$qs.stringify({ ids: thiz.ids })
            )
            .then(response => {
              let res = response.data;
              if (res.result) {
                thiz.$message({
                  message: res.msg,
                  type: "success"
                });
                thiz.getList();
              } else {
              }
            })
            .catch(e => {
              thiz.$message.error("网络错误");
              return;
            });
        })
        .catch(() => {});
    }
  }
};
</script>