<template>
  <div class="mt-10">
    <div>
      <v-sheet
        :color="isDark ? '' : '#f5f5f5'"
        border
        :height="75"
        :elevation="2"
        class="w-1/2 rounded-lg"
      >
        <div class="h-full flex flex-row items-center">
          <h1 class="text-lg title absolute left-10 font-bold">Name</h1>
          <h1 class="text-lg font-Light titleDes absolute left-[20%]">
            {{ name }}
          </h1>
        </div>
      </v-sheet>
      <v-sheet
        :color="isDark ? '' : '#f5f5f5'"
        border
        :elevation="2"
        :height="75"
        class="w-1/2 mt-4 rounded-lg"
      >
        <div class="h-full flex flex-row items-center">
          <h1 class="text-lg title absolute left-10 font-bold">Email</h1>
          <h1 class="text-lg font-Light titleDes absolute left-[20%]">
            {{ email }}
          </h1>
        </div>
      </v-sheet>
    </div>
    <div class="mt-5"></div>
  </div>
</template>
<script setup>
import { useDark } from "@vueuse/core";
import { defineProps } from "vue";

const props = defineProps({
  name: String,
  email: String,
});

const isDark = useDark();
</script>

<style lang="scss" scoped>
.title {
  font-family: "DM Sans", sans-serif;
}
.titleDes {
  font-family: "Work Sans", sans-serif;
}
</style>
