<template>
  <div class="mt-10">
    <div class="lowerDiv mt-5 flex flex-col w-full">
      <div class="w-4/5 flex justify-center">
        <v-tabs
          class="rounded-3xl w-1/2"
          align-tabs="center"
          :bg-color="isDark ? '#fdfefb' : '#BDBDBD'"
          v-model="tab"
        >
          <v-tab class="v-tab" value="one">Session</v-tab>
          <v-tab class="v-tab" value="two">Make Admin</v-tab>
          <v-tab class="v-tab" value="three">Programs</v-tab>
        </v-tabs>
      </div>

      <div class="pl-0 w-full">
        <v-window v-model="tab">
          <v-window-item value="one"
            ><div class="session">
              <div class="w-1/2 mt-5">
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
                      <v-text-field
                        label="Proposal"
                        v-model="proposal"
                      ></v-text-field>
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
              </div>
            </div></v-window-item
          >
          <v-window-item value="two">
            <div class="adminMaker w-1/2">
              <div class="w-1/2 mt-5">
                <h1 class="title text-lg font-medium">Admin privileges</h1>
                <p class="titleDes text-sm font-light">Make a user an admin</p>
              </div>
              <div class="mt-4">
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
              </div></div
          ></v-window-item>
          <v-window-item value="three">
            <div class="programMaker w-4/5">
              <div class="w-1/2 mt-5">
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
                      v-for="(program, index) in editProgramsCopy"
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
                            @click="removeEntry(editProgramsCopy, index)"
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
                          addEntry(editProgramsCopy, {
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

// Constants
const snackbar = ref(false);
const responseMessage = ref("");
const adminError = ref("");
const tab = ref("one");

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

const formRules = [(value) => !!value || "The field is required"];
const emailRules = [
  (value) => (value && /\S+@\S+\.\S+/.test(value)) || "Invalid email address.",
];

// functions
const apiUrl = import.meta.env.VITE_API_URL;
onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/programs`);
    if (response.status === 200) {
      currnetPrograms.value = response.data.programs;
      editPrograms.value = Array.isArray(currnetPrograms.value.programTypes)
        ? [...currnetPrograms.value.programTypes]
        : [];
      editProgramsCopy.value = [...editPrograms.value];
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching programs:", error);
  }
});

const cancelEdit = () => {
  editProgramsCopy.value = [...editPrograms.value];
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
        programTypes: editProgramsCopy.value,
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
    } else {
      console.log(response.data.message);
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
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    console.error("Error creating program:", error);
  }
};

const makeAdmin = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.post(
      `${apiUrl}/api/admin`,
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
      `${apiUrl}/createSession`,
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
  programForm.value.reset();
  programTypes.value = [{ name: "", abbreviation: "" }];
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
