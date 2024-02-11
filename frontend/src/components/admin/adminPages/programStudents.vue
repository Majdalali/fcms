<template>
  <div>
    <div class="pt-10 mb-5">
      <h1 class="title text-lg font-medium">Students</h1>
      <p class="titleDes text-sm font-light">
        List of registered students for program
        <strong>{{ props.name }}</strong>
      </p>
    </div>
    <div class="md:w-[90%]">
      <div v-if="!noStudents">
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
          :items="students"
          :search="search"
        >
        </v-data-table>
      </div>
      <v-alert
        v-else
        type="info"
        variant="outlined"
        class="my-4"
        text="No students registered for this program"
      ></v-alert>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Constants
const props = defineProps({
  name: String,
  program: String,
});
const headers = ref([
  { key: "index", sortable: true, title: "No." },
  { key: "username", sortable: true, title: "Student Name" },
  { key: "email", sortable: false, title: "Email" },
  { key: "matricCard", sortable: false, title: "Matric No." },
  { key: "user_program", sortable: false, title: "Program" },
]);
const search = ref("");
const students = ref([]);
const noStudents = ref(false);
const apiUrl = import.meta.env.VITE_API_URL;
// Methods
onMounted(async () => {
  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.get(
      `${apiUrl}/api/students/${props.program}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    students.value = response.data.map((user, index) => ({
      ...user,
      index: index + 1,
    }));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      noStudents.value = true;
    }
  }
});
</script>

<style lang="scss" scoped>
.title {
  font-family: "DM Sans", sans-serif;
}
.titleDes {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem /* 18px */;
  line-height: 1.75rem /* 28px */;
}
</style>
