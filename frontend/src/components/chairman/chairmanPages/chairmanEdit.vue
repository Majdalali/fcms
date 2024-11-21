<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">Student Evaluations</h1>
      <p class="titleDes text-sm font-light">
        The evaluations made by the lecturers
      </p>
    </div>
    <div class="md:w-4/5 pt-10 h-full">
      <v-data-table
        v-if="!loadingData"
        :headers="appsHeaders"
        :items="chairmanApps"
      >
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
        <template v-slot:item.actions="{ item }">
          <v-btn size="small" color="indigo" @click="openDialog(item)"
            >Edit</v-btn
          >
          <v-dialog v-model="item.dialog" width="800">
            <v-card>
              <v-card-title>Edit Application</v-card-title>
              <v-card-text>
                <v-form v-model="appForm">
                  <p class="title">Do you want to upload files?</p>
                  <v-radio-group v-model="radioGroupFiles" inline>
                    <v-radio color="warning" label="Yes" value="yes"></v-radio>
                    <v-radio label="No" value="no"></v-radio>
                  </v-radio-group>
                  <div v-if="radioGroupFiles == 'yes'">
                    <p class="title pb-2">Upload Documents</p>
                    <v-file-input
                      v-model="formFiles"
                      label="Supporting Documents"
                      multiple
                      outlined
                      :rules="[formFiles.length > 0 || 'File is required']"
                    ></v-file-input>
                  </div>
                  <p class="title">Do you want to edit the decision?</p>
                  <v-radio-group v-model="radioGroup" inline>
                    <v-radio color="warning" label="Yes" value="yes"></v-radio>
                    <v-radio label="No" value="no"></v-radio>
                  </v-radio-group>
                  <div v-if="radioGroup == 'yes'">
                    <p class="titleDes mt-2 mb-2">Evaluation Decision</p>
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
                      ></v-radio>
                    </v-radio-group>
                  </div>
                </v-form>
                <p class="title pt-4">Currents documents:</p>
                <small v-if="item.chairmanAppSupportingDocuments.length < 1"
                  >No document was found</small
                >
                <h1
                  v-for="(file, index) in item.chairmanAppSupportingDocuments"
                  :key="index"
                  class="title text-base"
                >
                  <a
                    :href="`${apiUrl}/files/${file}`"
                    target="_blank"
                    class="text-indigo-500"
                  >
                    {{ file }}
                  </a>
                  <span>
                    <v-btn
                      class="ml-2"
                      size="small"
                      variant="text"
                      color="error"
                      @click="deleteFile(file, item.chairmanAppId)"
                    >
                      {{ deleteProcessing ? "Deleting..." : "Delete" }}
                    </v-btn>
                  </span>
                </h1>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="warning"
                  class="w-32"
                  variant="outlined"
                  @click="closeDialog(item)"
                  >Cancel</v-btn
                >
                <v-btn
                  color="indigo"
                  variant="elevated"
                  class="w-32"
                  @click="editApp(item.chairmanAppId, item)"
                  :disabled="
                    !appForm ||
                    requestLoading ||
                    (radioGroup == 'no' && radioGroupFiles == 'no')
                  "
                  >Submit
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
      <v-skeleton-loader
        v-else
        class="mw-auto border"
        type="table"
      ></v-skeleton-loader>
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

const appsHeaders = ref([
  { key: "studentName", sortable: false, title: "Student" },
  { key: "matricNumber", sortable: false, title: "Matric No." },
  { key: "createdAt", sortable: true, title: "Date" },
  { key: "chairmanAppDecision", sortable: false, title: "Chairman Decision" },
  { key: "chairmanId", sortable: true, title: "Chairman" },
  { key: "docs", sortable: false, title: "Comments" },
  { key: "actions", sortable: false, title: "Actions" },
]);

const chairmanApps = ref([]);
const decision = ref("");
const appForm = ref(false);
const formFiles = ref("");
const autoGenName = ref([]);
const errorMessage = ref("");
const radioGroup = ref("no");
const radioGroupFiles = ref("yes");
const radioGroupRules = ref([(v) => !!v || "Item is required"]);
const snackbar = ref(false);
const responseMessage = ref("");
const requestLoading = ref(false);
const deleteProcessing = ref(false);
const loadingData = ref(false);
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

const editApp = async (appId, item) => {
  requestLoading.value = true;
  try {
    errorMessage.value = "";
    const token = localStorage.getItem("access_token");

    // upload files and get the autoGeneratedName of the files to be pushed to the supportingDocs array
    if (formFiles.value.length > 0) {
      await uploadFiles();
    }

    // Prepare the payload for the POST request
    const chairmanAppPayload = {
      chairmanAppId: appId,
      chairmanAppDecision: decision.value,
      chairmanAppSupportingDocuments: autoGenName.value,
    };

    // Make the POST request to submit the evaluation
    const response = await axios.put(
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
      responseMessage.value = "Application updated successfully";
      chairmanApps.value = chairmanApps.value.map((app) => {
        if (app.chairmanAppId === appId) {
          app.chairmanAppSupportingDocuments.push(...autoGenName.value);
          if (decision.value) {
            app.chairmanAppDecision = decision.value;
          }
        }
        return app;
      });
      autoGenName.value = [];
      decision.value = "";
      radioGroup.value = "no";
      formFiles.value = [];
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
const deleteGFile = async (docId) => {
  try {
    const deleteDocResponse = await axios.delete(
      `${apiUrl}/api/delete/${docId}`,
      {
        headers: {
          Authorization: token,
        },
        data: {
          collectionName: "chairmanAppDocs",
        },
      }
    );

    if (deleteDocResponse.status === 200) {
      console.log("File deleted successfully");
    }
  } catch (error) {
    console.log("Error deleting the file");
  }
};
const deleteFile = async (docId, cAppId) => {
  deleteProcessing.value = true;
  const token = localStorage.getItem("access_token");

  try {
    await deleteGFile(docId);

    errorMessage.value = "";

    // Prepare the payload for the POST request
    const chairmanAppPayload = {
      chairmanAppId: cAppId,
      docId: docId,
    };

    // Make the POST request to submit the evaluation
    const deleteChairmanDocResponse = await axios.put(
      `${apiUrl}/api/chairmanApp/document`,
      chairmanAppPayload,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (deleteChairmanDocResponse.status === 200) {
      // Handle success
      snackbar.value = true;
      responseMessage.value = "Document deleted successfully";
      chairmanApps.value = chairmanApps.value.map((app) => {
        if (app.chairmanAppId === cAppId) {
          app.chairmanAppSupportingDocuments =
            app.chairmanAppSupportingDocuments.filter((doc) => doc !== docId);
        }
        return app;
      });
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = "Error deleting the document. Please try again.";
    }
  } finally {
    deleteProcessing.value = false;
  }
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
  } catch (error) {
    if (error.response && error.response.status === 404) {
      chairmanApps.value = [];
    } else {
      errorMessage.value =
        "Error fetching chairman applications. Please try again.";
    }
  }
  loadingData.value = false;
});

// Function to open the dialog and set selectedItem
const openDialog = (item) => {
  item.dialog = true;
};

// Function to close the dialog and reset selectedItem
const closeDialog = (item) => {
  item.dialog = false;
  decision.value = "";
  formFiles.value = [];
  radioGroupFiles.value = "yes";
  radioGroup.value = "no";
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
