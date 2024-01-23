import { io } from "socket.io-client";
import store from "./store";

const state = {
  socket: null,
};

const mutations = {
  SET_SOCKET(state, socket) {
    state.socket = socket;
  },
};
const actions = {
  connectSocket({ commit }) {
    const userId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).user_id
      : null;

    if (userId) {
      const apiUrlWS = import.meta.env.VITE_WSS;
      const socketUrl = apiUrlWS.replace(/^https/, "wss");
      const socket = io(socketUrl, {
        query: { userId },
      });

      socket.on("connect", () => {
        console.log("Socket connected");
        // Emit the userId to the server after connecting
        socket.emit("userId", userId);
      });

      socket.on("notification", (data) => {
        // For example, dispatch an action to store the comment in Vuex or perform other operations
        console.log("Received notification:", data);
        console.log("Message:", data.message);
        store.dispatch("showSnackbar", {
          message: data.message,
          color: "info",
        });
      });
      commit("SET_SOCKET", socket);
    } else {
      console.warn("No userId found in localStorage");
    }
  },
  // Other socket-related actions if needed
};

export default {
  state,
  mutations,
  actions,
};
