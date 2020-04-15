//通过CDN引入的
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import instance from "./config";
import Qs from "qs";
//粒子特效
import VueParticles from "vue-particles";
Vue.use(VueParticles);

//通过CDN引入的
import ElementUI from "element-ui";
Vue.use(ElementUI);

//通用js方法
import pubfn from "./assets/Js/public.js";
Vue.prototype.$pubfn = pubfn;

import Avue from "@smallwei/avue";
import "@smallwei/avue/lib/index.css";
Vue.use(Avue);

//富文本
import AvueUeditor from "avue-plugin-ueditor";
Vue.use(AvueUeditor);
//阻止启动生产消息，常用作指令
Vue.config.productionTip = false;
//定义请求
Vue.prototype.$httpajax = instance.axios;

//QS
Vue.prototype.$qs = Qs;
new Vue({
    router,
    render: h => h(App)
}).$mount("#app");