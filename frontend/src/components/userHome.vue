<template>
  <v-app
    :theme="isDark ? 'dark' : 'light'"
    :class="isDark ? 'tempDiv-dark' : 'tempDiv'"
  >
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="2" sm="0" class="nav sm:mb-5">
          <Navigation />
        </v-col>
        <v-col
          cols="12"
          md="12"
          lg="10"
          style="min-width: 70%; max-width: 100%"
          class="main"
        >
          <div class="pt-4 upperDiv">
            <h1 class="text-3xl font-medium title">Welcome Home!</h1>
            <p class="text-lg titleDes font-light">
              The MPDS System For Session
              {{ sessionInfo ? sessionInfo.session_title : "" }} -
              {{ sessionInfo ? sessionInfo.session_semester : "" }}
            </p>
          </div>
          <div class="lowerDiv pt-10">
            <v-tabs
              :color="isDark ? '#FFC505' : 'indigo-darken-4'"
              bg-color="transparent"
              v-model="tab"
            >
              <v-tab class="v-tab" value="one">Session</v-tab>
              <v-tab class="v-tab" value="two">Projects</v-tab>
              <v-tab class="v-tab" value="three">Students</v-tab>
              <v-tab class="v-tab" value="four">Supervisors</v-tab>
              <v-tab class="v-tab" value="five">Archive</v-tab>
            </v-tabs>
            <v-divider class="w-[90%]"></v-divider>

            <div class="pl-0">
              <v-window disabled v-model="tab">
                <v-window-item value="one">
                  <Session :sessionInfo="sessionInfo" />
                </v-window-item>

                <v-window-item value="two"> <Projects /> </v-window-item>

                <v-window-item value="three"> <Students /> </v-window-item>
                <v-window-item value="four"> <Lecturers /> </v-window-item>
                <v-window-item value="five"><Archive /> </v-window-item>
              </v-window>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script setup>
import { useDark } from "@vueuse/core";
import { ref, onMounted } from "vue";
import axios from "axios";

import Navigation from "./navigation.vue";
import Session from "./dashboard/session.vue";
import Students from "./dashboard/students.vue";
import Lecturers from "./dashboard/lecturers.vue";
import Projects from "./dashboard/projects.vue";
import Archive from "./dashboard/archive.vue";

// Constants
const isDark = useDark();
const tab = ref("");
const sessionInfo = ref(null);
const apiUrl = import.meta.env.VITE_API_URL;

// Functions
onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl}/currentSession`);
    sessionInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1488px) {
  .nav {
    max-width: 1%;
  }
  .main {
    min-width: 100% !important;
  }
}
@media screen and (max-width: 639px) {
  .main {
    margin-top: 20px !important;
  }
}

.title,
.titleDes {
  font-family: "DM Sans", sans-serif;
}
.tempDiv {
  background-color: #fdfefb !important;
}
.tempDiv-dark {
  background-color: #0d0d0d !important;
}
.v-tab {
  text-transform: capitalize;
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  font-size: 18px;
}
.v-tab:first-child {
  text-align: start !important;
  padding-left: 0%;
}
</style>
