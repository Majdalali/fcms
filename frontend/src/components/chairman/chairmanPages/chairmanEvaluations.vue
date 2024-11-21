<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">Student Evaluations</h1>
      <p class="titleDes text-sm font-light">
        The evaluations made by the lecturers
      </p>
    </div>
    <div class="md:w-4/5 pt-10 h-full">
      <div v-if="!loadingData">
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
        <v-data-table :headers="headers" :items="groupedEvals" :search="search">
          <template v-slot:item.details="{ item }">
            <v-btn
              @click="item.dialogEvals = true"
              size="small"
              color="primary"
            >
              Details
            </v-btn>
            <v-dialog v-model="item.dialogEvals" width="800">
              <v-card>
                <v-card-title>{{ item.studentName }}</v-card-title>

                <v-card-text>
                  <v-expansion-panels>
                    <v-expansion-panel
                      class="border"
                      v-for="(eva, index) in item.evaluations"
                      :key="index"
                    >
                      <v-expansion-panel-title>
                        <template v-slot:default="{ expanded }">
                          <v-row no-gutters>
                            <v-col class="d-flex justify-start" cols="4">
                              {{ eva.evaluationData.lecturerName }}
                            </v-col>
                            <v-col class="text-grey" cols="8">
                              <v-fade-transition leave-absolute>
                                <span v-if="expanded" key="0">
                                  Results:
                                  {{ eva.evaluationData.grade.toUpperCase() }}
                                </span>
                                <span v-else key="1">
                                  {{ eva.evaluationData.createdAt }}
                                </span>
                              </v-fade-transition>
                            </v-col>
                          </v-row>
                        </template>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-table class="border">
                          <thead>
                            <tr>
                              <th>lecturer Name</th>
                              <th>type of Evaluator</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{{ eva.evaluationData.lecturerName }}</td>
                              <td>{{ eva.typeOfEvaluator }}</td>
                              <td>{{ eva.evaluationData.remarksForCord }}</td>
                            </tr>
                          </tbody>
                        </v-table>
                        <v-divider></v-divider>
                        <v-table class="border mt-4">
                          <thead>
                            <tr>
                              <th>Criteria</th>
                              <th>Answer</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(value, key) in eva.evaluationData
                                .evaluationObjects"
                            >
                              <td>{{ key }}</td>
                              <td>{{ value }}</td>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="warning"
                    variant="outlined"
                    class="w-32"
                    text="Close"
                    @click="item.dialogEvals = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:item.newApp="{ item }">
            <v-btn
              :disabled="findStudent(item.studentId)"
              @click="item.dialogNewApp = true"
              size="small"
              color="indigo"
            >
              {{
                findStudent(item.studentId)
                  ? "Application Made"
                  : "New Application"
              }}
            </v-btn>
            <v-dialog v-model="item.dialogNewApp" width="800">
              <v-card>
                <v-card-title>New Application</v-card-title>

                <v-card-text>
                  <v-alert
                    :text="errorMessage"
                    class="py-2 title"
                    type="error"
                    variant="outlined"
                    v-if="errorMessage !== ''"
                  ></v-alert>
                  <div class="py-4">
                    <v-chip size="large" color="primary" label
                      ><v-icon start icon="mdi-account-circle-outline"></v-icon>
                      {{ item.studentName }}</v-chip
                    >
                    <v-chip size="large" color="cyan" label class="ml-2">
                      <v-icon start icon="mdi-label"></v-icon>
                      {{ item.matricNumber }}</v-chip
                    >
                  </div>
                  <p class="title mt-2">
                    Please choose the final decision for the student
                  </p>
                  <v-form v-model="appForm" ref="appRef">
                    <v-radio-group :rules="radioGroupRules" v-model="decision">
                      <v-radio label="A - No correction " value="a"></v-radio>
                      <v-radio
                        label="B1 - One month correction"
                        value="b1"
                      ></v-radio>
                      <v-radio
                        label="B2 - Three months correction"
                        value="b2"
                      ></v-radio>
                      <v-radio
                        label="C1 - Six months correction"
                        value="c1"
                      ></v-radio>
                      <v-radio
                        label="C2 - Six months correction and Re-Presentation"
                        value="c2"
                      ></v-radio> </v-radio-group
                  ></v-form>
                  <p class="title mt-4">
                    Would you like to add any comments for the student?
                    <span class="opacity-70">(Optional)</span>
                  </p>
                  <v-file-input
                    v-model="formFiles"
                    outlined
                    multiple
                    class="mt-2"
                    rows="3"
                    label="Add your comments here..."
                  ></v-file-input>
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
                  <v-btn
                    variant="elevated"
                    class="w-32"
                    color="deep-purple-darken-4"
                    @click="newApplication(item.studentId, item)"
                    :disabled="!appForm"
                  >
                    Submit
                    <span class="pl-2" v-if="requestLoading">
                      <v-progress-circular
                        :size="22"
                        indeterminate
                      ></v-progress-circular>
                    </span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-data-table>
        <div class="py-10">
          <h1 class="title text-lg font-medium">Previous Applications</h1>
          <p class="titleDes text-sm font-light">
            The applications made by the chairman
          </p>
        </div>

        <v-data-table :headers="appsHeaders" :items="chairmanApps">
          <template v-slot:item.chairmanAppDecision="{ item }">
            {{ item.chairmanAppDecision.toUpperCase() }}
          </template>
          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
          <template v-slot:item.docs="{ item }">
            <v-menu v-if="item.chairmanAppSupportingDocuments.length > 0">
              <template v-slot:activator="{ props }">
                <v-btn variant="text" v-bind="props"> View files </v-btn>
              </template>
              <v-list>
                <a
                  v-for="(item, index) in item.chairmanAppSupportingDocuments"
                  :key="index"
                  :href="`${apiUrl}/files/${item}`"
                  target="_blank"
                  class="text-indigo-500"
                >
                  <v-list-item class="text-center" link>
                    {{ index + 1 }}
                  </v-list-item>
                </a>
              </v-list>
            </v-menu>
            <v-btn v-else variant="text" text="Not Provided"></v-btn>
          </template>
        </v-data-table>
      </div>
      <div v-else>
        <v-skeleton-loader
          class="mw-auto border"
          type="table"
        ></v-skeleton-loader>
        <v-skeleton-loader
          class="mw-auto border mt-10"
          type="table"
        ></v-skeleton-loader>
      </div>
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

