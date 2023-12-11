<template>
  <v-app class="dark:bg-slate-700">
    <v-bar
      :elevation="8"
      density="comfortable"
      class="col-12 bg-gray-200 py-4 dark:bg-slate-900"
    >
      <router-link class="font-bold pl-3 dark:text-white" to="/"
        >Home</router-link
      >
      <router-link class="pl-3 dark:text-white" to="/about">About</router-link>
      <router-link class="pl-3 dark:text-white" to="/users">Users</router-link>
      <router-link v-if="!user" class="pl-3 dark:text-white" to="/register"
        >Register</router-link
      >
      <router-link v-if="!user" class="pl-3 dark:text-white" to="/signin"
        >Sign In</router-link
      >
      <a v-if="user" class="pl-3 dark:text-white" @click="logout">Sign Out</a>
      <router-link class="pl-3 dark:text-white" v-if="isAdminUser" to="/admin"
        >Admin</router-link
      >
      <router-link v-if="user" class="pl-3 dark:text-white" to="/profile"
        >Profile</router-link
      >
      <span @click="toggleDark()" class="dark:text-white pl-20"
        >{{ isDark ? "Dark" : "Light" }} Mode</span
      >
    </v-bar>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useDark, useToggle } from "@vueuse/core";
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
</script>

<style lang="scss" scoped></style>
