import Vue from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";
import VueAxios from "vue-axios";

import CKEditor from "@ckeditor/ckeditor5-vue";
// import axios from "axios";
import router from "./router";

Vue.use(CKEditor);
Vue.use(VueAxios, axios);
// Vue.prototype.axios = window.axios;
// axios.defaults.baseURL = "http://helloworld.test/api";
Vue.config.productionTip = false;
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
