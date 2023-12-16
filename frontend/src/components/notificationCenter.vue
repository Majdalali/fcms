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
            <h1 class="text-3xl font-medium title">Notifications Center</h1>
            <p class="text-lg titleDes font-light">
              Stay Updated with Important Notices and announcements!
            </p>
          </div>
          <div class="lowerDiv pt-10"></div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script setup>
import Navigation from "./navigation.vue";
import { useDark } from "@vueuse/core";
import { ref } from "vue";

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
