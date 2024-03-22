<template>
  <div class="mt-10">
    <div>
      <h1 class="title text-lg font-medium">
        Evaluation Form
        <v-progress-circular
          v-if="isLoading"
          :size="22"
          indeterminate
        ></v-progress-circular>
      </h1>
    </div>
    <div v-if="!isLoading" class="lg:w-4/5 my-5">
      <v-alert
        :title="criteriaErrorMessages"
        type="error"
        class="py-2 mb-5"
        v-show="criteriaErrorMessages !== ''"
      ></v-alert>
      <v-select
        v-model="selectedStudent"
        :rules="studentRules"
        :items="students"
        :item-props="itemProps"
        item-title="name"
        item-value="id"
        label="Select Student"
        @update:model-value="assignCriteria()"
      >
      </v-select>
      <v-form ref="evaluationForm" v-model="valid">
        <v-divider></v-divider>
        <div class="mt-5 mb-2 flex flex-row text-center justify-between">
          <v-card
            class="w-[60%] ml-2 rounded-lg flex items-center p-4"
            title="Criteria"
            v-if="selectedStudent && criteriaErrorMessages === ''"
          >
            <template v-slot:text>
              <span class="title"
                ><strong
                  >{{ selectedCriteriaName }} ({{
                    selectedStudentProgram
                  }})</strong
                ></span
              >
            </template>
          </v-card>
          <v-card
            class="w-[30%] rounded-lg flex flex-row items-center"
            title="Total Mark"
            v-if="selectedStudent && criteriaErrorMessages === ''"
            ><template v-slot:text
              ><span class="title"
                ><strong>{{ selectedCriteriaTotalMark }}</strong></span
              ></template
            >
          </v-card>
        </div>

        <div
          class="pt-2"
          v-for="(evaluationCriteria, index) in evaluationCriterias"
          :key="index"
        >
          <small class="titleDes">Criteria {{ index + 1 }}</small>
          <v-row class="mt-1">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="evaluationCriteria.name"
                readonly
                :disabled="evaluationCriteria.name == ''"
                label="Evaluation Criteria"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                :rules="getGradeRules(evaluationCriteria)"
                v-model="evaluationCriteria.grade"
                label="Grade"
                :disabled="evaluationCriteria.name == ''"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="evaluationCriteria.outOf"
                :readonly="!dark"
                :disabled="dark"
                label="Out of"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col cols="12">
            <small class="titleDes">Remarks</small>
            <v-text-field
              class="mt-4"
              label="Remarks for coordinator"
              v-model="remarksForCord"
              :rules="remarksForCordRules"
            ></v-text-field
          ></v-col>
          <v-col cols="12" lg="4" md="4">
            <small class="titleDes">Type</small>
            <v-select
              class="mt-4"
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
          class="mt-2"
          color="deep-purple-darken-4"
          @click="submitEvaluation()"
          :disabled="!valid"
          >Submit Evaluation</v-btn
        >
      </v-form>
    </div>
    <v-skeleton-loader
      v-if="isLoading"
      class="mw-auto border my-5 lg:w-4/5"
      type="heading, list-item"
    ></v-skeleton-loader>
    <v-skeleton-loader
      v-if="isLoading"
      class="mw-auto border lg:w-4/5"
      type="article, list-item"
    >
    </v-skeleton-loader>
    <LecturerEvaluations :criteriaData="criteriasData" />
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
import LecturerEvaluations from "./lecturerEvaluations.vue";

// Constants
const students = ref([]);
const selectedStudent = ref(null);
const snackbar = ref(false);
const responseMessage = ref("");
const dark = useDark();
const isLoading = ref(false);

const valid = ref(false);
const evaluationForm = ref(null);
const evaluationCriterias = ref([{ name: "", grade: "", from: "" }]); // criteria and it's grade
const remarksForCord = ref("");
const typeOfEvaluator = ref("");
const criteriasData = ref([]);
const criteriaErrorMessages = ref("");
const selectedStudentProgram = ref("");
const selectedCriteriaName = ref("");
const selectedCriteriaTotalMark = ref(0);

