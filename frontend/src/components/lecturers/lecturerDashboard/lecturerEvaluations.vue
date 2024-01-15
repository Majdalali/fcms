<template>
  <div>
    <div class="pt-5 w-4/5">
      <v-divider class="mb-5"></v-divider>

      <h1 class="title text-lg font-medium">Previous Evaluations</h1>
      <p class="titleDes mb-5 text-sm font-light">View your evaluations</p>

      <v-data-table class="border" :headers="headers" :items="evaluationData">
        <template v-slot:item.evaluationObjects="{ item }">
          <v-btn @click="openDialog(item)" size="small" color="primary">
            Details
          </v-btn>
          <v-dialog v-model="item.dialog" width="800">
            <v-card>
              <v-card-text class="mt-4">
                <h1 class="title mb-2">Evaluation Details</h1>
                <v-table class="border">
                  <thead>
                    <tr>
                      <th class="text-center text-base">Criteria</th>
                      <th class="text-center text-base">Grade</th>
                      <th class="text-center text-base">Out Of</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(evaluationObject, key) in item.evaluationObjects"
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
                <div class="mt-5">
                  <h1 class="title mb-2">Notes for Coordinator</h1>
                  <v-text-field readonly>
                    <h1>{{ item.remarksForCord }}</h1>
                  </v-text-field>
                </div>
                <h1 class="title">
                  Final Mark
                  <v-chip class="ma-2" label color="teal" variant="elevated">
                    {{ item.finalMark.totalMarks }}
                  </v-chip>
                  /
                  <v-chip class="ma-2" label color="pink" variant="elevated">
                    {{ item.finalMark.totalOutOf }}
                  </v-chip>
                </h1>
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
          {{ item.finalMark.totalMarks }}
          /
          {{ item.finalMark.totalOutOf }}
        </template>
      </v-data-table>
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

// Constants
const evaluationData = ref([]);
const headers = ref([
  { key: "evaluationId", sortable: false, title: "ID." },
  { key: "studentName", sortable: false, title: "Student" },
  { key: "typeOfEvaluator", sortable: false, title: "Type" },
  { key: "criteriaProgram", sortable: false, title: "Program" },
  { key: "createdAt", sortable: false, title: "Created At" },
  { key: "finalMark", sortable: false, title: "Final Mark" },
  { key: "evaluationObjects", sortable: true, title: "Action" },
]);

// Request Body

// Feedback

// Functions

onMounted(async () => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.get(
      "http://localhost:8000/myEvaluations",

      {
        headers: {
          Authorization: token,
        },
      }
    );
    evaluationData.value = response.data.map((evaluation) => {
      return {
        ...evaluation,
        createdAt: formatDate(evaluation.createdAt),
      };
    });
  } catch (error) {
    console.log(error);
  }
});

const openDialog = (item) => {
  item.dialog = true;
};

const closeDialog = (item) => {
  item.dialog = false;
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};
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
