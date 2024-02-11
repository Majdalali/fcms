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
            <h1 class="text-3xl font-medium title">Lecturer Dashboard</h1>
            <p class="text-lg titleDes font-light">
              The MDMS System For Semester 2023/2024 - 1
            </p>
          </div>
          <div class="lowerDiv pt-10">
            <v-tabs
              :color="isDark ? '#FFC505' : 'indigo-darken-4'"
              bg-color="transparent"
              v-model="tab"
            >
              <v-tab class="v-tab" value="one">Supervised Students</v-tab>
              <v-tab class="v-tab" value="two">Examinees</v-tab>
              <v-tab class="v-tab" value="three">Comments</v-tab>
              <v-tab class="v-tab" value="six">Submissions</v-tab>
              <v-tab class="v-tab" value="four">Evaluation</v-tab>
              <v-tab class="v-tab" value="five">Nominations</v-tab>
            </v-tabs>
            <v-divider class="w-[90%]"></v-divider>

            <v-card-text class="pl-0">
              <v-window disabled v-model="tab">
                <v-window-item value="one"><MyStudents /> </v-window-item>

                <v-window-item value="two"><Examinees /> </v-window-item>

                <v-window-item value="three"
                  ><LecturerComments />
                </v-window-item>
                <v-window-item value="six"><Submissions /> </v-window-item>
                <v-window-item value="four"><Evaluation /> </v-window-item>
                <v-window-item value="five"><Nominations /> </v-window-item>
              </v-window>
            </v-card-text>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import { ref } from "vue";

import Navigation from "../navigation.vue";
import MyStudents from "./lecturerDashboard/mystudents.vue";
import LecturerComments from "./lecturerDashboard/lecturerComments.vue";
import Examinees from "./lecturerDashboard/examinees.vue";
import Nominations from "./lecturerDashboard/nominations.vue";
import Evaluation from "./lecturerDashboard/evaluation.vue";
import Submissions from "./lecturerDashboard/submissions.vue";

// Constants
const isDark = useDark();
const tab = ref("");
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