const getGradeRules = (evaluationCriteria) => [
  (value) => {
    const trimmedValue = value.trim();

    // Check if the value is empty
    if (trimmedValue === "") {
      return "Grade cannot be empty.";
    }

    // Check if the value is a valid number
    const isNumeric = !isNaN(trimmedValue) && trimmedValue === value;

    if (!isNumeric) {
      return "Grade must be a valid number without leading or trailing spaces.";
    }

    // Check if the entered grade is not higher than the specified "outOf" value
    const isValidGrade =
      parseFloat(trimmedValue) <= parseFloat(evaluationCriteria.outOf);

    return (
      isValidGrade ||
      `Grade must not be higher than the specified value (${evaluationCriteria.outOf}).`
    );
  },
];

// Rules for other fields
const studentRules = [(value) => !!value || "Please select a student."];

const remarksForCordRules = [
  (value) => !!value || "Remarks for coordinator cannot be empty.",
];

const typeOfEvaluatorRules = [
  (value) => !!value || "Please select a type of evaluator.",
];

const apiUrl = import.meta.env.VITE_API_URL;

// Functions

// Function to reset form fields
const resetForm = () => {
  evaluationForm.value.reset();
  evaluationCriterias.value = [{ name: "", grade: "", outOf: "" }];
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
      criteriaProgram: selectedStudentProgram.value,
    };

    // Fill in evaluationObjects with data from evaluationCriterias
    evaluationCriterias.value.forEach((criteria) => {
      evaluationPayload.evaluationObjects[criteria.name] = {
        mark: criteria.grade,
        outOf: criteria.outOf,
      };
    });

    // Make the POST request to submit the evaluation
    const response = await axios.post(`${apiUrl}/evaluate`, evaluationPayload, {
      headers: {
        Authorization: token,
      },
    });

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
  }
};

onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser.user_id;
  isLoading.value = true;
  try {
    // Fetching data from the first endpoint
    const response1 = await axios.get(
      `${apiUrl}/lecturer/mystudents/${userId}`
    );

    // Mapping username and user_id from the first response into students array
    const studentsFromFirstEndpoint = response1.data.map((student) => ({
      name: student.username,
      id: student.user_id,
      program: student.program,
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
      program: student.program,
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
      program: student.program,
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

  // Fetch criteria data
  try {
    const response = await axios.get(`${apiUrl}/api/criterias`);
    if (response.status === 200) {
      // Handle success
      criteriasData.value = response.data;
    } else {
      // Handle other status codes or errors
      console.error("Error fetching evaluation criteria:", response.data);
      // Optionally, display an error message
    }
  } catch (error) {
    console.error("Error fetching evaluation criteria:", error);
    // Handle error, display an error message, or redirect if needed
  }
  isLoading.value = false;
});

const assignCriteria = () => {
  const studentProgram = students.value.find(
    (student) => student.id === selectedStudent.value
  )?.program;

  if (!studentProgram) {
    return;
  }

  // Find the criteria with matching program
  const criteriaForProgram = criteriasData.value.find(
    (criteria) => criteria.criteriaProgram === studentProgram
  );

  // Map criteriasObjects to evaluationCriterias
  if (criteriaForProgram) {
    evaluationCriterias.value = Object.keys(
      criteriaForProgram.criteriasObjects
    ).map((key) => ({
      name: key,
      grade: "", // Set initial grade to empty
      outOf: criteriaForProgram.criteriasObjects[key], // Use the value from criteriasObjects as "from"
    }));
    selectedStudentProgram.value = studentProgram;
    selectedCriteriaName.value = criteriaForProgram?.criteriaName || "";
    selectedCriteriaTotalMark.value =
      criteriaForProgram?.criteriaTotalMark || 0;
    criteriaErrorMessages.value = "";
  } else {
    // Handle the case where no matching criteria is found
    evaluationCriterias.value = [{ name: "", grade: "", from: "" }];
    criteriaErrorMessages.value = `No criteria found for program: ${studentProgram}. Please contact the coordinator for assistance.`;
  }
  evaluationForm.value.reset();
};

// Add a subtitle for students who are co-supervised or examinees
const itemProps = (item) => ({
  title: item.name,
  subtitle: item.isCoSupervised
    ? `Co-supervised - ${item.program}`
    : "" || item.isExaminee
    ? `Examinee - ${item.program}`
    : `Supervised - ${item.program}`,
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
