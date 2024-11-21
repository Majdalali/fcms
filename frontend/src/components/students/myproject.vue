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
            <h1 class="text-3xl font-medium title">My Project</h1>
            <p class="text-lg titleDes font-light" v-if="sessionDate">
              The Masters System For Semester
              {{ sessionDate.session_semester }} -
              {{ sessionDate.session_title }}
            </p>
          </div>
          <div class="lowerDiv pt-10">
            <v-tabs
              :color="isDark ? '#FFC505' : 'indigo-darken-4'"
              bg-color="transparent"
              v-model="tab"
            >
              <v-tab class="v-tab" value="one">Project Info</v-tab>

              <v-tab class="v-tab" value="two">Comments</v-tab>
              <v-tab class="v-tab" value="three">Chairman Application</v-tab>
            </v-tabs>
            <v-divider class="lg:w-4/5"></v-divider>

            <v-card-text class="pl-0">
              <v-window v-model="tab">
                <v-window-item value="one">
                  <projectinfo />
                </v-window-item>

                <v-window-item value="two">
                  <comments />
                </v-window-item>
                <v-window-item value="three">
                  <ChairmanApp />
                </v-window-item>
              </v-window>
            </v-card-text>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import Navigation from "../navigation.vue";
import projectinfo from "./myProject/projectinfo.vue";
import comments from "./myProject/comments.vue";
import ChairmanApp from "./myProject/chairmanApp.vue";
import { ref, onMounted } from "vue";
import { useDark } from "@vueuse/core";
import axios from "axios";

// Constants
const isDark = useDark();
const tab = ref("");
const sessionDate = ref(null);
const apiUrl = import.meta.env.VITE_API_URL;

// Methods
onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl}/currentSession`);
    sessionDate.value = response.data;
  } catch (error) {
    console.error("Error fetching proposal deadline:", error);
    // Handle error for proposal deadline request
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
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  font-size: 18px;
}
.v-tab:first-child {
  text-align: start !important;
  padding-left: 0%;
}
</style>
