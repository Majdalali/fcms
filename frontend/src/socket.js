import { io } from "socket.io-client";

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
      const socket = io("http://localhost:8000", { query: { userId } });

      socket.on("connect", () => {
        console.log("Socket connected");
        // Emit the userId to the server after connecting
        socket.emit("userId", userId);
      });
      socket.on("comment", (data) => {
        // Handle the received comment data here
        // For example, dispatch an action to store the comment in Vuex or perform other operations
        console.log("Received comment:", data);
        // dispatch("handleComment", data); // Example dispatch
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
