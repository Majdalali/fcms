<template>
  <div class="mt-10">
    <div>
      <h1 class="title text-lg font-medium">
        Add Comments & Feedback to students
      </h1>
    </div>
    <div class="lg:w-4/5 mt-5">
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
              v-if="comments.length == 0"
              v-bind="props"
              size="large"
              variant="elevated"
              class="ml-5"
              :color="isDark ? 'white' : 'black'"
              @click="getComments()"
              >My Comments
            </v-btn>
            <v-btn
              v-else
              v-bind="props"
              size="large"
              variant="elevated"
              class="ml-5"
              :color="isDark ? 'white' : 'black'"
              >My Comments
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">My Comments</span>
            </v-card-title>

            <v-skeleton-loader
              class=""
              v-if="isLoadingComments"
              type="heading, heading, heading"
            ></v-skeleton-loader>
            <v-card-text class="pt-0" v-if="comments.length !== 0">
              <v-expansion-panels class="mt-2">
                <v-expansion-panel
                  v-for="comment in comments"
                  :key="comment"
                  :title="comment.username"
                  color="blue-grey-darken-4 mt-2"
                >
                  <v-expansion-panel-text>
                    <v-card color="transparent" elevation="0">
                      <v-card-text>
                        <p class="titleDes">
                          {{ comment.commentContent }}
                        </p></v-card-text
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="error"
                          variant="outlined"
                          text="Delete"
                          @click="deleteComment(comment.commentId)"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
            <v-card-text v-if="!isLoadingComments && comments.length == 0">
              <v-alert type="info" variant="outlined" class="my-4"
                >You haven't added any comments yet</v-alert
              >
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
const isLoadingComments = ref(false);
const snackbar = ref(false);
const responseMessage = ref("");
const dialog = ref(false);
const apiUrl = import.meta.env.VITE_API_URL;
const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const userId = storedUser.user_id;

// Functions

onMounted(async () => {
  try {
    // Fetching data from the first endpoint
    const response1 = await axios.get(
      `${apiUrl}/lecturer/mystudents/${userId}`
    );

    // Mapping username and user_id from the first response into students array
    const studentsFromFirstEndpoint = response1.data.map((student) => ({
      name: student.username,
      id: student.user_id,
      isCoSupervised: false,
    }));

    // Fetching data from the second endpoint
    const response2 = await axios.get(
      `${apiUrl}/lecturer/myCoSupervisedStudents/${userId}`
    );

    // Mapping username and user_id from the second response into students array
    const studentsFromSecondEndpoint = response2.data.map((student) => ({
      name: student.username,
      id: student.user_id,
      isCoSupervised: true,
    }));

    // Fetching data from the third endpoint
    const response3 = await axios.get(
      `${apiUrl}/lecturer/myExaminees/${userId}`
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
      `${apiUrl}/lecturer/newcomment`,
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

const deleteComment = async (commentId) => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.delete(
      `${apiUrl}/lecturer/deletecomment/${commentId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status === 200) {
      responseMessage.value = "Comment deleted successfully";
      snackbar.value = true;
      // Remove the deleted comment from the comments array
      comments.value = comments.value.filter(
        (comment) => comment.commentId !== commentId
      );
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error("Error deleting comment:", error.response.data.message);
    } else {
      console.error("Error deleting comment:", error);
    }
  }
};

const getComments = async () => {
  isLoadingComments.value = true;
  try {
    const responseComments = await axios.get(
      `${apiUrl}/lecturer/mycomments/${userId}`
    );
    if (responseComments.status === 404) {
      console.log(responseComments.data.message);
    } else if (responseComments.status === 200) {
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
    }
  } catch (error) {
    if (error.response && error.response.status === 500) {
      console.error("Error fetching comments:", error.response.data.error);
    } else {
      console.log("Error fetching comments:", error);
    }
  } finally {
    isLoadingComments.value = false; // Set loading state to false when done
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
