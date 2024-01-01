<template>
  <div class="mt-10">
    <div class="w-1/2">
      <h1 class="title text-lg font-medium">Evaluation Form</h1>
    </div>
    <div class="w-4/5 my-5">
      <v-form ref="evaluationForm" v-model="valid">
        <v-autocomplete
          v-model="selectedStudent"
          clearable
          :rules="studentRules"
          :items="students"
          :item-props="itemProps"
          item-title="name"
          item-value="id"
          label="Select Student"
        >
        </v-autocomplete>
        <v-divider></v-divider>
        <div
          class="pt-2"
          v-for="(evaluationCriteria, index) in evaluationCriterias"
          :key="index"
        >
          <small class="titleDes">Criteria {{ index + 1 }}</small>
          <v-row class="mt-1">
            <v-col cols="12" md="7">
              <v-text-field
                v-model="evaluationCriteria.name"
                :rules="nameRules"
                label="Evaluation Criteria"
                hint="e.g. Project Managment Progress 1, Project Performance, etc."
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                :rules="gradeRules"
                v-model="evaluationCriteria.grade"
                label="Grade"
              ></v-text-field
            ></v-col>
            <v-col cols="12" md="1" class="mt-1">
              <v-btn
                size="large"
                color="success"
                v-if="index === 0"
                @click="addEntry(evaluationCriterias, { name: '', grade: '' })"
                ><v-icon icon="mdi-plus-circle"></v-icon
              ></v-btn>
              <v-btn
                size="large"
                v-else
                color="error"
                @click="removeEntry(evaluationCriterias, index)"
                ><v-icon icon="mdi-delete"></v-icon
              ></v-btn>
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Remarks for coordinator"
              v-model="remarksForCord"
              :rules="remarksForCordRules"
            ></v-text-field
          ></v-col>
          <v-col cols="4">
            <v-select
              label="Type of evaluator"
              v-model="typeOfEvaluator"
              :rules="typeOfEvaluatorRules"
              :items="['Supervisor', 'Co-Supervisor', 'Examiner']"
            ></v-select>
          </v-col>
        </v-row>
        <v-btn
          size="large"
          variant="elevated"
          color="deep-purple-darken-4"
          @click="submitEvaluation()"
          :disabled="!valid"
          >Submit Evaluation</v-btn
        >
      </v-form>
    </div>
    <h1>{{ selectedStudent }}</h1>
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
const students = ref([]);
const selectedStudent = ref(null);
const snackbar = ref(false);
const responseMessage = ref("");

const valid = ref(false);
const evaluationForm = ref(null);
const evaluationCriterias = ref([{ name: "", grade: "" }]); // criteria and it's grade
const remarksForCord = ref("");
const typeOfEvaluator = ref("");

const nameRules = [
  (value) =>
    (value && value.trim().length >= 2 && /^[a-zA-Z0-9\s]*$/.test(value)) ||
    "Criteria must be at least 2 characters, alphanumeric and space only.",
];

const gradeRules = [
  (value) =>
    (value.trim() !== "" && !isNaN(value.trim()) && value === value.trim()) ||
    "Grade must be a valid number without leading or trailing spaces.",
];

// Rules for other fields
const studentRules = [(value) => !!value || "Please select a student."];

const remarksForCordRules = [
  (value) => !!value || "Remarks for coordinator cannot be empty.",
];

const typeOfEvaluatorRules = [
  (value) => !!value || "Please select a type of evaluator.",
];
// Functions

// Function to add and remove an entry to the respective array
const addEntry = (list) => {
  list.push({ name: "", grade: "" });
};

const removeEntry = (list, index) => {
  list.splice(index, 1);
};

const formatName = (input) => {
  const words = input.split(" ");
  const formattedName = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return formattedName;
};
// Function to reset form fields
const resetForm = () => {
  evaluationForm.value.reset();
};

// Function to handle the submission of evaluation
const submitEvaluation = async () => {
  try {
    const token = localStorage.getItem("access_token");

    // Prepare the payload for the evaluation submission
    const evaluationPayload = {
      studentId: selectedStudent.value, // Assuming selectedStudent holds the student ID
      evaluationObjects: {}, // Object to hold evaluation criteria and grades
      remarksForCord: remarksForCord.value,
      typeOfEvaluator: typeOfEvaluator.value,
    };

    // Fill in evaluationObjects with data from evaluationCriterias
    evaluationCriterias.value.forEach((criteria) => {
      const formattedName = formatName(criteria.name);
      evaluationPayload.evaluationObjects[formattedName] = criteria.grade;
    });

    // Make the POST request to submit the evaluation
    const response = await axios.post(
      "http://localhost:8000/evaluate",
      evaluationPayload,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 201) {
      // Handle success
      snackbar.value = true;
      responseMessage.value = "Evaluation submitted successfully!";
      resetForm();
    } else {
      // Handle other status codes or errors
      console.error("Error submitting evaluation:", response.data);
      // Optionally, display an error message
    }
  } catch (error) {
    console.error("Internal error submitting evaluation:", error);
    // Handle internal errors, display an error message, or redirect if needed
  }
};

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
});

// Add a subtitle for students who are co-supervised or examinees
const itemProps = (item) => ({
  title: item.name,
  subtitle: item.isCoSupervised
    ? "Co-supervised"
    : "" || item.isExaminee
    ? "Examinee"
    : "",
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
.formText {
  font-family: "Work Sans", sans-serif;
}
</style>
