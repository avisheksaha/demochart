<template>
  <div id="app">
    <!-- <nav
      class="navbar sticky-top navbar-expand-lg bg-light border-bottom fixed"
    >
      <a class="navbar-brand" href="#">Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav mx-auto">
          <router-link to="/" class="nav-item nav-link">Home</router-link>
          <router-link to="your-questions" class="nav-item nav-link" href="#"
            >Your Questions</router-link
          >
          <a class="nav-item nav-link" href="#">Your Answers</a>
          <a class="nav-item nav-link" href="#">Notification</a>
          <form
            class="form-inline my-2 my-lg-0"
            style="padding-left:20px; padding-right:20px;"
          >
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </form>
        </div>
      </div>
    </nav>-->
    <router-view></router-view>
    <!-- <Dashboard></Dashboard> -->
    <!-- <ArticlePage></ArticlePage> -->
    <!-- <YourQuestions></YourQuestions> -->
  </div>
</template>

<script>
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import Dashboard from "./components/Dashboard.vue";
// import ArticlePage from "./components/ArticlePage.vue";
// import YourQuestions from "./components/YourQuestions.vue";

export default {
  name: "app",
  components: {
    // Dashboard
    // ArticlePage
    // YourQuestions
  }
};
</script>

<style>
.navbar-brand {
  font-size: 16px;
  color: black;
}
.navbar-expand-lg .navbar-nav .nav-link {
  padding-left: 20px !important;
  padding-right: 20px !important;
  font-size: 16px;
  color: black;
}
#app {
  height: 100vh;
}
body {
  height: 100vh;
}
</style>
