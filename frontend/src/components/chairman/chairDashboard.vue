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
            <h1 class="title text-lg font-medium">Chairman Dashboard</h1>
            <v-banner
              color="indigo"
              icon="mdi-information"
              class="titleDes text-base font-light mt-3"
              text="This page is still under development and will be available soon."
            >
            </v-banner>
          </div>
          <div class="lowerDiv pt-10"></div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import { ref, onMounted } from "vue";
import Navigation from "../navigation.vue";

const isDark = useDark();
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
</style>
