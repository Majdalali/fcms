<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <HomeNavigation />
    <v-container class="max-w-max">
      <div class="max-w-screen-xl m-auto">
        <div>
          <h1 class="title mt-32 text-center">
            MPDS - Masters Project & Dissertation System
          </h1>
        </div>
        <div>
          <div class="mt-10">
            <h1 class="titleT">Who Are We</h1>
            <p class="titlePara">
              The system was built by the faculty of computing and the Applied
              Industrial Analytics Research Group (<a
                href="https://comp.utm.my/alias"
                target="_blank"
                class="text-[#6589ff]"
                >ALIAS</a
              >)
            </p>
          </div>
          <div class="mt-8">
            <h1 class="titleSecondary">The system for all masters students</h1>
            <p class="titlePara">
              The system is designed to help students manage their projects and
              dissertations. It is a one-stop solution for all masters students.
            </p>
          </div>
          <div class="mt-8">
            <h1 class="titleSecondary">What can you do?</h1>
            <p class="titlePara">
              The system allows students to manage their projects and
              dissertations like submitting their progress/work and recieve
              feedback, and also allows supervisors and examiners to manage
              their students and provide comments, evaluations, and more.
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
.titleT {
  font-family: "DM Sans", sans-serif;
  font-size: 48px;
  font-weight: 700;
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

@media (max-width: 635px) {
  .title {
    font-size: 40px;
    line-height: 3rem;
  }
  .titleT {
    font-size: 32px;
  }
  .titleSecondary {
    font-size: 20px;
  }
  .titlePara {
    font-size: 16px;
  }
}
</style>
