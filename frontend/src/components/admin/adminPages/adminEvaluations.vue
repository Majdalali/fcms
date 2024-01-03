<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">Student Evaluations</h1>
      <p class="titleDes text-sm font-light">
        The evaluations made by the lecturers
      </p>
    </div>
    <div class="w-4/5 pt-10 h-full">
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
      <v-data-table :headers="headers" :items="evaluationData" :search="search">
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, key) in item.evaluationObjects"
                      :key="key"
                    >
                      <td class="text-center text-base">
                        {{ unformatName(key) }}
                      </td>
                      <td class="text-center text-base">
                        {{ value }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
                <div class="mt-5">
                  <h1 class="title mb-2">Notes for Coordinator</h1>
                  <v-sheet
                    class="p-4 rounded-t-lg h-32 max-h-32 overflow-y-scroll no-scrollbar"
                    elevation="4"
                    color="amber-lighten-4"
                  >
                    <h1>{{ item.remarksForCord }}</h1>
                  </v-sheet>
                </div>
                <h1 class="title mt-2">
                  Final Mark
                  <v-chip class="ma-2" label color="pink" variant="elevated">
                    {{ item.finalMark }}
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
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const search = ref("");
const headers = ref([
  { key: "evaluationId", sortable: false, title: "ID" },
  { key: "lecturerName", sortable: false, title: "Lecturer" },
  { key: "typeOfEvaluator", sortable: false, title: "Type of Evaluator" },
  { key: "studentName", sortable: false, title: "Student" },
  { key: "createdAt", sortable: true, title: "Date" },
  { key: "finalMark", sortable: false, title: "Final Mark" },
  { key: "evaluationObjects", sortable: true, title: "Action" },
]);

const evaluationData = ref([]);

onMounted(async () => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.get("http://localhost:8000/evaluations", {
      headers: {
        Authorization: token,
      },
    });
    evaluationData.value = response.data.map((evaluation) => {
      return {
        ...evaluation,
        createdAt: formatDate(evaluation.createdAt),
      };
    });
  } catch (error) {
    console.error("Error fetching proposal files:", error);
    // Handle error
  }
});

const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

const unformatName = (input) => {
  let unformattedName = "";
  for (let i = 0; i < input.length; i++) {
    if (i === 0 || input[i].toUpperCase() === input[i]) {
      unformattedName += " ";
    }
    unformattedName += input[i];
  }
  return unformattedName.trim();
};

// Function to open the dialog and set selectedItem
const openDialog = (item) => {
  item.dialog = true;
};

// Function to close the dialog and reset selectedItem
const closeDialog = (item) => {
  item.dialog = false;
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
.commentContent {
  font-family: "Source Sans Pro", sans-serif;
}
</style>
