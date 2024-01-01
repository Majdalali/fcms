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
            <h1 class="text-3xl font-medium title">Admin Dashboard!</h1>
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
              <v-tab class="v-tab" value="one">Sessions</v-tab>
              <v-tab class="v-tab" value="two">Evaluations</v-tab>
              <v-tab class="v-tab" value="three">Nominations</v-tab>
              <v-tab class="v-tab" value="four">Proposals</v-tab>
              <v-tab class="v-tab" value="five">Archive</v-tab>
            </v-tabs>
            <v-divider class="w-[90%]"></v-divider>

            <v-card-text class="pl-0">
              <v-window v-model="tab">
                <v-window-item value="one"><AdminSession /> </v-window-item>

                <v-window-item value="two"> </v-window-item>

                <v-window-item value="three"> </v-window-item>
                <v-window-item value="four"> <AdminProposals /></v-window-item>
                <v-window-item value="five">five </v-window-item>
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
import AdminSession from "./adminPages/adminSession.vue";
import AdminProposals from "./adminPages/adminProposals.vue";

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
