<template>
  <div class="mt-10">
    <div class="w-1/2">
      <h1 class="title text-lg font-medium">Your Examinees List</h1>
    </div>
    <div v-if="students || coStudents" class="w-4/5 mt-5">
      <div
        class="w-full h-[60px] rounded title bg-[#f5f5f5] dark:bg-neutral-800 flex items-center px-5 dark:text-white drop-shadow-sm border dark:border-none"
      >
        <h1 class="w-1/3">Name</h1>
        <h1 class="w-1/3 text-center">Email</h1>
        <h1 class="w-1/3 text-end">Matric No.</h1>
      </div>
      <div
        v-for="(student, index) in students"
        class="w-full h-[60px] rounded titleDes dark:bg-neutral-800 dark:even:bg-neutral-700 dark:text-white flex items-center px-5 mt-2 drop-shadow-sm even:bg-neutral-200 bg-[#f5f5f5] border dark:border-none"
      >
        <h1 class="w-1/3 truncate">{{ student.username }}</h1>
        <h1 class="w-1/3 text-center truncate">{{ student.email }}</h1>
        <h1 class="w-1/3 text-end">{{ student.matricCard }}</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";

// Constants

const isDark = useDark();
const students = ref([]);

// Functions
onMounted(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.user_id;
    const response = await axios.get(
      `http://localhost:8000/lecturer/myExaminees/${userId}`
    ); // Replace with your API endpoint
    students.value = response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
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
