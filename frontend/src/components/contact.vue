<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <HomeNavigation />
    <v-container fluid class="max-w-screen-xl">
      <div class="max-w-screen-xl m-auto">
        <div>
          <h1 class="title mt-32 text-center">Contact Us</h1>
        </div>
        <div>
          <div class="mt-10">
            <h1 class="titleSecondary">Contact us via email</h1>
            <p class="titlePara">
              If you have any questions or need help, please feel free to
              contact us at
              <a href="mailto:" class="text-[#6589ff]">example@utm.my</a>
              <br />
              or you can contact the administrator at
              <a href="mailto:" class="text-[#6589ff]">example@utm.my</a>
            </p>
          </div>
          <div class="mt-8">
            <h1 class="titleSecondary">Address</h1>
            <p class="titlePara">
              Faculty of Computing <br />
              Universiti Teknologi Malaysia <br />
              81310 UTM Johor Bahru <br />
              Johor, Malaysia
            </p>
          </div>
        </div>
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
  font-size: 24px;
  font-weight: bold;
}
.titlePara {
  font-family: "DM Sans", sans-serif;
  font-size: 20px;
  font-weight: normal;
}
</style>
