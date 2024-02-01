<template>
  <div>
    <div class="w-1/2">
      <h1 class="title text-lg font-medium">Evaluation Form</h1>
    </div>
    <div v-if="!isInfoLoading" class="my-5">
      <v-alert
        :title="criteriaErrorMessages"
        type="error"
        class="py-2 mb-5"
        v-show="criteriaErrorMessages !== ''"
      ></v-alert>
      <div class="my-5 w-2/5">
        <!--! student name and program from props -->
        <v-chip size="large" color="primary" label
          ><v-icon start icon="mdi-account-circle-outline"></v-icon>
          {{ props.studentInfo.name }}</v-chip
        >
        <v-chip size="large" color="cyan" label class="ml-2">
          <v-icon start icon="mdi-label"></v-icon>
          {{ props.studentInfo.MatricNumber }}</v-chip
        >
      </div>
      <v-form ref="evaluationForm" v-model="valid">
        <div class="mt-5 mb-2 flex flex-row text-center justify-between">
          <v-card
            class="w-[60%] ml-2 rounded-lg flex items-center p-4"
            title="Criteria"
            color="grey-darken-3"
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
            color="grey-darken-3"
            class="w-[30%] rounded-lg flex flex-row items-center"
            title="Total Mark"
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
    <div v-else class="flex w-full h-full justify-center items-center">
      <v-progress-circular
        :size="58"
        :width="5"
        indeterminate
      ></v-progress-circular>
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
const props = defineProps({
  studentInfo: Object,
  criteriasData: Array,
});
const snackbar = ref(false);
const responseMessage = ref("");
const dark = useDark();

const valid = ref(false);
const evaluationForm = ref(null);
const evaluationCriterias = ref([{ name: "", grade: "", from: "" }]); // criteria and it's grade
const remarksForCord = ref("");
const typeOfEvaluator = ref("");
// const criteriasData = ref([]);
const criteriaErrorMessages = ref("");
const selectedStudentProgram = ref("");
const selectedCriteriaName = ref("");
const selectedCriteriaTotalMark = ref(0);
const isInfoLoading = ref(false);

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
};

// Function to handle the submission of evaluation
const submitEvaluation = async () => {
  try {
    const token = localStorage.getItem("access_token");

    // Prepare the payload for the evaluation submission
    const evaluationPayload = {
      studentId: props.studentInfo.id, // Assuming selectedStudent holds the student ID
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
  isInfoLoading.value = true;
  // try {
  //   const response = await axios.get(`${apiUrl}/api/criterias`);
  //   if (response.status === 200) {
  //     criteriasData.value = response.data;
  //   } else {
  //     console.error("Error fetching evaluation criteria:", response.data);
  //     criteriaErrorMessages.value = "Failed to fetch evaluation criteria.";
  //   }
  // } catch (error) {
  //   console.error("Error fetching evaluation criteria:", error);
  //   criteriaErrorMessages.value = "Failed to fetch evaluation criteria.";
  // } finally {
  //   isInfoLoading.value = false;
  // }

  try {
    const studentProgram = props.studentInfo.program;
    if (!studentProgram) {
      return;
    }

    const criteriaForProgram = props.criteriasData.find(
      (criteria) => criteria.criteriaProgram === studentProgram
    );

    if (criteriaForProgram) {
      evaluationCriterias.value = Object.keys(
        criteriaForProgram.criteriasObjects
      ).map((key) => ({
        name: key,
        grade: "",
        outOf: criteriaForProgram.criteriasObjects[key],
      }));
      selectedStudentProgram.value = studentProgram;
      selectedCriteriaName.value = criteriaForProgram?.criteriaName || "";
      selectedCriteriaTotalMark.value =
        criteriaForProgram?.criteriaTotalMark || 0;
      criteriaErrorMessages.value = "";
    } else {
      criteriaErrorMessages.value = `No criteria found for program: ${studentProgram}. Please contact the coordinator for assistance.`;
    }
  } catch (error) {
    console.error("Error processing criteria:", error);
    criteriaErrorMessages.value = "Error processing evaluation criteria.";
  } finally {
    isInfoLoading.value = false;
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
.formText {
  font-family: "Work Sans", sans-serif;
}
</style>
