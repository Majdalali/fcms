import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null,
    access_token: null,
    tokenExpiration: null as number | null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    SET_ACCESS_TOKEN(state, { access_token }) {
      state.access_token = access_token;
      localStorage.setItem("access_token", access_token);

      const expirationTime = Date.now() + (7 * 24 * 60 * 60 * 1000); // Epxire in a week
      state.tokenExpiration = expirationTime;
      localStorage.setItem("tokenExpiration", expirationTime.toString());
    },
    CLEAR_USER(state) {
      state.user = null;
      state.access_token = null;
      state.tokenExpiration = null;
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("tokenExpiration");
    },
  },
  actions: {
    loginUser({ commit }, { user, access_token, expiresIn }) {
      commit("SET_USER", user);
      commit("SET_ACCESS_TOKEN", { access_token, expiresIn });
    },
    logoutUser({ commit }) {
      commit("CLEAR_USER");
      
    },
    checkTokenExpiration({ state, commit }) {
      const expirationTime = localStorage.getItem("tokenExpiration");
      if (expirationTime && Date.now() > parseInt(expirationTime, 10)) {
        commit("CLEAR_USER");
      }
    },
  },
});

function getUserFromLocalStorage() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const access_token = localStorage.getItem("access_token") || null;
  return { user, access_token };
}

// Initialize the user state on store creation
const { user, access_token } = getUserFromLocalStorage();
if (user && access_token) {
  store.commit("SET_USER", user);
  store.dispatch("checkTokenExpiration");
}

export default store;