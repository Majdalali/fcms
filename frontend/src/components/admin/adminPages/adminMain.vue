<template>
  <div class="mt-10">
    <div class="session">
      <div class="w-1/2">
        <h1 class="title text-lg font-medium">Create a new session</h1>
        <p class="titleDes text-sm font-light">
          The home page will display the leatest session
        </p>
      </div>
      <div class="w-4/5 mt-5">
        <v-alert
          class="mb-3 py-2"
          color="info"
          icon="$info"
          border="start"
          border-color="deep-purple-accent-4"
          closable
          text="Please enter the dates in DD-MM-YYYY format. e.g. 01-12-2023"
        ></v-alert>
        <v-form ref="sessionForm" v-model="valid">
          <v-row>
            <v-col class="pb-0" cols="12" md="10">
              <v-text-field
                v-model="sessionTitle"
                hint="e.g. 2021/2022, 2022/2023, 2023/2024"
                label="session Title"
                :rules="formRules"
              ></v-text-field>
            </v-col>
            <v-col class="pb-0" cols="12" md="2">
              <v-text-field
                v-model="sessionSemester"
                label="session Semester"
                hint="e.g. 1, 2"
                :rules="formRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pb-0" cols="12" md="6">
              <v-text-field label="Proposal" v-model="proposal"></v-text-field>
            </v-col>
            <v-col class="pb-0" cols="12" md="6">
              <v-text-field
                label="Progress One"
                v-model="progressOne"
                :rules="formRules"
              ></v-text-field>
            </v-col>
            <v-col class="pb-0" cols="12" md="6">
              <v-text-field
                label="Progress Two"
                v-model="progressTwo"
                :rules="formRules"
              ></v-text-field>
            </v-col>
            <v-col class="pb-0" cols="12" md="6">
              <v-text-field
                label="Final Submission"
                v-model="finalSubmission"
                :rules="formRules"
              ></v-text-field
            ></v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Presentation and Demo"
                v-model="presentationAndDemo"
                :rules="formRules"
              ></v-text-field
            ></v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="formRules"
                label="Correction"
                v-model="correction"
              ></v-text-field
            ></v-col>
          </v-row>
          <v-btn
            size="large"
            variant="elevated"
            color="deep-purple-darken-4"
            class="mb-5"
            @click="createSession()"
            :disabled="!valid"
          >
            Create Session</v-btn
          >
        </v-form>
        <v-divider></v-divider>
      </div>
    </div>
    <div class="adminMaker mt-5">
      <div class="mt-5">
        <h1 class="title text-xl font-medium">Admin privileges</h1>
        <p class="titleDes text-sm font-light">Make a user an admin</p>
      </div>
      <div class="mt-4 w-1/2">
        <v-form v-model="adminValid" ref="adminForm">
          <v-row>
            <v-col cols="12" md="10">
              <v-alert
                v-show="adminError !== ''"
                class="py-1 mb-2"
                closable
                :text="adminError"
                type="error"
              ></v-alert>
              <v-text-field
                label="User email"
                hint="User should be a lecturer"
                v-model="adminEmail"
                :rules="emailRules"
              ></v-text-field></v-col
          ></v-row>
          <v-btn
            size="large"
            variant="elevated"
            color="deep-purple-darken-4"
            class="mb-5 mt-4"
            @click="makeAdmin()"
            text="Make Admin"
            :disabled="!adminValid"
          ></v-btn>
        </v-form>
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
import { ref } from "vue";
import axios from "axios";

// Constants
const snackbar = ref(false);
const responseMessage = ref("");
const adminError = ref("");

const valid = ref(false);
const adminValid = ref(false);
const sessionForm = ref(null);
const adminForm = ref(null);
const sessionTitle = ref("");
const sessionSemester = ref("");
const progressOne = ref("");
const progressTwo = ref("");
const finalSubmission = ref("");
const presentationAndDemo = ref("");
const proposal = ref("");
const correction = ref("");
const adminEmail = ref("");

const formRules = [(value) => !!value || "The field is required"];
const emailRules = [
  (value) => (value && /\S+@\S+\.\S+/.test(value)) || "Invalid email address.",
];

// functions
const makeAdmin = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.post(
      `http://localhost:8000/api/admin`,
      {
        email: adminEmail.value,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status === 200) {
      responseMessage.value = response.data.message;
      snackbar.value = true;
      resetForm();
    } else {
      adminError.value = response.data.message;
    }
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 400 || error.response.status === 404)
    ) {
      adminError.value = error.response.data.error;
      resetForm();
    } else {
      console.error("Error making user an admin:", error);
    }
  }
};

const createSession = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.post(
      `http://localhost:8000/createSession`,
      {
        session_title: sessionTitle.value,
        session_semester: sessionSemester.value,
        progress_one: progressOne.value,
        progress_two: progressTwo.value,
        finalSubmission: finalSubmission.value,
        presentationAndDemo: presentationAndDemo.value,
        proposal: proposal.value,
        correction: correction.value,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status === 200) {
      responseMessage.value = "session created successfully";
      snackbar.value = true;
      resetForm();
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    console.error("Error creating session info:", error);
  }
};

const resetForm = () => {
  sessionForm.value.reset();
  adminForm.value.reset();
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
</style>
