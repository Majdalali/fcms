<template>
  <div>
    <div class="pt-10 mb-5">
      <h1 class="title text-xl font-medium">Projects</h1>
      <p class="titleDes text-base font-light">List of registered projects</p>
    </div>
    <div class="w-[90%]">
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
        :items="projectInfo"
        :search="search"
      >
        <template v-slot:item.projectInfo.projectTitle="{ item }">
          <div>
            <div class="titleInfo">{{ item.projectInfo.projectTitle }}</div>
            <div class="subtitle">{{ item.username }}</div>
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Constants
const search = ref("");
const projectInfo = ref([]);
const headers = ref([
  { align: "start", key: "num", sortable: true, title: "Num.", width: "4%" },
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

// Functions

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8000/projects`);
    projectInfo.value = response.data.map((user, num) => ({
      ...user,
      num: num + 1,
    }));
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});
</script>

<style lang="scss" scoped>
.title,
.titleDes {
  font-family: "DM Sans", sans-serif;
}
.titleData {
  font-family: "Work Sans", sans-serif;
}
.titleInfo {
  font-weight: bold;
}

.subtitle {
  color: #888;
  font-size: 0.9em;
}
</style>
