<template>
  <div>
    <div class="lowerDiv pt-10">
      <h1 class="title text-lg font-medium">
        Marks Analysis for Program {{ props.programType }}
        <v-icon size="small">mdi-chevron-right</v-icon> Project
        {{ props.projectType === "pOne" ? "1" : "2" }}
      </h1>
      <p class="titleDes mb-5 text-sm font-light">
        <v-btn
          color="indigo"
          variant="text"
          size="small"
          @click="dialog = true"
          append-icon="mdi-information"
          class="pl-0"
        >
          Understanding the calculations
        </v-btn>
      </p>
      <v-dialog v-model="dialog" width="800px">
        <v-card>
          <v-card-title class="title"
            >Understanding the calculations</v-card-title
          >
          <v-card-text>
            <v-list lines="two">
              <v-list-item>
                <v-list-item-title class="title">Final Grade</v-list-item-title>
                <p class="titleSec text-sm opacity-70">
                  The final grade is a combined score. The examiner marks are
                  averaged and then combined with the supervisor's marks.
                </p>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="title"
                  >Average [Ex1, Ex2]</v-list-item-title
                >
                <p class="titleSec text-sm opacity-70">
                  The average represents the combined marks from all examiners
                  divided by the number of examiners.
                </p>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="title">Total</v-list-item-title>
                <p class="titleSec text-sm opacity-70">
                  The total is calculated by summing the total marks from all
                  evaluations (which may include both examiner and supervisor
                  evaluations) and dividing by the total number of evaluations.
                </p>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark @click="dialog = false"> Close </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div v-if="!emptyEvals">
        <v-card :rounded="0" :elevation="0">
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            single-line
            :rounded="0"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-card>
        <v-data-table
          class="border"
          :headers="headers"
          :search="search"
          :items="groupedEvals"
        >
        </v-data-table>
      </div>
      <div class="" v-else>
        <v-alert
          type="info"
          variant="outlined"
          border="left"
          elevation="0"
          icon="mdi-information"
        >
          No evaluation data found for the selected program and project type.
          Please wait for examiners/supervisors to submit their evaluations.
        </v-alert>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Constants
const props = defineProps({
  projectType: String,
  programType: String,
  evaluationData: Array,
});

const dialog = ref(false);
const search = ref("");
const headers = ref([
  { key: "studentName", sortable: true, title: "Student" },
  {
    key: "average",
    sortable: true,
    title: "Average [Ex1, Ex2]",
    align: "center",
  },
  {
    key: "svGrade",
    sortable: true,
    title: "Supervisor Grade",
    align: "center",
  },
  { key: "total", sortable: true, title: "Total" },
  { key: "finalGrade", sortable: true, title: "Grade" },
]);
const groupedEvals = ref([]);
const emptyEvals = ref(false);

onMounted(async () => {
  try {
    groupEvaluations();
  } catch (error) {
    console.error("Error fetching evaluation data: ", error);
  }
});

