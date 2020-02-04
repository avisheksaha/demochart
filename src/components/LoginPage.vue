<template>
  <div>
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <div class="card px-3 pt-5 pb-5" style="background-color: white; width: 30%;">
        <h2 class="text-center">Log in</h2>
        <div class="card-body">
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="email">email</label>
              <input
                type="text"
                class="form-control"
                v-model="form.email"
                id="email"
                aria-describedby="email"
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control"
                v-model="form.password"
                id="exampleInputPassword1"
              />
            </div>
            <button type="submit" class="btn btn-primary btn-lg btn-block">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      }
    };
  },
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user"
    })
  },
  methods: {
    ...mapActions({
      signIn: "auth/signIn"
    }),

    login() {
      this.signIn(this.form)
        .then(() => {
          console.log("xxxxxx");
          this.$router.replace({
            name: "randomchart"
          });
        })
        .catch(() => {
          console.log("failed");
        });
      // this.axios
      //   .post("", { email: this.email, password: this.password })
      //   .then(response => {
      //     this.gotStates = response.data.data;
      //   })
      //   .catch();
    }
  }
};
</script>

<style lang="scss"></style>
