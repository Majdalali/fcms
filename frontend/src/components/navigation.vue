<template>
  <div>
    <div class="z-20 absolute top-0 w-full left-0 hidden toolBar">
      <v-toolbar
        :collapse="!drawer"
        :elevation="2"
        :color="isDark ? '#151515' : 'white'"
      >
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-toolbar-title>Masters Project</v-toolbar-title>
      </v-toolbar>
    </div>
    <div class="relative z-10">
      <v-navigation-drawer
        v-model="drawer"
        :theme="isDark ? 'dark' : 'light'"
        :mobile-breakpoint="1488"
        class="h-full dark:bg-[#151515]"
      >
        <v-list class="h-full flex flex-col">
          <v-list-item class="min-h-0 vli" title="Masters P&D System">
            <v-list-item-subtitle>
              <span class="font-medium text-amber-300">{{
                user.isAdmin
                  ? "Admin view"
                  : user.isCoordinator
                  ? "Coordinator view"
                  : userType === "lecturer"
                  ? "Lecturer view"
                  : "Student view"
              }}</span>
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider class="mt-2"></v-divider>
          <v-list v-model:opened="open" class="min-h-0 flex-grow">
            <ul class="h-full overflow-y-auto flex flex-col justify-between">
              <div>
                <router-link
                  v-for="navigation in navigationMenu"
                  :to="navigation.link"
                >
                  <v-list-item
                    v-if="navigation.condidtion"
                    :prepend-icon="navigation.icon"
                    :title="navigation.title"
                    link
                    class="vli"
                  ></v-list-item>
                </router-link>
                <v-list-group value="project" v-if="userType === 'student'">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      :prepend-icon="bookmarkVue"
                      v-bind="props"
                      class="vli"
                      link
                    >
                      <template v-slot:title>
                        <router-link to="/myproject">
                          <p>My Project</p>
                        </router-link>
                      </template>
                    </v-list-item>
                  </template>

                  <router-link to="/myproject/proposal">
                    <v-list-item
                      title="Proposal"
                      class="vli"
                      link
                    ></v-list-item>
                  </router-link>
                  <router-link to="/myproject/1">
                    <v-list-item
                      title="Project 1"
                      class="vli"
                      link
                    ></v-list-item>
                  </router-link>
                  <router-link to="/myproject/2">
                    <v-list-item
                      title="Project 2"
                      class="vli"
                      link
                    ></v-list-item>
                  </router-link>
                </v-list-group>
              </div>
              <div>
                <router-link
                  v-for="navigation in secondNavigationMenu"
                  :to="navigation.link"
                >
                  <v-list-item
                    v-if="navigation.condidtion"
                    :prepend-icon="navigation.icon"
                    :title="navigation.title"
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
                <router-link to="/contact">
                  <v-list-item
                    :prepend-icon="question"
                    title="Contact Us"
                    class="vli"
                    link
                  >
                  </v-list-item
                ></router-link>

                <v-dialog width="500">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      :prepend-icon="logout"
                      title="Sign Out"
                      v-bind="props"
                      link
                      class="vli"
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
        </v-list>
      </v-navigation-drawer>
    </div>
  </div>
</template>

<script setup>
// Import System requirements
import { useDark, useToggle } from "@vueuse/core";
import { ref, markRaw } from "vue";
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
import dashboard from "@/assets/icons/dashboard.vue";
import admin from "@/assets/icons/admin.vue";
import forms from "@/assets/icons/forms.vue";
import presentation from "@/assets/icons/presentation.vue";
import calendar from "../assets/icons/calendar.vue";
import grades from "../assets/icons/grades.vue";
import marks from "../assets/icons/marks.vue";

// Constants
const store = useStore();
const isDark = useDark();
const toggleDark = useToggle(isDark);
const drawer = ref(true);
const menu = ref(false);
const currentMode = ref(isDark.value);
const user = JSON.parse(localStorage.getItem("user"));
const userType = user.user_type;
const open = ref(["project"]);

const secondNavigationMenu = ref({
  forms: {
    icon: markRaw(forms),
    title: "Viva Forms",
    condidtion: true,
    link: "/forms",
  },
  calendar: {
    icon: markRaw(calendar),
    title: "Calendar",
    condidtion: true,
    link: "/calendar",
  },
  presentation: {
    icon: markRaw(presentation),
    title: "Presentation",
    condidtion: true,
    link: "/presentation-schedule",
  },
  rubric: {
    icon: markRaw(grades),
    title: "Evaluation Rubric",
    condidtion: true,
    link: "/evaluation-rubrics",
  },
  marksAnalysis: {
    icon: markRaw(marks),
    title: "Marks Analysis",
    condidtion:
      (userType === "lecturer" && user.isAdmin === true) ||
      user.isCoordinator === true,
    link: "/marks-analysis",
  },
});

const navigationMenu = ref({
  home: {
    icon: markRaw(homeIconVue),
    title: "Home",
    condidtion: true,
    link: "/home",
  },
  lecturer: {
    icon: markRaw(dashboard),
    title: "Dashboard",
    link: "/lecturer-dashboard",
    condidtion: userType === "lecturer",
  },
  admin: {
    icon: markRaw(admin),
    title: "Admin",
    link: "/admin",
    condidtion: userType === "lecturer" && user.isAdmin === true,
  },
  coordinator: {
    icon: markRaw(admin),
    title: "Coordinator",
    link: "/coordinator",
    condidtion: userType === "lecturer" && user.isCoordinator === true,
  },
  notification: {
    icon: markRaw(bellVue),
    title: "Notification",
    link: "/activity-feed",
    condidtion: true,
  },

  profile: {
    icon: markRaw(userVue),
    title: "Profile",
    link: userType === "student" ? "/profile" : "/lecturer-profile",
    condidtion: true,
  },
});

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

@media screen and (max-width: 1488px) {
  .toolBar {
    display: block;
  }
}
</style>
