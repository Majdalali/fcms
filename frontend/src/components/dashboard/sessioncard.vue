<template>
  <v-sheet :elevation="elevation" :color="backgroundColor" class="pa-2 ma-2">
    <h1 class="title text-xl">{{ title }}</h1>
    <h1 class="titleData font-bold text-2xl">{{ data }}</h1>
  </v-sheet>
</template>

<script>
export default {
  props: {
    elevation: Number,
    backgroundColor: String,
    title: String,
    data: String,
  },
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
