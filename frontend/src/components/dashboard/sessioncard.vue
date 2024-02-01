<template>
  <v-sheet :elevation="elevation" :color="backgroundColor" class="pa-2 ma-2">
    <h1 class="title text-xl">{{ title }}</h1>
    <h1 v-if="data !== ''" class="titleData font-bold text-2xl">
      {{ data }}
    </h1>
    <h1 v-else class="titleData font-bold text-2xl">
      {{ formatDate(deadline.startDate) }} <span class="px-2">|</span>
      {{ formatDate(deadline.endDate) }}
    </h1>
  </v-sheet>
</template>

<script setup>
const props = defineProps({
  elevation: Number,
  backgroundColor: String,
  title: String,
  data: String,
  deadline: String,
});

const formatDate = (timestamp) => {
  const date = new Date(timestamp); // Assuming timestamp is already in milliseconds
  return date.toLocaleString("en-UK", {
    year: "numeric",
    day: "numeric",
    month: "numeric",
  }); // Format the date as per the locale
};
</script>

<style scoped>
.title,
.titleData {
  font-family: "DM Sans", sans-serif;
}
.pa-2 {
  height: 7.5rem /* 112px */;
  border-radius: 10px;
}
.ma-2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
