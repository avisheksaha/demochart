import Vue from "vue";
import VueRouter from "vue-router";

// import Dashboard from "@/components/Dashboard";
import ArticlePage from "@/components/ArticlePage";
import YourQuestions from "@/components/YourQuestions";
import RandomChart from "@/components/RandomChart";
import DragCharting from "@/components/DragCharting";
import DragChart from "@/components/DragChart";
import FullMap from "@/components/FullMap";
import LoginPage from "@/components/LoginPage";
import store from "@/store";

// import CheckChart from "@/components/CheckChart";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      name: "login",
      path: "/login",
      component: LoginPage
    },
    {
      name: "randomchart",
      path: "/",
      component: RandomChart,
      beforeEnter: (to, from, next) => {
        if (!store.getters["auth/authenticated"]) {
          return next({
            name: "login"
          });
        }
      }
    },
    {
      path: "/article-page/:id",
      name: "article-page",
      component: ArticlePage
    },
    {
      path: "/your-questions",
      component: YourQuestions
    },
    {
      path: "/chart",
      component: RandomChart
    },
    {
      path: "/dragcharting",
      component: DragCharting
    },
    {
      path: "/dragchart",
      component: DragChart
    },
    {
      path: "/fullmap",
      component: FullMap
    }
    // {
    //   path: "/check-chart",
    //   component: CheckChart
    // }
  ],
  mode: "history"
});
export default router;
