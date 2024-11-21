<template>
  <div class="mt-10">
    <div class="lowerDiv mt-5 flex flex-col w-full">
      <div class="w-fit m-auto">
        <v-tabs
          class="rounded-3xl md:px-20"
          align-tabs="center"
          :bg-color="isDark ? '#fdfefb' : '#BDBDBD'"
          v-model="tab"
        >
          <v-tab class="v-tab" value="one">Session</v-tab>
          <v-tab class="v-tab" value="two">Assign</v-tab>
          <v-tab class="v-tab" value="three">Programs</v-tab>
        </v-tabs>
      </div>

      <div class="pl-0 w-full">
        <v-window disabled v-model="tab">
          <v-window-item value="one"
            ><div class="session">
              <div class="mt-5">
                <h1 class="title text-lg font-medium">Create a new session</h1>
                <p class="titleDes text-sm font-light">
                  The home page will display the leatest session
                </p>
              </div>
              <div class="lg:w-4/5 mt-5">
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
                            :rules="[
                              () =>
                                !!section.dateRange.length ||
                                'The field is required',
                            ]"
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
              <div class="md:w-4/5 mt-5">
                <h1 class="title text-lg font-medium">Current Sessions</h1>
                <small class="text-orange-500 font-semibold"
                  >*Please note that only the latest session is displayed in the
                  home page and used for submission deadlines</small
                >
                <v-alert
                  v-show="sessionUpdateAlert !== ''"
                  type="error"
                  :text="sessionUpdateAlert"
                  class="py-2"
                  closable
                ></v-alert>
                <v-alert
                  color="info"
                  icon="$info"
                  class="my-2 py-2"
                  variant="outlined"
                  text="You can bypass the deadline for a session by toggling the switch. This is useful when you want to allow students to submit regardless of deadline. However, this's applicable for students of all programs."
                >
                </v-alert>
                <v-data-table
                  class="border mt-3"
                  :items="sessions"
                  :headers="sessionsTable"
                >
                  <template v-slot:item.action="{ item }">
                    <v-btn
                      @click="openDialog(item)"
                      size="small"
                      color="primary"
                    >
                      Details
                    </v-btn>
                    <v-dialog v-model="item.dialog" width="1000">
                      <v-card>
                        <v-card-text class="mt-4">
                          <h1 class="title mb-2">
                            Session
                            <strong>{{ item.session_id }}</strong> Details
                          </h1>
                          <v-table class="border">
                            <thead>
                              <tr>
                                <th class="text-center text-base">Type</th>
                                <th class="text-center text-base">
                                  Start Date
                                </th>
                                <th class="text-center text-base">End Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="text-center text-base">Proposal</td>
                                <td class="text-center text-base">
                                  {{ item.proposal.startDate }}
                                </td>
                                <td class="text-center text-base">
                                  {{ item.proposal.endDate }}
                                </td>
                              </tr>
                              <tr>
                                <td class="text-center text-base">
                                  Progress One
                                </td>
                                <td class="text-center text-base">
                                  {{ item.progress_one.startDate }}
                                </td>
                                <td class="text-center text-base">
                                  {{ item.progress_one.endDate }}
                                </td>
                              </tr>
                              <tr>
                                <td class="text-center text-base">
                                  Progress Two
                                </td>
                                <td class="text-center text-base">
                                  {{ item.progress_two.startDate }}
                                </td>
                                <td class="text-center text-base">
                                  {{ item.progress_two.endDate }}
                                </td>
                              </tr>
                              <tr>
                                <td class="text-center text-base">
                                  Final Submission
                                </td>
                                <td class="text-center text-base">
                                  {{ item.finalSubmission.startDate }}
                                </td>
                                <td class="text-center text-base">
                                  {{ item.finalSubmission.endDate }}
                                </td>
                              </tr>
                              <tr>
                                <td class="text-center text-base">
                                  Presentation and Demo
                                </td>
                                <td class="text-center text-base">
                                  {{ item.presentationAndDemo.startDate }}
                                </td>
                                <td class="text-center text-base">
                                  {{ item.presentationAndDemo.endDate }}
                                </td>
                              </tr>
                              <tr>
                                <td class="text-center text-base">
                                  Correction
                                </td>
                                <td class="text-center text-base">
                                  {{ item.correction.startDate }}
                                </td>
                                <td class="text-center text-base">
                                  {{ item.correction.endDate }}
                                </td>
                              </tr>
                            </tbody>
                          </v-table>
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
                  <template v-slot:item.bypass_deadline="{ item }">
                    <v-switch
                      v-model="item.bypass_deadline"
                      @change="
                        updateSessionBypass(
                          item.session_id,
                          item.bypass_deadline
                        )
                      "
                      :label="item.bypass_deadline ? 'Yes' : 'No'"
                      hide-details
                    ></v-switch>
                  </template>
                  <template v-slot:item.delete="{ item }">
                    <v-dialog width="500">
                      <template v-slot:activator="{ props }">
                        <v-btn v-bind:="props" size="small" color="error">
                          Delete
                        </v-btn>
                      </template>

                      <template v-slot:default="{ isActive }">
                        <v-card title="Warning!">
                          <v-card-text class="title">
                            Are you sure you want to delete this session?
                          </v-card-text>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              text="Cancel"
                              @click="isActive.value = false"
                            ></v-btn>
                            <v-btn
                              @click="deleteSession(item.session_id)"
                              color="error"
                            >
                              Delete
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </template>
                </v-data-table>
              </div>
            </div></v-window-item
          >
          <v-window-item value="two">
            <div class="adminMaker w-3/4">
              <div class="mt-4">
                <v-row class="justify-between">
                  <v-col cols="12" md="5">
                    <v-form v-model="adminValid" ref="adminForm">
                      <div class="mt-5">
                        <h1 class="title text-lg font-medium">
                          Admin privileges
                        </h1>
                        <p class="titleDes text-sm font-light">
                          Make a user an admin or a coordinator
                        </p>
                      </div>
                      <v-alert
                        v-show="adminError !== ''"
                        v-model="adminError"
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
                      ></v-text-field>
                      <v-radio-group
                        v-model="radioGroup"
                        class="pl-0"
                        :rules="radioGroupRules"
                      >
                        <h1 class="title text-gray-200">Choose Privilege</h1>
                        <v-radio label="Admin" value="admin"></v-radio>
                        <v-radio
                          label="Coordinator"
                          value="coordinator"
                        ></v-radio>
                        <v-radio label="Chairman" value="chairman"></v-radio>
                      </v-radio-group>
                      <v-btn
                        size="large"
                        variant="elevated"
                        color="deep-purple-darken-4"
                        class="mb-5 mt-4"
                        @click="changePrivilege()"
                        text="Assign Privilege"
                        :disabled="!adminValid"
                      ></v-btn>
                    </v-form>
                  </v-col>
                  <v-col cols="12" md="5">
                    <v-form ref="userForm" v-model="userValid">
                      <div class="mt-5">
                        <h1 class="title text-lg font-medium">
                          Reset password
                        </h1>
                        <p class="titleDes text-sm font-light">
                          Reset a user's password
                        </p>
                      </div>
                      <v-alert
                        v-show="passwordError !== ''"
                        class="py-1 mb-2"
                        closable
                        :text="passwordError"
                        type="error"
                      ></v-alert>
                      <v-text-field
                        label="User email"
                        hint="User should be a lecturer"
                        v-model="userEmail"
                        :rules="emailRules"
                      ></v-text-field>
                      <v-text-field
                        label="New password"
                        hint="User can change the password after login"
                        v-model="userPassword"
                        type="password"
                        :rules="passwordRules"
                      ></v-text-field>
                      <v-btn
                        size="large"
                        variant="elevated"
                        color="deep-purple-darken-4"
                        class="mt-4"
                        @click="changePassword()"
                        text="Change Password"
                        :disabled="!userValid"
                      ></v-btn>
                    </v-form>
                  </v-col>
                </v-row>
              </div>
              <v-divider></v-divider>
              <div class="mt-5">
                <h1 class="title text-lg font-medium">
                  Remove Student From Examiner's List
                </h1>
                <small>
                  *To remove a student from the examiner's list, please enter
                  the student's email address and the examiner's email address
                </small>
              </div>
              <div class="mt-4">
                <v-form v-model="examinerValid" ref="examinerForm">
                  <v-row>
                    <v-col cols="12" md="7">
                      <v-alert
                        v-show="examinerError !== ''"
                        v-model="examinerError"
                        class="py-1 mb-2"
                        closable
                        :text="examinerError"
                        type="error"
                      ></v-alert>
                      <v-text-field
                        label="Student email"
                        hint="Please enter the student's registered email address"
                        v-model="examinerStudent"
                        :rules="emailRules"
                      ></v-text-field>
                      <v-text-field
                        label="Examiner email"
                        hint="Please enter the examiner's registered email address"
                        v-model="examinerEmail"
                        :rules="emailRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-btn
                    size="large"
                    variant="elevated"
                    color="deep-purple-darken-4"
                    class="mb-5 mt-4"
                    text="Submit"
                    :disabled="!examinerValid"
                    @click="removeExaminer()"
                  ></v-btn>
                </v-form>
              </div>
            </div>
          </v-window-item>
          <v-window-item value="three">
            <div class="programMaker md:w-4/5">
              <div class="mt-5">
                <h1 class="title text-lg font-medium">Programs</h1>
                <p class="titleDes text-sm font-light">
                  Create and edit avaliable programs
                </p>
              </div>
              <v-alert
                class="mb-3 py-2 mt-4"
                color="warning  "
                icon="$info"
                border="start"
                border-color="deep-purple-accent-4"
                closable
                text="Please Don't use this function unless you are sure that no program has been created before. And, You can edit the programs from the table below."
              ></v-alert>
              <div class="mt-4">
                <v-form v-model="programValid" ref="programForm">
                  <div
                    class="pt-2"
                    v-for="(programType, index) in programTypes"
                    :key="index"
                  >
                    <small class="titleDes">Program {{ index + 1 }}</small>
                    <v-row class="mt-1">
                      <v-col cols="12" md="7">
                        <v-text-field
                          v-model="programType.name"
                          label="Program name"
                          hint="e.g. Master of Science in Cybersecurity"
                          :rules="formRules"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="programType.abbreviation"
                          label="Program abbreviation"
                          hint="e.g. MCSD, MECC"
                          :rules="formRules"
                        ></v-text-field
                      ></v-col>
                      <v-col cols="12" md="1" class="mt-1">
                        <v-btn
                          size="large"
                          color="success"
                          v-if="index === 0"
                          @click="
                            addEntry(programTypes, {
                              name: '',
                              abbreviation: '',
                            })
                          "
                          ><v-icon icon="mdi-plus-circle"></v-icon
                        ></v-btn>
                        <v-btn
                          size="large"
                          v-else
                          color="error"
                          @click="removeEntry(programTypes, index)"
                          ><v-icon icon="mdi-delete"></v-icon
                        ></v-btn>
                      </v-col>
                    </v-row>
                  </div>

                  <v-btn
                    size="large"
                    variant="elevated"
                    color="deep-purple-darken-4"
                    class="mb-5 mt-4"
                    @click="createProgram()"
                    text="Create Program"
                    :disabled="!programValid"
                  ></v-btn>
                </v-form>
                <v-divider> </v-divider>
                <div v-show="!isEditingProgram" class="CurrnetPrograms mt-5">
                  <h1 class="title text-xl font-medium mb-5">
                    Current Programs
                  </h1>

                  <v-table class="border">
                    <thead>
                      <tr>
                        <th class="text-left">Program Name</th>
                        <th class="text-left">Program Abbreviation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(
                          programType, index
                        ) in currnetPrograms.programTypes"
                        :key="index"
                      >
                        <td>{{ programType.name }}</td>
                        <td>{{ programType.abbreviation }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
                <div v-show="isEditingProgram" class="EditPrograms mt-5">
                  <v-form v-model="editProgramsValid" ref="editProgramsForm">
                    <div
                      class="mb-2"
                      v-for="(program, index) in editPrograms"
                      :key="index"
                    >
                      <small class="titleDes">Program {{ index + 1 }}</small>
                      <v-row class="mt-1">
                        <v-col cols="12" md="7">
                          <v-text-field
                            v-model="program.name"
                            label="Program name"
                            :rules="formRules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="program.abbreviation"
                            label="Program abbreviation"
                            :rules="formRules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="1" class="mt-1">
                          <v-btn
                            size="large"
                            color="error"
                            @click="removeEntry(editPrograms, index)"
                          >
                            <v-icon icon="mdi-delete"></v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                    <div class="mb-8">
                      <v-btn
                        size="large"
                        color="success"
                        @click="
                          addEntry(editPrograms, {
                            name: '',
                            abbreviation: '',
                          })
                        "
                      >
                        <v-icon icon="mdi-plus-circle"></v-icon> Add Program
                      </v-btn>
                    </div>
                    <v-btn
                      size="large"
                      color="warning"
                      variant="outlined"
                      @click="cancelEdit()"
                      text="Cancel"
                    ></v-btn>
                    <v-btn
                      size="large"
                      variant="elevated"
                      color="deep-purple-darken-4"
                      class="ml-5"
                      @click="updatePrograms()"
                      text="Save Changes"
                      :disabled="
                        !editProgramsValid ||
                        JSON.stringify(editProgramsCopy) ===
                          JSON.stringify(editPrograms)
                      "
                    ></v-btn>
                  </v-form>
                </div>
                <v-btn
                  size="large"
                  color="deep-purple-darken-4"
                  text="Edit Programs"
                  class="mt-5"
                  v-show="!isEditingProgram"
                  @click="isEditingProgram = true"
                ></v-btn>
                <h1 class="mt-5">
                  Program ID: {{ currnetPrograms.program_id }}
                </h1>
              </div>
            </div>
          </v-window-item>
        </v-window>
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
import { ref, onMounted } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { format } from "date-fns";

// Constants
const isDark = useDark();
const snackbar = ref(false);
const responseMessage = ref("");
const adminError = ref("");
const tab = ref("one");

// Admin
const adminValid = ref(false);
const adminForm = ref(null);
const adminEmail = ref("");
const radioGroup = ref("");
const examinerForm = ref(null);
const examinerValid = ref(false);
const examinerEmail = ref("");
const examinerStudent = ref("");
const examinerError = ref("");

// Sessions
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
const sessions = ref([]);
const sessionsTable = ref([
  { key: "session_id", sortable: true, title: "ID" },
  { key: "session_title", sortable: true, title: "Title" },
  { key: "session_semester", sortable: false, title: "Semester" },
  { key: "bypass_deadline", sortable: false, title: "Bypass Deadline?" },
  { key: "createdAt", sortable: true, title: "Created At" },
  { key: "action", sortable: false, title: "Action" },
  { key: "delete", sortable: false, title: "Delete" },
]);
const sessionUpdateAlert = ref("");

// Programs
const programValid = ref(false);
const programForm = ref(null);
const programTypes = ref([
  {
    name: "",
    abbreviation: "",
  },
]);
const currnetPrograms = ref({});
const editProgramsValid = ref(false);
const editProgramsForm = ref(null);
const editPrograms = ref([]);
const editProgramsCopy = ref([]);
const isEditingProgram = ref(false);

const userPassword = ref("");
const userEmail = ref("");
const passwordError = ref("");
const userForm = ref(null);
const userValid = ref(false);

const formRules = [(value) => !!value || "The field is required"];
const emailRules = [
  (value) => (value && /\S+@\S+\.\S+/.test(value)) || "Invalid email address.",
];
const passwordRules = [
  (value) => !!value || "The field is required",
  (value) => value.length >= 4 || "Password must be at least 4 characters",
];
const radioGroupRules = [
  (value) => !!value || "Please choose a privilege", // Rule: Ensure a value is selected
];

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

onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/programs`);
    if (response.status === 200) {
      currnetPrograms.value = response.data.programs;
      editPrograms.value = Array.isArray(currnetPrograms.value.programTypes)
        ? JSON.parse(JSON.stringify(currnetPrograms.value.programTypes))
        : [];
      editProgramsCopy.value = JSON.parse(JSON.stringify(editPrograms.value));
    }
  } catch (error) {
    console.error("Error fetching programs:", error);
  }

  // Get all sessions
  try {
    const responseSessions = await axios.get(`${apiUrl}/api/sessions`);
    if (responseSessions.status === 200) {
      const formattedSessions = responseSessions.data.map((session) => {
        return {
          ...session,
          createdAt: formatDateCreatedAt(session.createdAt),
          progress_two: {
            ...session.progress_two,
            startDate: formatDate(session.progress_two.startDate),
            endDate: formatDate(session.progress_two.endDate),
          },
          proposal: {
            ...session.proposal,
            startDate: formatDate(session.proposal.startDate),
            endDate: formatDate(session.proposal.endDate),
          },
          finalSubmission: {
            ...session.finalSubmission,
            startDate: formatDate(session.finalSubmission.startDate),
            endDate: formatDate(session.finalSubmission.endDate),
          },
          presentationAndDemo: {
            ...session.presentationAndDemo,
            startDate: formatDate(session.presentationAndDemo.startDate),
            endDate: formatDate(session.presentationAndDemo.endDate),
          },
          correction: {
            ...session.correction,
            startDate: formatDate(session.correction.startDate),
            endDate: formatDate(session.correction.endDate),
          },
          progress_one: {
            ...session.progress_one,
            startDate: formatDate(session.progress_one.startDate),
            endDate: formatDate(session.progress_one.endDate),
          },
        };
      });

      sessions.value = formattedSessions;
    }
  } catch (error) {
    console.error("Error fetching sessions:", error);
  }
});

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const date = new Date(dateString);
  return date.toLocaleString("en-UK", options);
}

const formatDateCreatedAt = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-UK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};

const cancelEdit = () => {
  editPrograms.value = JSON.parse(JSON.stringify(editProgramsCopy.value));
  isEditingProgram.value = false;
};

const addEntry = (list) => {
  list.push({ name: "", abbreviation: "" });
};

const removeEntry = (list, index) => {
  list.splice(index, 1);
};

const updatePrograms = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.put(
      `${apiUrl}/api/updateProgram/${currnetPrograms.value.program_id}`,
      {
        programTypes: editPrograms.value,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      responseMessage.value = response.data.message;
      currnetPrograms.value = response.data.programs;
      snackbar.value = true;
      isEditingProgram.value = false;
      resetForm();
    }
  } catch (error) {
    console.error("Error updating programs:", error);
  }
};

const createProgram = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const uppercasedProgramTypes = programTypes.value.map((type) => {
      return {
        ...type, // Copy the existing properties
        abbreviation: type.abbreviation.toUpperCase(),
      };
    });
    const response = await axios.post(
      `${apiUrl}/api/newProgram`,
      {
        programTypes: uppercasedProgramTypes,
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
    }
  } catch (error) {
    console.error("Error creating program:", error);
  }
};

const changePrivilege = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.post(
      `${apiUrl}/api/privilege`,
      {
        email: adminEmail.value,
        privilege: radioGroup.value,
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
      adminError.value = "";
      radioGroup.value = "";
      adminForm.value.reset();
    }
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 400 || error.response.status === 404)
    ) {
      adminError.value = error.response.data.error;
      radioGroup.value = "";
      adminForm.value.reset();
    } else {
      adminError.value = "An error occurred while changing the privilege";
    }
  }
};

const changePassword = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.put(
      `${apiUrl}/api/resetPassword`,
      {
        email: userEmail.value,
        password: userPassword.value,
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
      passwordError.value = "";
      userPassword.value = "";
      userEmail.value = "";
      userForm.value.reset();
    }
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 400 || error.response.status === 404)
    ) {
      passwordError.value = error.response.data.error;
      userPassword.value = "";
      userEmail.value = "";
      userForm.value.reset();
    } else {
      passwordError.value = "An error occurred while changing the password";
      userForm.value.reset();
    }
  }
};

const removeExaminer = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.post(
      `${apiUrl}/removeExaminer`,
      {
        studentEmail: examinerStudent.value,
        examinerEmail: examinerEmail.value,
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
      examinerError.value = "";
      examinerForm.value.reset();
    }
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 400 || error.response.status === 404)
    ) {
      examinerError.value = error.response.data.error;
      examinerForm.value.reset();
    } else {
      examinerError.value = "An error occurred while removing the student";
    }
  }
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
      // push the new session to the sessions array
      sessions.value.push(response.data.session);
      sessionForm.value.reset();
      dateSections.value.forEach((section) => {
        section.dateRange = [];
      });
    }
  } catch (error) {
    if (error.response.status === 400) {
      sessionUpdateAlert.value = error.response.data.error;
    } else {
      sessionUpdateAlert.value = "An error occurred while creating the session";
    }
  }
};

const deleteSession = async (session_id) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(
      `${apiUrl}/deleteSession/${session_id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      responseMessage.value = response.data.message;
      snackbar.value = true;
      sessions.value = sessions.value.filter(
        (session) => session.session_id !== session_id
      );
    }
  } catch (error) {
    if (error.response.status === 404) {
      sessionUpdateAlert.value = error.response.data.error;
    } else {
      sessionUpdateAlert.value = "An error occurred while deleting the session";
    }
  }
};

const updateSessionBypass = async (session_id, currentValue) => {
  sessionUpdateAlert.value = "";
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.put(
      `${apiUrl}/updateSession/${session_id}`,
      {
        bypass_deadline: currentValue,
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
    }
  } catch (error) {
    if (error.response.status === 404 || error.response.status === 400) {
      sessionUpdateAlert.value = error.response.data.error;
    } else {
      sessionUpdateAlert.value = "An error occurred while updating the session";
    }
  }
};

const resetForm = () => {
  adminForm.value.reset();
  programForm.value.reset();
  userForm.value.reset();
  programTypes.value = [{ name: "", abbreviation: "" }];
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
.title {
  font-family: "DM Sans", sans-serif;
}
.titleDes {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem /* 18px */;
  line-height: 1.75rem /* 28px */;
}
</style>
