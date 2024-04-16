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
        <p class="titleDes mt-4">Project Type</p>
        <v-radio-group
          inline
          class="py-2"
          :rules="radioGroupRules"
          v-model="radioGroup"
        >
          <v-radio label="Project One" value="pOne"></v-radio>
          <v-radio label="Project Two" value="pTwo"></v-radio>
        </v-radio-group>

        <p class="titleDes mt-2 mb-2">Supporting files</p>
        <v-file-input
          v-model="formFiles"
          variant="outlined"
          clearable
          label="Upload a File"
          show-size
          counter
        ></v-file-input>
        <v-divider></v-divider>
        <div class="splitShare" v-if="selectedCriteriaType == 'split'">
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
        </div>
        <div class="questionnaire" v-else>
          <div class="mt-5 mb-2 flex flex-row text-center justify-center">
            <v-card
              class="w-[90%] ml-2 rounded-lg flex items-center p-4"
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
          <v-col cols="12" lg="4" md="4">
            <small class="titleDes">Type </small>
            <v-text-field
              class="mt-4"
              label="Type of Evaluator"
              v-model="typeOfEvaluator"
              :rules="typeOfEvaluatorRules"
              readonly
              disabled
            ></v-text-field>
            <span v-if="selectedEvaluatorMarksShare > 0"
              >Share: {{ selectedEvaluatorMarksShare }}%</span
            >
          </v-col>
        </v-row>
        <v-btn
          size="large"
          variant="elevated"
          class="mt-2"
          color="deep-purple-darken-4"
          @click="submitEvaluation()"
          :disabled="!valid"
          >Submit Evaluation
          <span class="pl-2" v-if="requestLoading">
            <v-progress-circular
              :size="22"
              indeterminate
            ></v-progress-circular> </span
        ></v-btn>
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
import { ref, onMounted, watch } from "vue";
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
const requestLoading = ref(false);

const valid = ref(false);
const evaluationForm = ref(null);
const evaluationCriterias = ref([{ name: "", grade: "", from: "" }]); // criteria and it's grade
const evaluationCriteriasQuestion = ref([{ name: "", answer: "" }]);
const remarksForCord = ref("");
const typeOfEvaluator = ref("");
const criteriasData = ref([]);
const criteriaErrorMessages = ref("");
const selectedStudentProgram = ref("");
const selectedCriteriaName = ref("");
const selectedCriteriaType = ref("");
const selectedCriteriaTotalMark = ref(0);
const selectedEvaluatorMarksShare = ref(0);
const radioGroup = ref("");
const radioGroupRules = [(v) => !!v || "Please select a project type."];
const formFiles = ref([]);
const autoGenName = ref([]);
const decision = ref("");

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
    requestLoading.value = true;
    const token = localStorage.getItem("access_token");

    // upload files and get the autoGeneratedName of the files to be pushed to the supportingDocs array
    if (formFiles.value.length > 0) {
      await uploadFiles();
    }

    // Prepare the payload for the evaluation submission
    const evaluationPayload = {
      studentId: selectedStudent.value, // Assuming selectedStudent holds the student ID
      evaluationObjects: {}, // Object to hold evaluation criteria and grades
      remarksForCord: remarksForCord.value,
      typeOfEvaluator: typeOfEvaluator.value,
      criteriaProgram: selectedStudentProgram.value,
      cmd: selectedEvaluatorMarksShare.value,
      projectType: radioGroup.value,
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
      requestLoading.value = false;
      // Handle success
      snackbar.value = true;
      responseMessage.value = "Evaluation submitted successfully!";
      autoGenName.value = [];
      evaluationForm.value.reset();
      evaluationCriterias.value = [{ name: "", grade: "", outOf: "" }];
      formFiles.value = [];
    } else {
      criteriaErrorMessages.value = "Error submitting evaluation.";
      requestLoading.value = false;
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

    // Fetching data from the third endpoint
    const response2 = await axios.get(
      `${apiUrl}/lecturer/myExaminees/${userId}`
    );

    // Mapping username and user_id from the third response into students array
    const studentsFromSecondEndpoint = response2.data.map((student) => ({
      name: student.username,
      id: student.user_id,
      program: student.program,
      isCoSupervised: false,
      isExaminee: true,
    }));

    // Concatenating the arrays in the desired order
    const studentsConcat = studentsFromFirstEndpoint.concat(
      studentsFromSecondEndpoint
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

    // Set the marks share for the selected evaluator
    // Get the criteria marks distribution
    const marksDistribution = criteriaForProgram.criteriaMarksDistribution;

    // Determine the selected evaluator type
    let evaluatorType = "";
    if (selectedStudent.value) {
      const student = students.value.find(
        (student) => student.id === selectedStudent.value
      );
      if (student) {
        if (student.isCoSupervised) {
          evaluatorType = "Co-supervisor";
        } else if (student.isExaminee) {
          evaluatorType = "Examiner";
        } else {
          evaluatorType = "Supervisor";
        }
      }
    }
    // Set the selectedEvaluatorMarksShare based on the evaluator type
    selectedEvaluatorMarksShare.value = marksDistribution[evaluatorType];
  } else {
    // Handle the case where no matching criteria is found
    evaluationCriterias.value = [{ name: "", grade: "", from: "" }];
    criteriaErrorMessages.value = `No criteria found for program: ${studentProgram}. Please contact the coordinator for assistance.`;
  }
  evaluationForm.value.reset();
  formFiles.value = [];
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

// type of evaluator selection dynamically based on student selected
watch(typeOfEvaluator, () => {
  let evaluatorType = "";

  if (selectedStudent.value) {
    const student = students.value.find(
      (student) => student.id === selectedStudent.value
    );

    if (student) {
      if (student.isCoSupervised) {
        evaluatorType = "Co-supervisor";
      } else if (student.isExaminee) {
        evaluatorType = "Examiner";
      } else {
        evaluatorType = "Supervisor";
      }
    }
  }

  typeOfEvaluator.value = evaluatorType;

  return evaluatorType;
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
