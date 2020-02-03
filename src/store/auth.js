export default {
  namspaced: true,
  state: {
    token: null,
    user: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, data) {
      state.user = data;
    }
  },
  actions: {
    async signIn({ dispatch }, credentials) {
      let response = await this.axios.post("/auth/login", credentials);
      dispatch("attempt", response.data.token);
    },
    async attempt({ commit }, token) {
      commit("SET_TOKEN", token);
      try {
        let response = await this.axios.get("/me", {
          headers: {
            Authorization: "Bearer" + token
          }
        });
        commit("SET_USER", response.data);
      } catch (e) {
        commit("SET_TOKEN", null);
        commit("SET_USER", null);

        console.log("failed");
      }
    }
  }
};