const props = defineProps({
  evalData: Array,
});

const search = ref("");
const headers = ref([
  { key: "studentName", sortable: false, title: "Student" },
  { key: "matricNumber", sortable: false, title: "Matric No." },
  { key: "details", sortable: false, title: "Evaluations" },
  { key: "newApp", sortable: false, title: "New Application" },
]);

const appsHeaders = ref([
  { key: "studentName", sortable: false, title: "Student" },
  { key: "matricNumber", sortable: false, title: "Matric No." },
  { key: "createdAt", sortable: true, title: "Date" },
  { key: "chairmanAppDecision", sortable: false, title: "Chairman Decision" },
  { key: "chairmanId", sortable: true, title: "Chairman" },
  { key: "docs", sortable: false, title: "Comments" },
]);

const chairmanApps = ref([]);
const groupedEvals = ref([]);
const radioGroupRules = ref([(v) => !!v || "Item is required"]);
const decision = ref("");
const formFiles = ref("");
const autoGenName = ref([]);
const appForm = ref(false);
const appRef = ref(null);
const errorMessage = ref("");
const loadingData = ref(false);

const snackbar = ref(false);
const responseMessage = ref("");
const requestLoading = ref(false);
const apiUrl = import.meta.env.VITE_API_URL;

// Functions

const uploadFiles = async () => {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();

  for (let i = 0; i < formFiles.value.length; i++) {
    formData.append("files", formFiles.value[i]);
  }
  formData.append("submissionType", "chairmanAppDocs");
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
    errorMessage.value = error.response.data.message;

    return;
  }
};

const newApplication = async (studentId, item) => {
  requestLoading.value = true;
  try {
    errorMessage.value = "";
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user.username;

    // upload files and get the autoGeneratedName of the files to be pushed to the supportingDocs array
    if (formFiles.value.length > 0) {
      await uploadFiles();
    }

    // Prepare the payload for the POST request
    const chairmanAppPayload = {
      chairmanAppStudentId: studentId,
      studentName: item.studentName,
      matricNumber: item.matricNumber,
      chairmanAppDecision: decision.value,
      chairmanAppSupportingDocuments: autoGenName.value,
      chairmanId: username,
    };

    // Make the POST request to submit the evaluation
    const response = await axios.post(
      `${apiUrl}/api/chairmanApp`,
      chairmanAppPayload,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      // Handle success
      requestLoading.value = false;
      snackbar.value = true;
      responseMessage.value = "New application submitted successfully.";
      chairmanApps.value.push(response.data.chairmanApp);
      autoGenName.value = [];
      decision.value = "";
      formFiles.value = [];
      // rest the form
      appRef.value.reset();
      closeDialog(item);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value =
        "Error submitting the new application. Please try again.";
    }
  }
  requestLoading.value = false;
};

const groupEvaluationsByStudent = (evalData) => {
  const studentMap = evalData.reduce((acc, evaluation) => {
    const {
      studentId,
      studentName,
      matricNumber,
      typeOfEvaluator,
      evaluatorId,
      ...evaluationData
    } = evaluation;

    if (!acc[studentId]) {
      acc[studentId] = {
        studentId,
        studentName,
        matricNumber,
        evaluations: [],
      };
    }

    acc[studentId].evaluations.push({
      evaluatorId,
      typeOfEvaluator,
      evaluationData,
    });

    return acc;
  }, {});

  return Object.values(studentMap);
};

onMounted(async () => {
  loadingData.value = true;
  // Fetch the chairman applications
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.get(`${apiUrl}/api/chairmanApps`, {
      headers: {
        Authorization: token,
      },
    });
    chairmanApps.value = response.data;
    // create a new array to store the filtered applications where the studentId matches
  } catch (error) {
    if (error.response && error.response.status === 404) {
      chairmanApps.value = [];
    } else {
      errorMessage.value =
        "Error fetching chairman applications. Please try again.";
    }
  }
  // Group evalData By StudentId
  groupedEvals.value = groupEvaluationsByStudent(props.evalData);
  loadingData.value = false;
});

// Function to map through the chairmanApps and find if the studentId matches the studentId in the chairmanApps
const findStudent = (studentId) => {
  return chairmanApps.value.find(
    (app) => app.chairmanAppStudentId === studentId
  );
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

// Function to open the dialog and set selectedItem
const openDialog = (item) => {
  item.dialog = true;
};

// Function to close the dialog and reset selectedItem
const closeDialog = (item) => {
  item.dialog = false;
  item.dialogEvals = false;
  item.dialogNewApp = false;
  decision.value = "";
  formFiles.value = [];
  errorMessage.value = "";
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-UK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
