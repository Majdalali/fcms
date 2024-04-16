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
      <div class="my-5">
        <!--! student name and program from props -->
        <v-chip size="large" color="primary" label
          ><v-icon start icon="mdi-account-circle-outline"></v-icon>
          {{ props.studentInfo.name }}</v-chip
        >
        <v-chip size="large" color="cyan" label class="ml-2">
          <v-icon start icon="mdi-label"></v-icon>
          {{ props.studentInfo.MatricNumber }}</v-chip
        ><v-chip size="large" color="pink" label class="ml-2">
          <v-icon start icon="mdi-format-title"></v-icon>
          {{ props.studentInfo.type }}</v-chip
        >
      </div>
      <v-form ref="evaluationForm" v-model="valid">
        <div class="splitShare" v-if="selectedCriteriaType == 'split'">
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
        </div>
        <div class="questionnaire" v-else>
          <div class="mt-5 mb-2 flex flex-row text-center justify-center">
            <v-card
              class="w-[90%] ml-2 rounded-lg flex items-center p-4"
              title="Criteria"
              color="grey-darken-3"
              v-if="props.studentInfo.id && criteriaErrorMessages === ''"
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
          </div>
          <div v-if="selectedCriteriaType == 'questionnaire'">
            <p class="titleDes mt-2 mb-2">Evaluation Decision</p>
            <v-radio-group :rules="radioGroupRules" v-model="decision">
              <v-radio label="A - No correction " value="a"></v-radio>
              <v-radio label="B1 - One month correction" value="b1"></v-radio>
              <v-radio
                label="B2 - Three months correction"
                value="b2"
              ></v-radio>
              <v-radio label="C1 - Six months correction" value="c1"></v-radio>
              <v-radio
                label="C2 - Six months correction and Re-Presentation"
                value="c2"
              ></v-radio>
            </v-radio-group>
          </div>
          <div
            class="pt-2"
            v-for="(evaluationCriteria, index) in evaluationCriteriasQuestion"
            :key="index"
          >
            <small class="titleDes">Question {{ index + 1 }}</small>
            <v-row class="mt-1">
              <v-col cols="12">
                <v-text-field
                  v-model="evaluationCriteria.name"
                  :class="evaluationCriteria.name == '' ? 'block' : '!hidden'"
                  readonly
                  :disabled="evaluationCriteria.name == ''"
                  label="Evaluation Criteria"
                ></v-text-field>
                <h1
                  class="title"
                  :class="evaluationCriteria.name == '' ? 'hidden' : 'block'"
                >
                  <v-icon size="small" icon="mdi-label"></v-icon>
                  {{ evaluationCriteria.name }}
                </h1>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :rules="[(v) => !!v || 'Field is required']"
                  v-model="evaluationCriteria.answer"
                  label="Answer"
                  :disabled="evaluationCriteria.name == ''"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
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
          <v-col cols="12">
            <p class="titleDes mt-2 mb-2">Supporting files</p>
            <v-file-input
              v-model="formFiles"
              variant="outlined"
              clearable
              label="Upload a File"
              show-size
              counter
            ></v-file-input>
          </v-col>
          <v-col cols="12" lg="4" md="4">
            <small class="titleDes">Type</small>
            <v-text-field
              label="Type of evaluator"
              class="mt-4"
              v-model="typeOfEvaluator"
              :rules="typeOfEvaluatorRules"
              readonly
              disabled
            ></v-text-field>
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
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";

// Constants
const props = defineProps({
  studentInfo: Object,
  criteriasData: Array,
  studentType: String,
  projectType: String,
});
const snackbar = ref(false);
const responseMessage = ref("");
const dark = useDark();

const valid = ref(false);
const evaluationForm = ref(null);
const evaluationCriterias = ref([{ name: "", grade: "", from: "" }]); // criteria and it's grade
const evaluationCriteriasQuestion = ref([{ name: "", answer: "" }]);
const remarksForCord = ref("");
const typeOfEvaluator = ref(props.studentType);

