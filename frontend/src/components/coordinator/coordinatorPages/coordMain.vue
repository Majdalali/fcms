<template>
  <div class="mt-10">
    <div class="lowerDiv mt-5 flex flex-col w-full">
      <div class="w-4/5 flex justify-center"></div>

      <div class="pl-0 w-full">
        <div class="session">
          <div class="w-1/2">
            <h1 class="title text-lg font-medium">Create a new session</h1>
            <p class="titleDes text-sm font-light">
              The home page will display the leatest session
            </p>
          </div>
          <div class="w-4/5 mt-5">
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
                <v-col
                  cols="12"
                  md="6"
                  class="py-0"
                  v-for="(section, index) in dateSections"
                  :key="index"
                >
                  <h1 class="title mt-5 mb-2">{{ section.title }}</h1>
                  <!-- Reusable Date Picker Menu for Range -->
                  <v-menu location="end">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        label="Date Range"
                        v-model="section.dateRange"
                        :value="formattedDateRange(section.dateRange)"
                        append-inner-icon="mdi-calendar-month"
                        readonly
                        v-bind="props"
                      ></v-text-field>
                    </template>
                    <VueDatePicker
                      v-model="section.dateRange"
                      :is-24="false"
                      range
                      inline
                      auto-apply
                      class="vdp-datepicker-inline"
                    ></VueDatePicker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-btn
                size="large"
                variant="elevated"
                color="deep-purple-darken-4"
                class="my-5"
                @click="createSession()"
                :disabled="!valid"
              >
                Create Session</v-btn
              >
            </v-form>
          </div>
        </div>
      </div>
    </div>

    <div class="w-4/5 mt-5"></div>
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
import { useDark } from "@vueuse/core";

// Constants
const isDark = useDark();
const snackbar = ref(false);
const responseMessage = ref("");

const valid = ref(false);
const sessionForm = ref(null);
const sessionTitle = ref("");
const sessionSemester = ref("");
const dateSections = ref([
  { title: "Proposal", dateRange: [] },
  { title: "Progress One", dateRange: [] },
  { title: "Progress Two", dateRange: [] },
  { title: "Final Submission", dateRange: [] },
  { title: "Presentation and Demo", dateRange: [] },
  { title: "Correction", dateRange: [] },
]);

const formRules = [(value) => !!value || "The field is required"];

// functions
const apiUrl = import.meta.env.VITE_API_URL;

const formattedDateRange = (dateRange) => {
  if (dateRange.length === 2) {
    const [startDate, endDate] = dateRange;
    // Format the dates according to your desired format
    return `${format(new Date(startDate), "MM/dd/yyyy h:mm a")} - ${format(
      new Date(endDate),
      "MM/dd/yyyy h:mm a"
    )}`;
  }
  return ""; // Return empty string if date range is not complete
};

const createSession = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const transformedSessions = {};

    dateSections.value.forEach((section) => {
      let formattedTitle;

      // Handle special cases for titles
      switch (section.title) {
        case "Presentation and Demo":
          formattedTitle = "presentationAndDemo";
          break;
        case "Final Submission":
          formattedTitle = "finalSubmission";
          break;
        default:
          formattedTitle = section.title.toLowerCase().replace(/\s+/g, "_");
      }

      transformedSessions[formattedTitle] = {
        startDate: section.dateRange[0] || "",
        endDate: section.dateRange[1] || "",
      };
    });

    const response = await axios.post(
      `${apiUrl}/createSession`,
      {
        session_title: sessionTitle.value,
        session_semester: sessionSemester.value,
        ...transformedSessions,
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
