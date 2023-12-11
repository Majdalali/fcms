<template>
  <div>
    <v-navigation-drawer
      :theme="isDark ? 'dark' : 'light'"
      class="dark:bg-[#0D0D0D]"
    >
      <v-list-item
        class="pt-8 h-[8%]"
        title="FCMS"
        subtitle="Dashboard"
      ></v-list-item>
      <v-divider></v-divider>
      <ul class="pt-4 h-[90%] flex flex-col justify-between">
        <div>
          <v-list-item link class=""
            ><router-link to="/dashboard">
              <li class="flex">
                <v-icon class=""><homeIconVue /></v-icon>
                <span class="vli font-medium" link> Home </span>
              </li></router-link
            ></v-list-item
          >
          <v-list-item link>
            <router-link to="/about">
              <li class="flex">
                <v-icon><bellVue /></v-icon>
                <span class="vli font-medium" link> Notification </span>
              </li></router-link
            >
          </v-list-item>
          <v-list-item link>
            <router-link to="/myproject">
              <li class="flex">
                <v-icon><bookmarkVue /></v-icon>
                <span class="vli font-medium" link> My Project </span>
              </li></router-link
            >
          </v-list-item>

          <v-list-item link>
            <router-link to="/profile">
              <li class="flex">
                <v-icon><userVue /></v-icon>
                <span class="vli font-medium" link> Profile </span>
              </li></router-link
            >
          </v-list-item>
        </div>
        <div>
          <v-menu v-model="menu" :close-on-content-click="false" location="end">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" link>
                <li class="flex">
                  <v-icon><settings /></v-icon>
                  <span class="vli font-medium" link> Settings </span>
                </li>
              </v-list-item>
            </template>
            <v-card min-width="300">
              <div class="p-2">
                <v-switch
                  v-model="currentMode"
                  @change="toggleDark()"
                  color="indigo"
                  inset
                  label="Night Mode"
                  hide-details
                ></v-switch>
              </div>
            </v-card>
          </v-menu>

          <v-list-item link>
            <li class="flex">
              <v-icon><question /></v-icon>
              <span class="vli font-medium" link> Contact Us </span>
            </li>
          </v-list-item>
          <v-dialog width="500">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" link>
                <li class="flex">
                  <v-icon><logout /></v-icon>
                  <span class="vli font-medium" link> Sign Out </span>
                </li>
              </v-list-item>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="Signing Out!">
                <v-card-text class="text-red-400">
                  Are you sure you want to sign out?
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
                  <v-btn text="Sign Out" @click="signout()"></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>
      </ul>

      <!-- Add more items as needed -->
    </v-navigation-drawer>
  </div>
</template>

<script setup>
// Import System requirements
import { useDark, useToggle } from "@vueuse/core";
import { ref } from "vue";
import { useStore } from "vuex";
import router from "@/router";
// Import icons
import homeIconVue from "@/assets/icons/homeIcon.vue";
import bellVue from "@/assets/icons/bell.vue";
import bookmarkVue from "@/assets/icons/bookmark.vue";
import userVue from "@/assets/icons/user.vue";
import logout from "@/assets/icons/logout.vue";
import question from "@/assets/icons/question.vue";
import settings from "@/assets/icons/settings.vue";

// Constants
const store = useStore();
const isDark = useDark();
const toggleDark = useToggle(isDark);
const menu = ref(false);
const currentMode = ref(isDark.value);

// Functions
const signout = () => {
  store.dispatch("logoutUser");
  router.push("/");
};
</script>

<style lang="scss" scoped>
li {
  padding-top: 0.5rem /* 8px */;
  padding-bottom: 0.5rem /* 8px */;
}

.vli {
  font-family: "Dm Sans", sans-serif;
  font-size: 16px;
  text-transform: capitalize;
  padding-left: 10px;
}
.router-link-active {
  color: #6589ff; /* Change text color */
}
.switch {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
