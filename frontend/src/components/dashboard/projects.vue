<template>
  <div>
    <div class="pt-10 mb-5">
      <h1 class="title text-lg font-medium">Projects</h1>
      <p class="titleDes text-base font-light">List of registered projects</p>
    </div>
    <div class="md:w-[90%]">
      <div v-if="!isLoading">
        <v-card :rounded="0" :elevation="0">
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            single-line
            :rounded="0"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-card>
        <v-data-table
          class="border"
          :headers="headers"
          :items="filteredProjectInfo"
          :search="search"
        >
        </v-data-table>
      </div>
      <v-skeleton-loader
        v-else
        class="mw-auto border"
        type="table"
      ></v-skeleton-loader>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Constants
const search = ref("");
const filteredProjectInfo = ref([]);
const isLoading = ref(false);
const headers = ref([
  { align: "start", key: "num", sortable: true, title: "Num.", width: "4%" },
  { key: "username", sortable: true, title: "Student", width: "10%" },
  {
    key: "projectInfo.projectTitle",
    sortable: true,
    title: "Project Title",
    width: "50%",
  },
  {
    key: "projectInfo.projectType",
    sortable: true,
    title: "Project Type",
    width: "17%",
  },
  {
    key: "projectInfo.projectArea",
    sortable: true,
    title: "Project Area",
    width: "17%",
  },
  { key: "user_program", sortable: true, title: "Program", width: "12%" },
  // Add other headers as needed
]);
const apiUrl = import.meta.env.VITE_API_URL;

// Functions

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${apiUrl}/projects`);
    const projectsWithNum = response.data.map((user, num) => ({
      ...user,
      num: num + 1,
    }));

    // Filter out rows with empty projectInfo
    filteredProjectInfo.value = projectsWithNum.filter(
      (item) => item.projectInfo && Object.keys(item.projectInfo).length > 0
    );
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});
</script>

<style lang="scss" scoped>
.title {
  font-family: "DM Sans", sans-serif;
}
.titleData,
.titleDes {
  font-family: "Work Sans", sans-serif;
}
</style>
