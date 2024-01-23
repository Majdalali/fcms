<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-xl font-medium">Session & Semester Calendar</h1>
      <p class="titleDes text-base font-light">
        Keep track of the important dates
      </p>
    </div>
    <!-- Session -->
    <div class="pt-10 h-full w-[90%]">
      <v-container>
        <div v-if="sessionInfo">
          <v-row no-gutters>
            <v-col cols="8">
              <SessionCard
                :elevation="4"
                backgroundColor="#800000"
                title="Session"
                :data="sessionInfo.session_title"
              />
            </v-col>
            <v-col>
              <SessionCard
                :elevation="4"
                :backgroundColor="isDark ? 'grey-darken-4' : '#E7E5DF'"
                title="Semester"
                :data="sessionInfo.session_semester"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <SessionCard
                :elevation="4"
                :backgroundColor="isDark ? '#FDFEFB' : '#0D0D0D'"
                title="Proposal"
                :data="sessionInfo.proposal"
              />
            </v-col>

            <v-col>
              <SessionCard
                :elevation="4"
                backgroundColor="#FFC505"
                title="Progress 1"
                :data="sessionInfo.progress_one"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <SessionCard
                :elevation="4"
                :backgroundColor="isDark ? 'grey-darken-4' : '#E7E5DF'"
                title="Progress 2"
                :data="sessionInfo.progress_two"
              />
            </v-col>

            <v-col cols="8">
              <SessionCard
                :elevation="4"
                backgroundColor="#800000"
                title="Final Report"
                :data="sessionInfo.finalSubmission"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <SessionCard
                :elevation="4"
                backgroundColor="#FFC505"
                title="Presentation & Demo"
                :data="sessionInfo.presentationAndDemo"
              />
            </v-col>

            <v-col>
              <SessionCard
                :elevation="4"
                :backgroundColor="isDark ? '#FDFEFB' : '#0D0D0D'"
                title="Correction"
                :data="sessionInfo.correction"
              />
            </v-col>
          </v-row>
        </div>
        <v-skeleton-loader
          elevation="4"
          type="heading, date-picker-options"
          v-else
        ></v-skeleton-loader>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import { ref, onMounted } from "vue";
import axios from "axios";
import SessionCard from "./sessioncard.vue";

// Constants
const isDark = useDark();
const sessionInfo = ref(null);
const apiUrl = import.meta.env.VITE_API_URL;

// Functions
onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl}/currentSession`);
    sessionInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
});
</script>

<style lang="scss" scoped>
.title,
.titleDes {
  font-family: "DM Sans", sans-serif;
}
.titleData {
  font-family: "Work Sans", sans-serif;
}
</style>
