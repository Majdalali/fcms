<template>
  <div class="mt-10">
    <div class="w-1/2">
      <h1 class="title text-lg font-medium">
        Add Comments & Feedback to students
      </h1>
    </div>
    <div class="w-3/5 mt-5">
      <v-form>
        <v-autocomplete
          v-model="selectedStudent"
          clearable
          :items="students"
          :item-props="itemProps"
          item-title="name"
          item-value="id"
          label="Select Student"
        >
        </v-autocomplete>
        <v-textarea v-model="comment" label="Comment"></v-textarea>
        <v-btn
          size="large"
          variant="elevated"
          color="deep-purple-darken-4"
          @click="addComment()"
          :disabled="!selectedStudent || !comment"
          >Add Comment</v-btn
        >
        <v-dialog v-model="dialog" persistent width="1024">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="large"
              variant="elevated"
              class="ml-5"
              :color="isDark ? 'white' : 'black'"
              >My Comments</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">My Comments</span>
            </v-card-title>
            <v-card-text>
              <v-expansion-panels class="mt-2">
                <v-expansion-panel
                  v-for="comment in comments"
                  :key="comment"
                  :title="comment.username"
                  :text="comment.commentContent"
                  color="blue-grey-darken-4"
                ></v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="warning"
                variant="outlined"
                class="w-32"
                @click="dialog = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
    </div>

    <v-snackbar
      :timeout="2000"
      color="indigo"
      variant="elevated"
      v-model="snackbar"
    >
      {{ responseMessage }}

      <template v-slot:actions>
        <v-btn color="white" variant="transparent" @click="snackbar = false">
          X
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";

// Constants

const isDark = useDark();
const students = ref([]);
const selectedStudent = ref(null);
const comment = ref("");
const comments = ref([]);
const snackbar = ref(false);
const responseMessage = ref("");
const dialog = ref(false);

// Functions

onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser.user_id;
  try {
    // Fetching data from the first endpoint
    const response1 = await axios.get(
      `http://localhost:8000/lecturer/mystudents/${userId}`
    );

    // Mapping username and user_id from the first response into students array
    const studentsFromFirstEndpoint = response1.data.map((student) => ({
      name: student.username,
      id: student.user_id,
      isCoSupervised: false,
    }));

    // Fetching data from the second endpoint
    const response2 = await axios.get(
      `http://localhost:8000/lecturer/myCoSupervisedStudents/${userId}`
    );

    // Mapping username and user_id from the second response into students array
    const studentsFromSecondEndpoint = response2.data.map((student) => ({
      name: student.username,
      id: student.user_id,
      isCoSupervised: true,
    }));

    // Fetching data from the third endpoint
    const response3 = await axios.get(
      `http://localhost:8000/lecturer/myExaminees/${userId}`
    );

    // Mapping username and user_id from the third response into students array
    const studentsFromThirdEndpoint = response3.data.map((student) => ({
      name: student.username,
      id: student.user_id,
      isCoSupervised: false,
      isExaminee: true,
    }));

    // Concatenating the arrays in the desired order
    const studentsConcat = studentsFromFirstEndpoint.concat(
      studentsFromSecondEndpoint,
      studentsFromThirdEndpoint
    );

    // Set the merged array to students.value
    students.value = studentsConcat;
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
  try {
    const responseComments = await axios.get(
      `http://localhost:8000/lecturer/mycomments/${userId}`
    );

    const fetchedComments = responseComments.data;

    // Create a map of user_id to username
    const idToUsernameMap = {};
    students.value.forEach((student) => {
      idToUsernameMap[student.id] = student.name;
    });

    // Replace studentId with corresponding username in fetched comments
    fetchedComments.forEach((comment) => {
      const username = idToUsernameMap[comment.studentId];
      comment.username = username; // Add username to comment object
    });

    comments.value = fetchedComments;
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

const itemProps = (item) => ({
  title: item.name,
  subtitle: item.isCoSupervised
    ? "Co-supervised"
    : "" || item.isExaminee
    ? "Examinee"
    : "",
});

const addComment = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.post(
      `http://localhost:8000/lecturer/newcomment`,
      { commentContent: comment.value, studentId: selectedStudent.value },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status === 200) {
      responseMessage.value = "Comment added successfully";
      snackbar.value = true;
      selectedStudent.value = null;
      comment.value = "";
    }
  } catch (error) {
    console.error("Error updating project info:", error);
  }
};
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
