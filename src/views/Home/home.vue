<template>
  <div id="main">
    <div class="pub_left" :style="{ width : MenuBox_W+ 'px'}">
      <div class="pub_left_menu">
        <div
          v-for="(menu,index) in Menus"
          :key="index"
          :class="{pub_menu_active:activeMenu.jb == 1 && index == activeMenu.index}"
        >
          <div class="pub_left_menu_li" @click="Menu1(index)">
            <div class="pub_left_menu_li_ico">
              <span :class="menu.icon"></span>
            </div>
            <div class="pub_left_menu_li_msg">{{menu.name}}</div>

            <div
              class="pub_left_menu_li_more"
              v-if="menu.second"
              :class="[menu.isopen?'pub_zt_b':'pub_zt_r']"
            >
              <i class="el-icon-arrow-up"></i>
            </div>
          </div>
          <div class="pub_left_menu_last_menu" :style="{height:menu.height+'px'}">
            <div
              class="pub_left_menu_li_li"
              v-for="(sonM,sonMIndex) in menu.second"
              @click="Menu2(sonM.link,sonMIndex,index)"
              :class="{pub_menu_active:activeMenu.jb == 2 && index == activeMenu.father_index && sonMIndex == activeMenu.index}"
            >{{sonM.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pub_right">
      <div class="pub_right_header">
        <div class="pub_right_header_menu">
          <i @click="changeMenu()" class="el-icon-menu"></i>
        </div>
        <div class="pub_right_header_menu_r">
          <div class="pub_right_header_ty" @click="exitlogin()">
            <span class="iconfont icon-tuichu"></span>退出登陆
          </div>
          <div class="pub_right_header_ty" @click="changgepwd()">
            <i class="el-icon-lock"></i>修改密码
          </div>
        </div>
      </div>
      <div class="pub_right_content">
        <div class="main">
          <welcome v-if="full == '/'" />
          <div v-else class="main_menu">
            <div
              v-for="(row,k) in  showmenus "
              :key="k"
              :class="[row.link == ontive ? 'main_nav_active':'','nav']"
              @click="tz(row.link)"
            >
              <span>{{row.name}}</span>
              <i class="el-icon-close" @click.stop="delenav(row.link)"></i>
            </div>
            <div class="fg"></div>
          </div>
          <div class="main_content">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Welcome from "../../components/Welcome.vue";
export default {
  data() {
    return {
      //菜单栏宽度
      MenuBox_W: 200,
      Menus: this.$pubfn.navs,
      //当前选中的菜单
      activeMenu: {
        index: 0,
        father_index: 0,
        jb: 1
      },
      topMenus: [],
      ontive: ""
    };
  },
  components: {
    Welcome
  },
  methods: {
    delenav(val) {
      let arr = this.topMenus;
      let index = arr.findIndex((v, i) => {
        if (val == v) {
          return true;
        }
      });
      if (index != -1) {
        this.topMenus.splice(index, 1);
        if (this.ontive == val) {
          let length = this.topMenus.length;
          if (length > 0) {
            this.tz(this.topMenus[length - 1]);
          } else {
            this.tz("home");
          }
        }
      }
    },
    //记录菜单打开
    addtopmenu(val) {
      let arr = this.topMenus;
      let index = arr.findIndex(function(v, k) {
        if (val == v) {
          return true;
        }
      });
      if (index == -1) {
        arr.push(val);
      } else {
      }
      this.topMenus = arr;
    },
    tz(link) {
      this.$router.push({
        name: link
      });
      this.activeMenu = {
        index: "",
        jb: ""
      };
      this.ontive = link;
    },
    //  以下是事件函数
    //点击父菜单
    Menu1(index) {
      let btn = this.Menus[index];
      if (btn.second) {
        //操作子菜单
        let isopen = btn.isopen;
        if (isopen) {
          //动态设置高度，这样子菜单展开才能有过渡效果
          btn.height = 0;
          btn.isopen = false;
        } else {
          btn.height = btn.second.length * 35;
          btn.isopen = true;
        }
      } else {
        //切换路由
        if (btn.link) {
          this.$router.push({
            name: btn.link
          });
          this.activeMenu = {
            index: index,
            jb: 1
          };
          this.addtopmenu(btn.link);
          this.ontive = btn.link;
        }
      }
    },
    //点击子菜单
    Menu2(link, i, fatherindex) {
      if (link) {
        this.$router.push({
          name: link
        });
        this.activeMenu = {
          index: i,
          father_index: fatherindex,
          jb: 2
        };
        this.addtopmenu(link);
        this.ontive = link;
      }
    },
    //开关左侧菜单栏
    changeMenu() {
      if (this.MenuBox_W == 0) {
        this.MenuBox_W = 200;
      } else {
        this.MenuBox_W = 0;
      }
    },
    //退出登陆ajax
    doexit() {
      this.$httpajax
        .get("/app.php/home/login/Api_exit")
        .then(response => {
          let re = response.data;
          if (re.result) {
            this.$message({
              message: "安全退出",
              type: "success"
            });
            setTimeout(() => {
              window.location.href = "";
            }, 1500);
          } else {
            this.$message.error("退出失败");
            return;
          }
        })
        .catch(() => {
          this.$message.error("网络错误");
          return;
        });
    },
    //退出登陆
    exitlogin() {
      this.$confirm("是否退出登陆?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doexit();
        })
        .catch(() => {
          return;
        });
    },
    //修改密码
    changgepwd() {
      this.$prompt("请输入新密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "password"
      })
        .then(({ value }) => {
          if (!/\S/.test(value) || value == null) {
            this.$notify.error({
              title: "错误",
              message: "请输入新密码"
            });
            return;
          }
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.$http
            .post(
              "/app.php/home/login/Api_changepwd",
              this.$qs.stringify({
                pwd: value
              })
            )
            .then(resou => {
              loading.close();
              let data = resou.data;
              if (data.result) {
                this.dialogFormVisible = false;
                this.$notify({
                  title: "成功",
                  type: "success",
                  message: data.msg
                });
                setTimeout(() => {
                  this.doexit();
                }, 1500);
              } else {
                this.$notify.error({
                  title: "错误",
                  message: data.msg
                });
              }
            })
            .catch(() => {
              loading.close();
              this.$message.error("网络错误");
            });
          return;
        })
        .catch(() => {
          return;
        });
    }
  },
  mounted() {
    let querypath = this.$route.name;
    this.addtopmenu(this.$route.name);
    this.ontive = this.$route.name;
    for (let i = 0, j = this.Menus.length; i < j; i++) {
      if (this.Menus[i].link == querypath) {
        this.activeMenu = {
          index: i,
          father_index: 0,
          jb: 1
        };
        break;
      }
      if (this.Menus[i].second != undefined) {
        let second = this.Menus[i].second;
        for (let k = 0, m = second.length; k < m; k++) {
          if (querypath == second[k].link) {
            this.activeMenu = {
              index: k,
              father_index: i,
              jb: 2
            };
            this.Menu1(i);
            break;
          }
        }
      }
    }
  },
  watch: {
    $route(to, from) {
      this.ontive = to.name;
    }
  },
  computed: {
    full() {
      return this.$route.fullPath;
    },
    showmenus() {
      let arr = this.topMenus;
      let data = [];
      for (let i = 0; i < arr.length; i++) {
        let index = this.menus.findIndex((v, k) => {
          if (v.link == arr[i]) {
            return true;
          }
        });
        if (index != -1) {
          data.push(this.menus[index]);
        }
      }
      return data;
    },
    menus() {
      let data = [];
      let navs = this.$pubfn.navs;
      for (let i = 0; i < navs.length; i++) {
        if (navs[i]["second"]) {
          for (let j = 0; j < navs[i]["second"].length; j++) {
            data.push(navs[i]["second"][j]);
          }
        } else {
          data.push(navs[i]);
        }
      }
      return data;
    }
  }
};
</script>
<style scoped lang="scss" >
.main_menu {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  .nav {
    line-height: 1;
    float: left;
    padding: 12px 25px;
    border-right: 1px solid rgb(228, 228, 228);
    border-bottom: 1px solid rgb(228, 228, 228);
    font-size: 14px;
    position: relative;
    cursor: pointer;
    span {
      color: #444444;
      cursor: pointer;
      &:hover {
        color: #007df1;
      }
    }
    i {
      position: absolute;
      right: 3px;
      top: 3px;
      color: #c9c9c9;
      padding: 2px;
      line-height: 1;
      &:hover {
        background: rgb(167, 164, 164);
        border-radius: 10px;
      }
    }
  }
  .fg {
    flex: 1;
    border-bottom: 1px solid rgb(228, 228, 228);
  }
}
.main_nav_active {
  border-bottom: none !important;
}
#main {
  width: 100%;
  height: 100%;
  display: flex;
}
.pub_left {
  overflow: hidden;
  background: #0e161f;
  transition: width 0.3s;
  -moz-transition: width 0.3s;
  -webkit-transition: width 0.3s;
  -o-transition: width 0.3s;
  transition-timing-function: ease;
}
.pub_right {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.pub_right_header {
  position: relative;
  width: 100%;
  height: 60px;
  background: white;
  border-bottom: 1px solid #dcdfe6;
  line-height: 60px;
}
.pub_right_content {
  flex: 1;
  width: 100%;
  overflow-y: auto;
}
.main {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  margin: 0 auto;
  margin-top: 10px;
  background: white;
  position: relative;
  border-top: 1px solid white;
  &_content {
    margin-top: 50px;
    width: 100%;
    height: calc(100% - 50px);
    overflow-y: auto;
  }
}
.pub_right_header_menu {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 15px;
}
.pub_right_header_menu i {
  font-size: 26px;
  cursor: pointer;
}
.pub_right_header_menu_r {
  width: 100%;
  height: 100%;
}
.pub_right_header_ty {
  height: 100%;
  float: right;
  cursor: pointer;
  margin-right: 20px;
  font-size: 16px;
}
.pub_right_header_ty i {
  padding-right: 4px;
}

.icon-tuichu {
  float: left;
  font-size: 20px;
  margin-right: -5px;
}

.pub_left_menu {
  width: 200px;
  margin-top: 60px;
  color: #d9dadb;
  // border-top:1px solid #495764;
}
.pub_left_menu_li {
  width: 100%;
  line-height: 40px;
  font-size: 15px;
  // border-bottom: 1px solid #485b6d;
  display: flex;
  height: 40px;
  cursor: pointer;
}
.pub_left_menu_li_ico {
  margin-left: 24px;
  margin-right: 15px;
}
.pub_left_menu_li_ico i {
  font-size: 16px;
  color: #d9dadb;
}
.pub_left_menu_li_msg {
  flex: 1;
}
.pub_left_menu_li_more {
  margin-right: 30px;
  color: #d9dadb;
}
.pub_left_menu_li_more i {
  font-size: 8px;
  color: #d9dadb;
}
.pub_zt_r {
  transform: rotate(90deg);
}
.pub_zt_b {
  transform: rotate(180deg);
}
.pub_left_menu_li_li {
  height: 35px;
  color: #d0d1d3;
  text-indent: 55px;
  font-size: 13px;
  line-height: 35px;
  cursor: pointer;
}
.pub_left_menu_li_li:hover {
  background: rgba(105, 105, 105, 0.137);
}
.pub_menu_active,
.pub_menu_active:hover {
  color: white;
  background: rgb(42, 117, 192);
}
.pub_left_menu_last_menu {
  width: 100%;
  transition: height 0.2s;
  -moz-transition: height 0.2s;
  -webkit-transition: height 0.2s;
  -o-transition: height 0.2s;
  transition-timing-function: ease;
  height: 0px;
  overflow: hidden;
}
</style>
