<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="2">
          <Navigation />
        </v-col>
        <v-col cols="10">
          <div>
            <h1 class="text-4xl">About</h1>
            <p class="text-xl">This is the about page</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import Navigation from "./navigation.vue";
</script>

<style lang="scss" scoped></style>
