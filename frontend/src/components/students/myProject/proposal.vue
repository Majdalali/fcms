<template>
  <v-app
    :theme="isDark ? 'dark' : 'light'"
    :class="isDark ? 'tempDiv-dark' : 'tempDiv'"
  >
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="2" sm="0" class="nav sm:mb-5">
          <Navigation />
        </v-col>
        <v-col
          cols="12"
          md="12"
          lg="10"
          style="min-width: 70%; max-width: 100%"
          class="main"
        >
          <div class="pt-4 upperDiv">
            <h1 class="text-3xl font-medium title">Proposal Form</h1>
            <p class="text-base titleDes font-light">
              Submit your project proposal here, and check the status of your
              approval.
            </p>
          </div>

          <div class="lowerDiv pt-10 lg:w-4/5">
            <v-card
              class="vCard"
              variant="elevated"
              outlined
              :color="isDark ? 'grey-darken-4' : 'grey-lighten-5'"
              style="border-radius: 10px"
            >
              <v-card-title class="text-2xl font-medium title">
                Upload Forms
              </v-card-title>
              <v-card-text class="text-center">
                <p class="text-base titleDes text-left font-light">
                  Upload your project proposal and other supporting files here.
                </p>
                <p
                  v-if="!isLoading && submissionDate"
                  class="titleDes text-left text-base font-light py-2"
                >
                  Submission deadline:
                  {{ formatDate(submissionDate.proposal?.startDate) }} -
                  {{ formatDate(submissionDate.proposal?.endDate) }}
                </p>
                <p
                  v-if="!isLoading"
                  class="titleDes text-left text-base font-light"
                >
                  Submission status:
                  <span class="text-green-400 font-bold" v-if="isWithinDeadline"
                    >Open</span
                  >
                  <span class="text-red-400 font-bold" v-else>Closed</span>
                </p>
                <v-btn
                  size="large"
                  :disabled="!isWithinDeadline"
                  color="indigo"
                  variant="elevated"
                  text="Upload Proposal File"
                  class="my-5"
                  @click="dialog = true"
                ></v-btn>
                <v-btn
                  size="large"
                  :disabled="!isWithinDeadline"
                  color="indigo"
                  variant="elevated"
                  text="Upload Other Supporting Files"
                  :class="largerThanSm ? 'ml-5 my-5' : 'my-5'"
                  @click="dialogOther = true"
                ></v-btn>
              </v-card-text>
            </v-card>
            <v-dialog v-model="dialog" persistent width="1024">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Upload Proposal File</span>
                </v-card-title>
                <v-form ref="proposalForm" v-model="valid">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-file-input
                            v-model="mainFile"
                            variant="outlined"
                            clearable
                            label="Proposal File"
                            show-size
                            counter
                            :rules="[
                              (v) => !!v || 'File is required',
                              (v) => (v && v.length > 0) || 'File is required',
                            ]"
                          ></v-file-input>

                          <p>
                            *Only One file is allowed, if you would like to
                            upload multiple files, you can use .rar or upload in
                            the "Others" section
                          </p>
                          <p
                            class="text-red-500 font-bold pt-2"
                            v-if="mainInfo.length > 0"
                          >
                            *Please Delete the old file first to upload a new
                            one
                          </p>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-alert
                      v-if="errorMessage"
                      type="error"
                      variant="outlined"
                      closable
                      >{{ errorMessage }}</v-alert
                    >
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="warning"
                      class="w-32 cardValue"
                      variant="outlined"
                      @click="dialog = false"
                    >
                      Close
                    </v-btn>
                    <v-btn
                      @click="submitMainFiles()"
                      class="cardValue w-32"
                      variant="elevated"
                      color="indigo"
                      :disabled="!valid || mainInfo.length > 0"
                    >
                      <v-icon class="mr-2"><upload /></v-icon>
                      Upload
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogOther" persistent width="1024">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Upload Other Files</span>
                </v-card-title>
                <v-form ref="proposalForm" v-model="validOthers">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-file-input
                            v-model="otherFiles"
                            multiple
                            chips
                            variant="outlined"
                            clearable
                            label="Other Files"
                            show-size
                            counter
                            :rules="[
                              (v) => !!v || 'File is required',
                              (v) => (v && v.length > 0) || 'File is required',
                            ]"
                          ></v-file-input>
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-alert
                      v-if="errorMessage"
                      type="error"
                      variant="outlined"
                      closable
                      >{{ errorMessage }}</v-alert
                    >
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="warning"
                      class="w-32 cardValue"
                      variant="outlined"
                      @click="dialogOther = false"
                    >
                      Close
                    </v-btn>
                    <v-btn
                      @click="submitOtherFiles()"
                      class="cardValue w-32"
                      variant="elevated"
                      color="indigo"
                      :disabled="!validOthers"
                    >
                      <v-icon class="mr-2"><upload /></v-icon>
                      Upload
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
            <v-row v-show="!isLoading" class="pt-5">
              <v-col v-for="file in mainInfo" cols="12">
                <v-card
                  class="pa-3 rounded-lg"
                  variant="tonal"
                  :color="isDark ? 'blue-grey-lighten-2' : 'blue-grey-darken-4'"
                >
                  <v-card-subtitle
                    >{{ formatDate(file.createdAt) }}
                  </v-card-subtitle>
                  <v-card-text>
                    <div
                      class="flex title justify-between flex-col sm:flex-row"
                    >
                      <div class="flex flex-row items-center">
                        <v-icon size="large" :icon="forms"></v-icon>
                        <h1 class="text-lg pl-2">
                          {{ file.originalName }}
                        </h1>
                      </div>
                      <a
                        :href="`${apiUrl}/files/${file.autogeneratedName}`"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span
                          class="text-base underline text-blue-800 dark:text-blue-400"
                          >{{ file.autogeneratedName }}</span
                        >
                      </a>
                    </div>
                    <div
                      class="flex title justify-between uppercase text-lg flex-col mt-5"
                    >
                      <h1
                        class="title"
                        v-if="file.proposalStatus === 'pending'"
                      >
                        Proposal Status:
                        <strong>{{ file.proposalStatus }}</strong>
                      </h1>
                      <h1
                        class="title"
                        v-if="file.proposalStatus === 'accepted'"
                      >
                        Proposal Status:
                        <span class="text-green-600 font-bold">{{
                          file.proposalStatus
                        }}</span>
                      </h1>
                      <h1
                        class="title"
                        v-else-if="file.proposalStatus === 'failed'"
                      >
                        Proposal Status:
                        <span class="text-red-500 font-bold">{{
                          file.proposalStatus
                        }}</span>
                      </h1>
                      <h1
                        class="title"
                        v-else-if="
                          file.proposalStatus === 'minorCorre' ||
                          file.proposalStatus === 'majorCorre'
                        "
                      >
                        Proposal Status:
                        <span
                          v-if="file.proposalStatus === 'minorCorre'"
                          class="text-yellow-500 font-bold"
                        >
                          Minor Corrections</span
                        >
                        <span
                          v-else-if="file.proposalStatus === 'majorCorre'"
                          class="text-yellow-400 font-bold"
                        ></span>
                      </h1>
                      <h1 class="title">
                        Remarks:
                        <strong>{{ file.remarksFromCoordinator }}</strong>
                      </h1>
                    </div>
                  </v-card-text>
                  <v-card-action>
                    <v-btn
                      color="error"
                      size="small"
                      variant="text"
                      class="title"
                      text="Delete"
                      @click="deleteFile(file.autogeneratedName, 'Main')"
                    ></v-btn>
                  </v-card-action>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-show="!isLoading" class="pt-3">
              <p class="pl-3 text-sm title" v-if="otherInfo.length > 0">
                Other Files
              </p>
              <v-col v-for="file in otherInfo" cols="12">
                <v-card
                  class="pa-3 rounded-lg"
                  variant="tonal"
                  :color="isDark ? 'blue-grey-lighten-2' : 'blue-grey-darken-4'"
                >
                  <v-card-subtitle
                    >{{ formatDate(file.createdAt) }}
                  </v-card-subtitle>
                  <v-card-text>
                    <div
                      class="flex title justify-between flex-col sm:flex-row"
                    >
                      <div class="flex flex-row items-center pb-2 sm:pb-0">
                        <v-icon size="large" :icon="forms"></v-icon>
                        <h1 class="text-lg pl-2">
                          {{ file.originalName }}
                        </h1>
                      </div>
                      <a
                        :href="`${apiUrl}/files/${file.autogeneratedName}`"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span
                          class="text-base underline text-blue-800 dark:text-blue-400"
                          >{{ file.autogeneratedName }}</span
                        >
                      </a>
                    </div>
                  </v-card-text>
                  <v-card-action>
                    <v-btn
                      color="error"
                      size="small"
                      variant="text"
                      class="title"
                      text="Delete"
                      @click="deleteFile(file.autogeneratedName, 'Others')"
                    ></v-btn>
                  </v-card-action>
                </v-card>
              </v-col>
            </v-row>
            <v-alert
              v-if="
                mainInfo.length === 0 && otherInfo.length === 0 && !isLoading
              "
              variant="outlined"
              class="py-2 title my-3"
              icon="mdi-information"
              color="info"
              title="You haven't uploaded anything yet."
            ></v-alert>
            <v-skeleton-loader
              v-if="isLoading"
              class="mw-auto mt-5 py-6 rounded-lg"
              type="heading, paragraph"
            ></v-skeleton-loader>
          </div>
        </v-col>
      </v-row>
      <p class="text-red-400 title text-base">{{ errorMessage }}</p>
    </v-container>
    <v-snackbar
      :timeout="2000"
      color="indigo"
      variant="elevated"
      v-model="snackbar"
    >
      {{ snackbarMessage }}

      <template v-slot:actions>
        <v-btn color="white" variant="transparent" @click="snackbar = false">
          X
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import Navigation from "../../navigation.vue";
import forms from "@/assets/icons/forms.vue";
import upload from "@/assets/icons/upload.vue";
import { useDark, useBreakpoints, breakpointsTailwind } from "@vueuse/core";
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// Constants
const isDark = useDark();
const breakpoints = useBreakpoints(breakpointsTailwind);
const mdAndUp = breakpoints.greaterOrEqual("md");
const largerThanSm = breakpoints.greater("sm");
const apiUrl = import.meta.env.VITE_API_URL;
const snackbar = ref(false);
const snackbarMessage = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const submissionDate = ref({});

