import Vue from "vue";
import VueRouter from "vue-router";

import Dashboard from "@/components/Dashboard";
import ArticlePage from "@/components/ArticlePage";
import YourQuestions from "@/components/YourQuestions";
import RandomChart from "@/components/RandomChart";
import DragChart from "@/components/DragChart";

// import CheckChart from "@/components/CheckChart";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      component: Dashboard
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
      path: "/dragchart",
      component: DragChart
    }
    // {
    //   path: "/check-chart",
    //   component: CheckChart
    // }
  ],
  mode: "history"
});