const groupEvaluations = () => {
  const groupedEvaluations = {};
  const filteredEvals = props.evaluationData.filter(
    (groupedEval) =>
      groupedEval.criteriaProgram === props.programType &&
      groupedEval.projectType === props.projectType
  );

  if (filteredEvals.length === 0) {
    emptyEvals.value = true;
    return;
  }

  filteredEvals.forEach((evaluation) => {
    const studentId = evaluation.studentId;

    if (!groupedEvaluations[studentId]) {
      groupedEvaluations[studentId] = {
        studentId: studentId,
        studentName: evaluation.studentName,
        matricNumber: evaluation.matricNumber,
        criteriaProgram: evaluation.criteriaProgram,
        evaluations: [],
        supervisorEval: {},
        examinersEval: [],
      };
    }

    // Check if the evaluation is for the supervisor and if supervisorEval is empty
    if (evaluation.typeOfEvaluator === "Supervisor") {
      // Use evaluation objects from the supervisor for both supervisor and examiner evaluations
      evaluation.evaluationObjects.evaluatorRef = evaluation.evaluatorId;
      groupedEvaluations[studentId].supervisorEval =
        evaluation.evaluationObjects;
    } else if (evaluation.typeOfEvaluator === "Examiner") {
      let examinerIndex = 1; // Initialize counter

      // Find current examinerCount for this student
      const existingExaminerCount =
        groupedEvaluations[studentId].examinersEval.length;
      examinerIndex += existingExaminerCount;

      // Create examinerEval object using the index
      groupedEvaluations[studentId].examinersEval.push({
        [`Examiner ${examinerIndex}`]: {
          ...evaluation.evaluationObjects,
          examinerRef: evaluation.evaluatorId,
        },
      });
    }

    // Filter out the unwanted attributes from the evaluation object and add them to the filteredEvals object
    const filteredEvals = {};
    Object.keys(evaluation).forEach((key) => {
      if (
        key !== "studentId" &&
        key !== "studentName" &&
        key !== "evaluationId" &&
        key !== "createdAt" &&
        key !== "criteriaProgram" &&
        key !== "remarksForCord" &&
        key !== "evaluationObjects" &&
        key !== "lecturerName"
      ) {
        filteredEvals[key] = evaluation[key];
      }
    });
    groupedEvaluations[studentId].evaluations.push(filteredEvals);
  });

  groupedEvals.value = Object.values(groupedEvaluations);

  // Check if any student has a non-empty supervisorEval
  const hasSupervisorEval = groupedEvals.value.some(
    (evaluation) => Object.keys(evaluation.supervisorEval).length > 0
  );

  // Remove the supervisor header from the headers array
  const supervisorHeaderIndex = headers.value.findIndex(
    (h) => h.title === "Supervisor"
  );
  if (supervisorHeaderIndex !== -1) {
    headers.value.splice(supervisorHeaderIndex, 1);
  }

  // Populate supervisor header and its children if supervisorEval is not empty
  if (hasSupervisorEval) {
    const supervisorHeader = {
      title: "Supervisor",
      align: "center",
      children: [],
    };

    const studentWithSupervisorEval = groupedEvals.value.find(
      (evaluation) => Object.keys(evaluation.supervisorEval).length > 0
    );

    const supervisorEvalAttributes = Object.keys(
      studentWithSupervisorEval.supervisorEval
    ).filter((key) => key !== "evaluatorRef");

    supervisorHeader.children.push(
      ...supervisorEvalAttributes.map((attr) => ({
        key: `supervisorEval.${attr}.mark`,
        sortable: false,
        title: attr,
        align: "center",
      }))
    );

    // Insert supervisor header after the "Student" header
    const studentHeaderIndex = headers.value.findIndex(
      (h) => h.title === "Student"
    );
    if (studentHeaderIndex !== -1) {
      headers.value.splice(studentHeaderIndex + 1, 0, supervisorHeader);
    }
  }

  // Set up examiner headers
  const maxExaminers = Math.max(
    ...groupedEvals.value.map((evaluation) => evaluation.examinersEval.length)
  );
  const examinerHeaders = [];

  // Generate headers for examiners based on the maximum number of examiners
  for (let i = 1; i <= maxExaminers; i++) {
    examinerHeaders.push({
      title: `Examiner ${i}`,
      align: "center",
      children: [],
    });
  }

  // Insert examiner headers after the "Student" header
  const studentHeaderIndex = headers.value.findIndex(
    (h) => h.title === "Supervisor"
  );
  if (studentHeaderIndex !== -1) {
    headers.value.splice(studentHeaderIndex + 1, 0, ...examinerHeaders);
  }

  // Populate the children of examiner headers
  groupedEvals.value.forEach((evaluation) => {
    evaluation.examinersEval.forEach((examinerEval, index) => {
      const examinerHeaderIndex = studentHeaderIndex + 1 + index;
      if (headers.value[examinerHeaderIndex]) {
        const examinerEvalAttributes = Object.keys(
          examinerEval[`Examiner ${index + 1}`]
        ).filter((key) => key !== "examinerRef");
        headers.value[examinerHeaderIndex].children =
          examinerEvalAttributes.map((attr) => ({
            key: `examinersEval.${index}.Examiner ${index + 1}.${attr}.mark`,
            sortable: false,
            title: attr,
            align: "center",
          }));
      }
    });
  });

  // Calculate the final grade, average, and total marks for each student
  groupedEvals.value.forEach((evaluation) => {
    let supervisorMarks = 0;
    let totalExaminerMarks = 0;
    let totalMarks = 0;
    let totalEvaluations = 0;
    let totalExaminers = 0;

    evaluation.evaluations.forEach((singleEvaluation) => {
      if (singleEvaluation.typeOfEvaluator === "Supervisor") {
        supervisorMarks += parseFloat(singleEvaluation.grade);
      } else if (singleEvaluation.typeOfEvaluator === "Examiner") {
        totalExaminerMarks += parseFloat(singleEvaluation.grade);
        totalExaminers++;
      }

      totalMarks += parseFloat(singleEvaluation.finalMark.totalMarks);
      totalEvaluations++;
    });

    evaluation.finalGrade = (
      totalExaminerMarks / totalExaminers +
      supervisorMarks
    ).toFixed(2);
    evaluation.average = (totalExaminerMarks / totalExaminers).toFixed(2);
    evaluation.total = (totalMarks / totalEvaluations).toFixed(2);
  });

  // get supervisor grade for each student and add it to the groupedEvals object
  groupedEvals.value.forEach((e) => {
    e.evaluations.forEach((evaluation) => {
      if (evaluation.typeOfEvaluator === "Supervisor") {
        e.svGrade = evaluation.grade;
      }
    });
  });
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1488px) {
  .nav {
    max-width: 1%;
  }
  .main {
    min-width: 100% !important;
  }
}
@media screen and (max-width: 639px) {
  .main {
    margin-top: 20px !important;
  }
}

.title,
.titleDes {
  font-family: "DM Sans", sans-serif;
}
.titleSec {
  font-family: "Work Sans", sans-serif;
  line-height: 1.25rem;
}
.tempDiv {
  background-color: #fdfefb !important;
}
.tempDiv-dark {
  background-color: #0d0d0d !important;
}
.vCard:nth-child(1) {
  margin-top: 0px !important;
}
</style>
