<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">Comments</h1>
      <p class="titleDes text-base font-light">
        Suggestions and comments from the supervisor and examiners regarding
        your project
      </p>
    </div>
    <div class="pt-10 h-full lg:w-4/5">
      <v-alert
        variant="outlined"
        type="warning"
        v-show="errorMessage !== ''"
        :text="errorMessage"
      >
      </v-alert>
      <v-expansion-panels class="mb-5 ml-1">
        <v-expansion-panel
          :color="isDark ? '' : '#f5f5f5'"
          :elevation="4"
          class="mt-5 expantionPanel"
          v-for="(comment, index) in comments"
          :key="index"
        >
          <template v-slot:title
            ><h1 class="title font-bold text-lg">
              {{ getLecturerRole(comment.lecturerId) }}
            </h1>
            <h1 :class="getCommentClasses(comment.lecturerId)">
              {{ comment.lecturerName }}
            </h1></template
          >
          <template v-slot:text>
            <p
              v-html="comment.commentContent"
              class="commentContent text-lg pt-2"
            ></p>
            <p class="commentContent text-base mt-4 font-light">
              Posted On {{ formatDate(comment.createdAt) }}
            </p>
            <!-- You can add other details you want to display for each comment -->
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";
const isDark = useDark();
const comments = ref(null);
const errorMessage = ref("");
const apiUrl = import.meta.env.VITE_API_URL;

onMounted(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const studentId = storedUser.user_id;
    const response = await axios.get(`${apiUrl}/mycomments/${studentId}`);

    comments.value = response.data;
  } catch (error) {
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.message === "No comments found for this student"
    ) {
      errorMessage.value = "Please check back later for comments";
    } else {
      errorMessage.value = "An error occurred while fetching comments";
    }
  }
});

const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }); // Format the date as per the locale
};

const getLecturerRole = (lecturerId) => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  if (storedUser.supervisor === lecturerId) {
    return "Supervisor";
  } else if (storedUser.examiners.includes(lecturerId)) {
    return "Examiner";
  } else if (storedUser.coSupervisors.includes(lecturerId)) {
    return "Co-Supervisor";
  }
  return "";
};

const getCommentClasses = (lecturerId) => {
  return {
    commentContent: true,
    uppercase: true,
    "text-lg": true,
    "font-light": true,
    "ml-10": getLecturerRole(lecturerId) !== "", // Add ml-10 class if getLecturerRole is not empty
  };
};
</script>

<style lang="scss" scoped>
.titleDes,
.title {
  font-family: "DM Sans", sans-serif;
}
.expantionPanel:first-child {
  margin-top: 0px !important;
}
.commentContent {
  font-family: "Source Sans Pro", sans-serif;
}
</style>
