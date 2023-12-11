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
        <v-col cols="10" class="main">
          <div class="pt-4 upperDiv">
            <h1 class="text-3xl font-medium title">My Project</h1>
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

                <v-window-item value="two"> Two </v-window-item>

                <v-window-item value="three"> Three </v-window-item>
                <v-window-item value="four"> <comments /> </v-window-item>
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
import { ref } from "vue";
import { useDark } from "@vueuse/core";

// Constants
const isDark = useDark();
const tab = ref("");
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
  padding-left: 10px;
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
