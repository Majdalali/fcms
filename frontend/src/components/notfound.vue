<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <HomeNavigation />
    <v-container fluid class="max-w-screen-xl">
      <div class="max-w-screen-xl m-auto text-center">
        <div>
          <h1 class="title mt-32">404 Page not found</h1>
          <p class="titleSecondary my-8">
            The page you are trying to access does not exist.<br />
            Please go back and try again.
          </p>
          <span class="text-6xl">🧐</span>
        </div>
        <router-link to="/">
          <v-btn
            variant="outlined"
            size="large"
            text="Go back home &#8594;"
            class="mt-5"
          ></v-btn>
        </router-link>
      </div>
    </v-container>
  </v-app>
</template>

<script setup>
import HomeNavigation from "./homeNavigation.vue";
import { useDark } from "@vueuse/core";

const isDark = useDark();
</script>

<style lang="scss" scoped>
.title {
  font-family: "DM Sans", sans-serif;
  font-size: 72px;
  font-weight: 700;
  line-height: 5.4rem;
}
.titleSecondary {
  font-family: "DM Sans", sans-serif;
  font-size: 20px;
  font-weight: 400;
}
.titlePara {
  font-family: "DM Sans", sans-serif;
  font-size: 20px;
  font-weight: normal;
}
</style>
