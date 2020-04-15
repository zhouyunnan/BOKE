<template>
  <div>
    <div class="t1">欢迎回来!</div>
    <div class="t2">{{time}}</div>
    <avue-data-tabs :option="option" style="padding:20px 20px 30px 20px"></avue-data-tabs>
    <avue-data-icons :option="option2"></avue-data-icons>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: "",
      option: {
        data: [
          {
            click: function(item) {
              // alert(JSON.stringify(item));
            },
            title: "文章统计",
            subtitle: "实时",
            count: 908,
            allcount: 10222,
            text: "评论次数",
            color: "rgb(178, 159, 255)",
            key: "评"
          },
          {
            click: function(item) {
              // alert(JSON.stringify(item));
            },
            title: "图片统计",
            subtitle: "实时",
            count: 3112,
            allcount: 10222,
            text: "当前上传的附件数",
            color: "rgb(230, 71, 88)",
            key: "图"
          },
          {
            click: function(item) {
              //alert(JSON.stringify(item));
            },
            title: "昨日访问",
            subtitle: "实时",
            count: 7993,
            allcount: 10222,
            text: "总访问量",
            color: "rgb(27, 201, 142)",
            key: "IP"
          }
        ]
      },
      option2: {
        span: 4,
        data: [
          {
            click: function(item) {
              alert(JSON.stringify(item));
            },
            title: "今日注册",
            count: 12678,
            icon: "el-icon-tickets",
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            click: function(item) {
              alert(JSON.stringify(item));
            },
            title: "今日登录",
            count: 22139,
            icon: "el-icon-success",
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            click: function(item) {
              alert(JSON.stringify(item));
            },
            title: "今日订阅",
            count: 35623,
            icon: "el-icon-info",
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            click: function(item) {
              alert(JSON.stringify(item));
            },
            title: "今日评论",
            count: 16826,
            icon: "el-icon-message",
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            click: function(item) {
              alert(JSON.stringify(item));
            },
            title: "今日转发",
            count: 16826,
            icon: "el-icon-message",
            href: "https://avuejs.com",
            target: "_blank"
          },
          {
            click: function(item) {
              alert(JSON.stringify(item));
            },
            title: "今日评论",
            count: 16826,
            icon: "el-icon-message",
            href: "https://avuejs.com",
            target: "_blank"
          }
        ]
      }
    };
  },
  created() {
    this.gettime();
  },
  methods: {
    gettime() {
      var dd = new Date();
      //获取年月日，时分秒
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var d = dd.getDate();
      var h = dd.getHours();
      var i = dd.getMinutes();
      var s = dd.getSeconds();
      var wkday = dd.getDay();
      this.time =
        y +
        "年" +
        m +
        "月" +
        d +
        "日" +
        "   " +
        h +
        ":" +
        i +
        ":" +
        s +
        " " +
        "星期" +
        "日一二三四五六".charAt(wkday);
    }
  },
  mounted() {
    setInterval(() => {
      this.gettime();
    }, 1000);
  }
};
</script>
<style scoped>
.t1 {
  font-size: 30px;
  padding: 30px 30px 10px 30px;
}
.t2 {
  font-size: 20px;
  padding: 0px 30px 30px 30px;
}
</style>