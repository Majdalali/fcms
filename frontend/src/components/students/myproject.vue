<template>
  <v-app
    :theme="isDark ? 'dark' : 'light'"
    :class="isDark ? 'tempDiv-dark' : 'tempDiv'"
  >
    <v-container fluid>
      <v-row>
        <v-col cols="2" class="nav">
          <Navigation />
        </v-col>
        <v-col class="main">
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
              <v-tab class="v-tab" value="two">Proposal</v-tab>
              <v-tab class="v-tab" value="three">Progress 1</v-tab>
              <v-tab class="v-tab" value="four">Progress 2</v-tab>
              <v-tab class="v-tab" value="five">Final Submission</v-tab>
              <v-tab class="v-tab" value="six">Presentation & Demo</v-tab>
              <v-tab class="v-tab" value="seven">Corrections</v-tab>
              <v-tab class="v-tab" value="eight">Comments</v-tab>
            </v-tabs>
            <v-divider class="w-[90%]"></v-divider>

            <v-card-text class="pl-0">
              <v-window v-model="tab">
                <v-window-item value="one">
                  <projectinfo />
                </v-window-item>
                <v-window-item value="two">
                  <fileUpload
                    type="proposals"
                    extrasType="proposalsExtras"
                    name="Proposal"
                    dateType="proposal"
                    :submissionDate="sessionDate"
                  />
                  <!-- <proposal /> -->
                </v-window-item>
                <v-window-item value="three">
                  <fileUpload
                    type="progressOne"
                    extrasType="progressOneExtras"
                    :name="typeNameP1"
                    dateType="progress_one"
                    :submissionDate="sessionDate"
                  />
                  <!-- <progressOne /> -->
                </v-window-item>
                <v-window-item value="four">
                  <fileUpload
                    type="progressTwo"
                    extrasType="progressTwoExtras"
                    :name="typeNameP2"
                    dateType="progress_two"
                    :submissionDate="sessionDate"
                  />
                </v-window-item>
                <v-window-item value="five"
                  ><fileUpload
                    type="finalSubmission"
                    extrasType="finalSubmissionExtras"
                    name="Final Submission"
                    dateType="finalSubmission"
                    :submissionDate="sessionDate"
                /></v-window-item>
                <v-window-item value="six">
                  <fileUpload
                    type="presentationAndDemos"
                    extrasType="presentationAndDemosExtras"
                    name="Presentation"
                    dateType="presentationAndDemo"
                    :submissionDate="sessionDate"
                  />
                </v-window-item>
                <v-window-item value="seven">
                  <fileUpload
                    type="corrections"
                    extrasType="correctionsExtras"
                    name="Corrections"
                    dateType="correction"
                    :submissionDate="sessionDate"
                  />
                </v-window-item>
                <v-window-item class="w-2/3" value="eight">
                  <comments />
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
// import proposal from "./myProject/proposal.vue";
// import progressOne from "./myProject/progressOne.vue";
import fileUpload from "./myProject/fileUpload.vue";
import { ref, onMounted } from "vue";
import { useDark } from "@vueuse/core";
import axios from "axios";

// Constants
const isDark = useDark();
const tab = ref("");
const sessionDate = ref(null);
const typeNameP2 = ref("Progress 2");
const typeNameP1 = ref("Progress 1");
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
@media screen and (max-width: 1500px) {
  .nav {
    display: none;
  }
}
.title {
  font-family: "DM Sans", sans-serif;
}
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
