<template>
  <div class="mt-10">
    <div class="w-1/2">
      <h1 class="title text-lg font-medium">Your Students List</h1>
    </div>
    <div class="w-4/5 mt-5">
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        single-line
        :rounded="0"
        variant="outlined"
        hide-details
      ></v-text-field>
      <v-data-table
        class="border"
        :headers="headers"
        :items="students"
        :search="search"
      >
        <template v-slot:item.username="{ item }">
          {{ item.username }}
          <v-chip
            v-if="item.coSupervised"
            class="ml-2"
            variant="flat"
            color="indigo"
            size="x-small"
          >
            Co-supervised
          </v-chip>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";

// Constants

const isDark = useDark();
const supervisedStudents = ref([]);
const coSupervisedStudents = ref([]);
const students = ref([]);
const search = ref("");
const headers = ref([
  { key: "username", title: "Name" },
  { key: "email", title: "Email" },
  { key: "matricCard", title: "Matric No." },
  { key: "program", title: "Program" },
]);
const apiUrl = import.meta.env.VITE_API_URL;

// Functions
onMounted(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.user_id;
    const response = await axios.get(`${apiUrl}/lecturer/mystudents/${userId}`); // Replace with your API endpoint
    supervisedStudents.value = response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.user_id;
    const response = await axios.get(
      `${apiUrl}/lecturer/myCoSupervisedStudents/${userId}`
    ); // Replace with your API endpoint
    coSupervisedStudents.value = response.data.map((student) => {
      return {
        ...student,
        coSupervised: true,
      };
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
  students.value.push(
    ...supervisedStudents.value,
    ...coSupervisedStudents.value
  );
});
</script>

<style lang="scss" scoped>
.title {
  font-family: "DM Sans", sans-serif;
  font-weight: 400;
  font-size: 1.125rem /* 18px */;
  line-height: 1.75rem /* 28px */;
}
.titleDes {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem /* 18px */;
  line-height: 1.75rem /* 28px */;
}
</style>
