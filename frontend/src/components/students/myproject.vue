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
              <v-tab class="v-tab" value="four">Comments</v-tab>
            </v-tabs>
            <v-divider class="w-[90%]"></v-divider>

            <v-card-text class="pl-0">
              <v-window v-model="tab">
                <v-window-item value="one">
                  <projectinfo />
                </v-window-item>

                <v-window-item value="two"> <proposal /> </v-window-item>

                <v-window-item value="three"> Three </v-window-item>
                <v-window-item class="w-2/3" value="four">
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
import proposal from "./myProject/proposal.vue";
import { ref, onMounted } from "vue";
import { useDark } from "@vueuse/core";
import axios from "axios";

// Constants
const isDark = useDark();
const tab = ref("");
const sessionDate = ref(null);

// Methods
onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8000/currentSession`);
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
