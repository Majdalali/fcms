<template>
  <v-app :class="isDark ? 'glass-backgroundDark' : 'glass-background'">
    <div v-if="!isDark" class="overlay z-0"></div>
    <v-sheet
      :color="isDark ? 'black' : 'white'"
      :elevation="8"
      height="60"
      class="col-12 z-10"
    >
      <div class="flex flex-row items-center justify-between">
        <div>
          <v-img
            :width="300"
            aspect-ratio="16/9"
            cover
            :src="isDark ? UTMLogoBlack : UTMLogo"
          ></v-img>
        </div>
        <div class="w-full h-full flex items-center justify-center">
          <router-link class="font-bold pl-3 dark:text-white" to="/"
            >Home</router-link
          >
          <router-link class="pl-3 title" to="/about">About</router-link>
          <router-link class="pl-3 title" to="/users">Users</router-link>
          <router-link v-if="!user" class="pl-3 title" to="/register"
            >Register</router-link
          >
          <router-link v-if="!user" class="pl-3 title" to="/signin"
            >Sign In</router-link
          >
          <a v-if="user" class="pl-3 title" @click="logout">Sign Out</a>
          <router-link class="pl-3 title" v-if="isAdminUser" to="/admin"
            >Admin</router-link
          >
          <router-link v-if="user" class="pl-3 title" to="/profile"
            >Profile</router-link
          >
          <span @click="toggleDark()" class="pl-20 title"
            >{{ isDark ? "Dark" : "Light" }} Mode</span
          >
        </div>
      </div>
    </v-sheet>
    <div>
      <h1
        class="text-6xl absolute left-24 top-64 uppercase text-[#F8F6F6] w-2/5"
      >
        Masters System for Postgraduate students.
      </h1>
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import io from "socket.io-client";
import { useStore } from "vuex";
import { useDark, useToggle } from "@vueuse/core";
import UTMLogo from "@/assets/images/utmLogo.png";
import UTMLogoBlack from "@/assets/images/utmLogoBlack.png";
// Constants
const isDark = useDark();
const toggleDark = useToggle(isDark);
const store = useStore();
console.log(isDark.value);
// Computed property to get the user from the store
const user = computed(() => store.state.user);

// Computed property to check if the user is logged in
const isAdminUser = computed(
  () => user.value !== null && user.value.role === "admin"
);

// Function to handle user logout
const logout = () => {
  store.dispatch("logoutUser");
};

const socket = ref(null);

// onMounted(() => {
//   socket.value = io("http://localhost:8000");
//   socket.value.on("connect", () => {
//     console.log("Socket.IO connected");
//   });

//   socket.value.on("message", (data) => {
//     console.log("Received:", data);
//   });
//   // Handle disconnect (if needed)
//   socket.value.on("disconnect", () => {
//     console.log("Socket.IO disconnected");
//   });
// });
</script>

<style lang="scss" scoped>
.glass-background {
  background: linear-gradient(
    to top right,
    rgba(217, 175, 217, 0.8),
    rgba(151, 217, 225, 0.8)
  );
  /* You can adjust the gradient angle and colors as needed */
  backdrop-filter: blur(10px);
  /* Adjust the blur level for the glass effect */
  -webkit-backdrop-filter: blur(10px); /* For compatibility with Safari */
}
.glass-backgroundDark {
  background: linear-gradient(
    to top right,
    rgba(13, 13, 13, 1),
    rgba(28, 13, 13, 1)
  );
  /* You can adjust the gradient angle and colors as needed */
  backdrop-filter: blur(10px);
  /* Adjust the blur level for the glass effect */
  -webkit-backdrop-filter: blur(10px); /* For compatibility with Safari */
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  /* Adjust the opacity by changing the last parameter (0.45) */
  backdrop-filter: blur(3px);
  /* Apply the blur effect to the overlay */
  pointer-events: none;
}
.title {
  font-family: "DM Sans", sans-serif;
  font-size: 20px;
}
</style>
