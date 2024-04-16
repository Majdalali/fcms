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
            <h1 class="text-3xl font-medium title">
              My Project <v-icon size="small">mdi-chevron-right</v-icon> Project
              2 / Dissertation 3
            </h1>
            <p class="text-lg titleDes font-light" v-if="sessionDate">
              The Masters System For Semester
              {{ sessionDate.session_semester }} -
              {{ sessionDate.session_title }}
            </p>
          </div>

          <div class="lowerDiv pt-10 w-fit">
            <v-tabs
              :color="isDark ? '#FFC505' : 'indigo-darken-4'"
              bg-color="transparent"
              v-model="tab"
            >
              <v-tab class="v-tab" value="three">Progress 1</v-tab>
              <v-tab class="v-tab" value="four">Progress 2</v-tab>
              <v-tab class="v-tab" value="five">Final Submission</v-tab>
              <v-tab class="v-tab" value="six">Presentation & Demo</v-tab>
              <v-tab class="v-tab" value="seven">Corrections</v-tab>
              <v-tab class="v-tab" value="eight">Evaluations</v-tab>
            </v-tabs>
            <v-divider></v-divider>
            <v-card-text class="pl-0">
              <v-window v-model="tab">
                <!--? Progress One -->
                <v-window-item value="three">
                  <fileUpload
                    type="progressOne"
                    extrasType="progressOneExtras"
                    :name="typeNameP1"
                    dateType="progress_one"
                    projectType="pTwo"
                    :submissionDate="sessionDate"
                  />
                </v-window-item>

                <!--? Progress Two -->
                <v-window-item value="four">
                  <fileUpload
                    type="progressTwo"
                    extrasType="progressTwoExtras"
                    :name="typeNameP2"
                    projectType="pTwo"
                    dateType="progress_two"
                    :submissionDate="sessionDate"
                  />
                </v-window-item>

                <!--? Final Submission -->
                <v-window-item value="five"
                  ><fileUpload
                    type="finalSubmission"
                    extrasType="finalSubmissionExtras"
                    projectType="pTwo"
                    name="Final Submission"
                    dateType="finalSubmission"
                    :submissionDate="sessionDate"
                /></v-window-item>

                <!--? Presentation & Demo -->
                <v-window-item value="six">
                  <fileUpload
                    type="presentationAndDemos"
                    extrasType="presentationAndDemosExtras"
                    name="Presentation"
                    projectType="pTwo"
                    dateType="presentationAndDemo"
                    :submissionDate="sessionDate"
                  />
                </v-window-item>

                <!--? Corrections -->
                <v-window-item value="seven">
                  <fileUpload
                    type="corrections"
                    extrasType="correctionsExtras"
                    name="Corrections"
                    projectType="pTwo"
                    dateType="correction"
                    :submissionDate="sessionDate"
                  />
                </v-window-item>

                <!--? Evaluations -->
                <v-window-item value="eight">
                  <studentEvals projectType="pTwo" />
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
import Navigation from "../../navigation.vue";
import fileUpload from "./fileUpload.vue";
import studentEvals from "./studentEvals.vue";
import { useDark } from "@vueuse/core";
import { ref, onMounted } from "vue";
import axios from "axios";

// Constants
const isDark = useDark();
const apiUrl = import.meta.env.VITE_API_URL;
const sessionDate = ref(null);
const typeNameP2 = ref("Progress 2");
const typeNameP1 = ref("Progress 1");
const tab = ref("");

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
.vCard:nth-child(1) {
  margin-top: 0px !important;
}
.v-tab {
  // text-transform: capitalize;
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  font-size: 18px;
}
.v-tab:first-child {
  text-align: start !important;
  padding-left: 0%;
}
</style>
