import Vue from "vue";

import App from "./App.vue";
import BootstrapVue from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import axios from "axios";
import VueAxios from "vue-axios";

import store from "./store";

import CKEditor from "@ckeditor/ckeditor5-vue";
import router from "./router";

import Vuex from "vuex";

require("@/store/subscriber");
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

Vue.use(CKEditor);
Vue.use(VueAxios, axios);
Vue.use(Vuex);
Vue.use(BootstrapVue);
// Vue.prototype.axios = window.axios;
axios.defaults.baseURL = "https://teaboardapi.sumato.tech/api/v1";
Vue.config.productionTip = false;

store.dispatch("auth/attempt", localStorage.getItem("token")).then(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
});