// const criteriasData = ref([]);
const criteriaErrorMessages = ref("");
const selectedStudentProgram = ref("");
const selectedCriteriaType = ref("");
const selectedCriteriaName = ref("");
const selectedCriteriaTotalMark = ref(0);
const isInfoLoading = ref(false);
const selectedEvaluatorMarksShare = ref(0);
const autoGenName = ref([]);
const formFiles = ref([]);
const decision = ref("");

const radioGroupRules = [(v) => !!v || "Please select a project type."];
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

const uploadFiles = async () => {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();

  for (let i = 0; i < formFiles.value.length; i++) {
    formData.append("files", formFiles.value[i]);
  }
  formData.append("submissionType", "evalSupportingDocs");
  try {
    const response = await axios.post(`${apiUrl}/upload`, formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      autoGenName.value = response.data.fileSubmissionData.map(
        (file) => file.autogeneratedName
      );
      formFiles.value = [];
    }
  } catch (error) {
    criteriaErrorMessages.value = error.response.data.message;

    return;
  }
};

// Function to handle the submission of evaluation
const submitEvaluation = async () => {
  try {
    const token = localStorage.getItem("access_token");
    let isValid = formFiles.value.length > 0 ? true : false;

    // upload files and get the autoGeneratedName of the files to be pushed to the supportingDocs array
    if (isValid) {
      await uploadFiles();
    }
    // Prepare the payload for the evaluation submission
    const evaluationPayload = {
      studentId: props.studentInfo.id,
      evaluationObjects: {}, // Object to hold evaluation criteria and grades
      remarksForCord: remarksForCord.value,
      typeOfEvaluator: typeOfEvaluator.value,
      criteriaProgram: selectedStudentProgram.value,
      cmd: selectedEvaluatorMarksShare.value,
      projectType: props.projectType,
      supportingDocs: autoGenName.value,
      evalType: selectedCriteriaType.value,
      decision: decision.value,
    };

    // Fill in evaluationObjects with data from evaluationCriterias
    if (selectedCriteriaType.value === "split") {
      evaluationCriterias.value.forEach((criteria) => {
        evaluationPayload.evaluationObjects[criteria.name] = {
          mark: criteria.grade,
          outOf: criteria.outOf,
        };
      });
    } else {
      evaluationCriteriasQuestion.value.forEach((criteria) => {
        evaluationPayload.evaluationObjects[criteria.name] = criteria.answer;
      });
    }

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

  try {
    const studentProgram = props.studentInfo.program;
    if (!studentProgram) {
      return;
    }

    const criteriaForProgram = props.criteriasData.find(
      (criteria) => criteria.criteriaProgram === studentProgram
    );

    if (criteriaForProgram) {
      selectedCriteriaType.value = criteriaForProgram?.criteriaType || "";
      if (selectedCriteriaType.value === "split") {
        evaluationCriterias.value = Object.keys(
          criteriaForProgram.criteriasObjects
        ).map((key) => ({
          name: key,
          grade: "", // Set initial grade to empty
          outOf: criteriaForProgram.criteriasObjects[key], // Use the value from criteriasObjects as "from"
        }));
      } else {
        evaluationCriteriasQuestion.value = Object.keys(
          criteriaForProgram.criteriasObjects
        ).map((key) => ({
          name: key,
          answer: "", // Set initial grade to empty
        }));
      }
      selectedStudentProgram.value = studentProgram;
      selectedCriteriaName.value = criteriaForProgram?.criteriaName || "";
      selectedCriteriaTotalMark.value =
        criteriaForProgram?.criteriaTotalMark || 0;
      criteriaErrorMessages.value = "";
      const marksDistribution = criteriaForProgram.criteriaMarksDistribution;

      // Determine the selected evaluator type
      let evaluatorType = "";
      if (props.studentInfo) {
        if (props.studentInfo.type === "Co-supervisor") {
          evaluatorType = "Co-supervisor";
        } else if (props.studentInfo.type === "Examinee") {
          evaluatorType = "Examiner";
        } else {
          evaluatorType = "Supervisor";
        }
      }
      // Set the selectedEvaluatorMarksShare based on the evaluator type
      selectedEvaluatorMarksShare.value = marksDistribution[evaluatorType];
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
