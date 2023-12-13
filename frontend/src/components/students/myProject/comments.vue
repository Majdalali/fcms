<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-xl font-medium">Comments</h1>
      <p class="titleDes text-base font-light">
        Suggestions and comments from the supervisor and examiners regarding
        your project
      </p>
    </div>
    <div class="pt-10 h-full">
      <v-expansion-panels>
        <v-expansion-panel
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

const comments = ref(null);
const getLecturerName = async (lecturerId) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/lecturer/${lecturerId}`
    );
    return response.data.username;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

onMounted(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const studentId = storedUser.user_id;
    const response = await axios.get(
      `http://localhost:8000/mycomments/${studentId}`
    );
    comments.value = response.data;

    // Fetch lecturer names for comments
    for (const comment of comments.value) {
      comment.lecturerName = await getLecturerName(comment.lecturerId);
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
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
