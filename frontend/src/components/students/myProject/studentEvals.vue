<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">Evaluations</h1>
      <p class="titleDes text-base font-light">
        Here are the evaluations for your project
      </p>
    </div>
    <div class="pt-10 h-full">
      <div v-if="!isLoading">
        <div v-if="!isEmpty">
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
            :items="studentEvals"
            :search="search"
          >
            <template v-slot:item.evaluationObjects="{ item }">
              <v-btn @click="openDialog(item)" size="small" color="indigo">
                Details
              </v-btn>
              <v-dialog v-model="item.dialog" width="800">
                <v-card>
                  <v-card-text class="mt-4">
                    <h1 class="title mb-2">
                      Evaluation Details: {{ item.projectType }}
                    </h1>
                    <v-table v-if="item.evalType == 'split'" class="border">
                      <thead>
                        <tr>
                          <th class="text-center text-base">Criteria</th>
                          <th class="text-center text-base">Grade</th>
                          <th class="text-center text-base">Out Of</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(
                            evaluationObject, key
                          ) in item.evaluationObjects"
                          :key="key"
                        >
                          <td class="text-center text-base">
                            {{ key }}
                          </td>
                          <td class="text-center text-base">
                            {{ evaluationObject.mark }}
                          </td>
                          <td class="text-center text-base">
                            {{ evaluationObject.outOf }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                    <v-table
                      v-if="item.evalType == 'questionnaire'"
                      class="border"
                    >
                      <thead>
                        <tr>
                          <th class="text-center text-base">Criteria</th>
                          <th class="text-center text-base">Answer</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(value, key) in item.evaluationObjects"
                          :key="key"
                        >
                          <td class="text-center text-base">
                            {{ key }}
                          </td>
                          <td class="text-center text-base">
                            {{ value }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                    <div class="mt-5">
                      <h1 class="title mb-2">Notes for Coordinator</h1>
                      <v-text-field readonly>
                        <h1>{{ item.remarksForCord }}</h1>
                      </v-text-field>
                    </div>
                    <h1 v-if="item.evalType == 'split'" class="title">
                      Final Mark:
                      <v-chip
                        class="ma-2"
                        label
                        color="teal"
                        variant="elevated"
                      >
                        {{ item.finalMark.totalMarks }}
                      </v-chip>
                      /
                      <v-chip
                        class="ma-2"
                        label
                        color="pink"
                        variant="elevated"
                      >
                        {{ item.finalMark.totalOutOf }}
                      </v-chip>
                    </h1>
                    <h1 class="title">
                      {{ item.evalType == "split" ? "Grade" : "Results" }}:
                      <v-tooltip
                        v-if="item.evalType == 'split'"
                        text="Grade is calculated based on the final mark and the Examiner/Supervisor's grading percentage."
                      >
                        <template v-slot:activator="{ props }">
                          <v-chip
                            v-bind="props"
                            class="ma-2"
                            label
                            color="indigo"
                            variant="elevated"
                          >
                            {{ item.grade }}
                          </v-chip></template
                        >
                      </v-tooltip>
                      <v-tooltip v-else :text="getText(item.grade)">
                        <template v-slot:activator="{ props }">
                          <v-chip
                            v-bind="props"
                            class="ma-2"
                            label
                            color="indigo"
                            variant="elevated"
                          >
                            {{ item.grade.toUpperCase() }}
                          </v-chip></template
                        >
                      </v-tooltip>
                    </h1>
                    <!-- Fetch files from supportingDocs array in a herf link a tag -->
                    <div class="mt-5" v-if="item.supportingDocs.length > 0">
                      <h1 class="title mb-2">Supporting Documents</h1>
                      <v-row>
                        <v-col v-for="file in item.supportingDocs">
                          <a
                            :href="`${apiUrl}/files/${file}`"
                            target="_blank"
                            class="text-indigo-500"
                            >{{ file }}</a
                          >
                        </v-col>
                      </v-row>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="warning"
                      variant="outlined"
                      class="w-32"
                      text="Cancel"
                      @click="closeDialog(item)"
                    ></v-btn>
                  </v-card-actions> </v-card></v-dialog
            ></template>
            <template v-slot:item.finalMark="{ item }">
              <div v-if="item.evalType == 'split'">
                {{ item.finalMark.totalMarks }}
                /
                {{ item.finalMark.totalOutOf }}
              </div>
              <div v-else>
                {{ item.grade.toUpperCase() }}
              </div>
            </template>
            <template v-slot:item.projectType="{ item }">
              {{ item.projectType == "pOne" ? "Project 1" : "Project 2" }}
            </template>
          </v-data-table>
        </div>
        <v-alert
          v-else
          type="secondary"
          variant="outlined"
          border="left"
          elevation="0"
          icon="mdi-information"
          text="You have no evaluations for this project type. Please check back later."
        >
        </v-alert>
      </div>
      <v-skeleton-loader v-if="isLoading" type="table"> </v-skeleton-loader>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";

const props = defineProps({
  projectType: String,
});

const isDark = useDark();
const isEmpty = ref(false);
const isLoading = ref(false);
const studentEvals = ref([]);
const search = ref("");
const apiUrl = import.meta.env.VITE_API_URL;

const headers = ref([
  { key: "index", sortable: false, title: "No." },
  { key: "lecturerName", sortable: false, title: "Lecturer" },
  { key: "typeOfEvaluator", sortable: false, title: "Type of Evaluator" },
  { key: "projectType", sortable: true, title: "Project Type" },
  { key: "createdAt", sortable: true, title: "Date" },
  { key: "finalMark", sortable: false, title: "Final Mark" },
  { key: "evaluationObjects", sortable: true, title: "Action" },
]);

onMounted(async () => {
  isLoading.value = true;
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.get(
      `${apiUrl}/students/evaluations/${props.projectType}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      studentEvals.value = response.data.map((evaluation, index) => {
        return {
          ...evaluation,
          createdAt: formatDate(evaluation.createdAt),
          index: index + 1,
        };
      });
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      isEmpty.value = true;
    } else {
      console.log("An error occurred. Please try again later.");
    }
  }
  isLoading.value = false;
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

const getText = (grade) => {
  switch (grade) {
    case "a":
      return "No correction";
    case "b1":
      return "One month correction";
    case "b2":
      return "Three months correction";
    case "c1":
      return "Six months correction";
    case "c2":
      return "Six months correction and Re-Presentation";
    default:
      return ""; // Or any default message you want to show if grade is not matched
  }
};

const openDialog = (item) => {
  item.dialog = true;
};

// Function to close the dialog and reset selectedItem
const closeDialog = (item) => {
  item.dialog = false;
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