const valid = ref(false);
const dialog = ref(false);
const mainFile = ref([]);
const mainInfo = ref([]);

const validOthers = ref(false);
const dialogOther = ref(false);
const otherFiles = ref([]);
const otherInfo = ref([]);

// Methods
const submitMainFiles = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();

    if (mainFile.value) {
      const submissionCheckData = {
        projectType: "proposals",
        submissionType: "proposals", // Set the submission type for checking existing submission
      };

      // First request: Check for existing submission
      const existingSubmissionResponse = await axios.post(
        `${apiUrl}/checkExistingSubmission`,
        submissionCheckData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        existingSubmissionResponse.status === 400 &&
        existingSubmissionResponse.data.error
      ) {
        console.error("Submission already exists for this student and type.");
        errorMessage.value = existingSubmissionResponse.data.error;
        return; // Stop file upload process
      } else {
        // Reset the error message on successful upload
        errorMessage.value = "";
      }

      // If no existing submission, proceed with file upload
      formData.append("file", mainFile.value[0]);
      formData.append("submissionType", "proposals");
      formData.append("projectType", "proposals");

      const uploadFileResponse = await axios.post(
        `${apiUrl}/students/files/upload`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      mainInfo.value = uploadFileResponse.data.fileSubmissionData;
      dialog.value = false;
      mainFile.value = null;
      snackbar.value = true;
      snackbarMessage.value = "File uploaded successfully.";
    }
  } catch (error) {
    errorMessage.value = error.response.data.error;
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("access_token");
    const payload = {
      projectType: "proposals",
    };
    // Get main file
    try {
      const responseMain = await axios.get(`${apiUrl}/myfiles`, {
        params: {
          submissionType: "proposals",
          ...payload,
        },
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (responseMain.status === 200) {
        mainInfo.value = responseMain.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        mainInfo.value = [];
      } else {
        errorMessage.value = error.response.data.error;
      }
    }

    // Get other files
    try {
      const responseOthers = await axios.get(`${apiUrl}/myfiles`, {
        params: {
          submissionType: "proposalsExtras",
          ...payload,
        },
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (responseOthers.status === 200) {
        otherInfo.value = responseOthers.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        otherInfo.value = [];
      } else {
        errorMessage.value = error.response.data.error;
      }
    }

    try {
      const response = await axios.get(`${apiUrl}/currentSession`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      submissionDate.value = response.data;
    } catch (error) {
      console.error("Error fetching submissionDate:", error);
    }
  } catch (error) {
    console.error("Error fetching info:", error);
    errorMessage.value = "Error fetching files. Please try again later.";
  }
  isLoading.value = false;
});

const submitOtherFiles = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();

    if (otherFiles.value.length > 0) {
      otherFiles.value.forEach((file) => {
        formData.append("file", file);
      });
      formData.append("submissionType", "proposalsExtras");
      formData.append("projectType", "proposals");

      const response = await axios.post(
        `${apiUrl}/students/files/upload`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      otherInfo.value.push(...response.data.fileSubmissionData);
      otherFiles.value = [];
      dialogOther.value = false;
      snackbar.value = true;
      snackbarMessage.value = "File(s) uploaded successfully.";
    }
  } catch (error) {
    errorMessage.value = error.response.data.error;
  }
};

const deleteFile = async (autogeneratedName, dialogType) => {
  try {
    const token = localStorage.getItem("access_token");
    let submissionType;
    if (dialogType === "Main") {
      submissionType = "proposals";
    } else if (dialogType === "Others") {
      submissionType = "proposalsExtras";
    }
    const response = await axios.delete(
      `${apiUrl}/students/files/${autogeneratedName}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        // If submissionType is required in the request body, pass it here
        data: {
          submissionType, // Adjust if needed
        },
      }
    );
    // Handle success response if needed
    if (dialogType === "Main") {
      mainInfo.value = mainInfo.value.filter(
        (file) => file.autogeneratedName !== autogeneratedName
      );
    } else if (dialogType === "Others") {
      otherInfo.value = otherInfo.value.filter(
        (file) => file.autogeneratedName !== autogeneratedName
      );
    }
    snackbar.value = true;
    snackbarMessage.value = "File deleted successfully.";
  } catch (error) {
    errorMessage.value = error.response.data.error;
  }
};

const isWithinDeadline = computed(() => {
  const now = new Date();
  if (!submissionDate.value || submissionDate.value.bypass_deadline === true) {
    return true;
  } else if (submissionDate.value.proposal) {
    const jsStartDate = new Date(submissionDate.value.proposal.startDate);
    const jsEndDate = new Date(submissionDate.value.proposal.endDate);
    const currentTime = now.getTime();

    return (
      currentTime >= jsStartDate.getTime() && currentTime <= jsEndDate.getTime()
    );
  }
  return false;
});

const formatDate = (createdAt) => {
  if (typeof createdAt === "string") {
    // Handle the case when createdAt is provided as a string
    const date = new Date(createdAt);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  } else if (createdAt && createdAt._seconds && createdAt._nanoseconds) {
    // Handle the case when createdAt is provided as an object with _seconds and _nanoseconds
    const date = new Date(createdAt._seconds * 1000);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  } else {
    // Handle other cases or return a default value
    return "Invalid Date";
  }
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
