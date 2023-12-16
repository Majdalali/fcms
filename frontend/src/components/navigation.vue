<template>
  <div>
    <v-navigation-drawer
      :theme="isDark ? 'dark' : 'light'"
      class="dark:bg-[#0D0D0D]"
    >
      <v-list-item
        class="pt-8"
        title="Masters Project"
        subtitle="Faculty of Computing"
      ></v-list-item>
      <v-divider class="mt-2"></v-divider>
      <v-list class="h-[90%]">
        <ul class="pt-2 h-full flex flex-col justify-between">
          <div>
            <router-link to="/dashboard">
              <v-list-item
                :prepend-icon="homeIconVue"
                title="Home"
                link
                class="vli"
              ></v-list-item>
            </router-link>

            <router-link to="/activity-feed">
              <v-list-item
                :prepend-icon="bellVue"
                title="Notification"
                link
                class="vli"
              ></v-list-item
            ></router-link>
            <router-link to="/myproject">
              <v-list-item
                :prepend-icon="bookmarkVue"
                title="My Project"
                link
                class="vli"
              ></v-list-item
            ></router-link>

            <router-link to="/profile">
              <v-list-item
                :prepend-icon="userVue"
                title="Profile"
                link
                class="vli"
              ></v-list-item>
            </router-link>
          </div>
          <div>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              location="end"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  :prepend-icon="settings"
                  title="Settings"
                  v-bind="props"
                  link
                  class="vli"
                >
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

            <v-list-item
              :prepend-icon="question"
              title="Contact Us"
              class="vli"
              link
            >
            </v-list-item>
            <v-dialog width="500">
              <template v-slot:activator="{ props }">
                <v-list-item
                  :prepend-icon="logout"
                  title="Sign Out"
                  v-bind="props"
                  link
                >
                </v-list-item>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="Signing Out!">
                  <v-card-text class="text-red-400">
                    Are you sure you want to sign out?
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      text="Cancel"
                      @click="isActive.value = false"
                    ></v-btn>
                    <v-btn text="Sign Out" @click="signout()"></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>
        </ul>
      </v-list>

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
.vli {
  font-family: "Dm Sans", sans-serif;
}
.vli :deep(.v-list-item-title) {
  font-weight: 500;
}
.router-link-active {
  color: #6589ff; /* Change text color */
}
.switch {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
