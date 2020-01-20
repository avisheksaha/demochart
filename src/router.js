import Vue from "vue";
import VueRouter from "vue-router";

// import Dashboard from "@/components/Dashboard";
import ArticlePage from "@/components/ArticlePage";
import YourQuestions from "@/components/YourQuestions";
import RandomChart from "@/components/RandomChart";
import DragCharting from "@/components/DragCharting";
import DragChart from "@/components/DragChart";
import FullMap from "@/components/FullMap";

// import CheckChart from "@/components/CheckChart";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      component: RandomChart
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
