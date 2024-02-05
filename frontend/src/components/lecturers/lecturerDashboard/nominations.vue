<template>
  <div :key="componentKey" class="mt-10">
    <div class="w-1/2">
      <h1 class="title text-lg font-medium">Nomination Form</h1>
      <p class="titleDes font-thin">
        Use this form to nomoinate examiners for a student
      </p>
    </div>
    <div class="w-4/5 my-5 ml-2">
      <v-form
        ref="evaluationForm"
        v-model="valid"
        @submit.prevent="submitNomination"
      >
        <v-stepper
          :elevation="4"
          :items="[
            'Co-Supervisors',
            'Student',
            'In-Examiners',
            'Ex-Examiners',
            'submit',
          ]"
        >
          <template v-slot:item.1>
            <div
              class="pb-10 pl-5"
              v-for="(coSupervisor, index) in coSupervisors"
              :key="index"
            >
              <small class="titleDes">Co Supervisor {{ index + 1 }}</small>
              <v-row class="mt-1">
                <v-col cols="12">
                  <v-text-field
                    variant="outlined"
                    v-model="coSupervisor.name"
                    label="Name"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    variant="outlined"
                    v-model="coSupervisor.email"
                    label="Email"
                    :rules="emailRules"
                  ></v-text-field></v-col
                ><v-col cols="12">
                  <v-text-field
                    variant="outlined"
                    v-model="coSupervisor.phoneNumber"
                    label="Phone Number"
                    :rules="phoneRules"
                  ></v-text-field
                ></v-col>
                <v-col cols="12">
                  <v-btn
                    size="small"
                    color="success"
                    class="w-24"
                    v-if="index === 0"
                    @click="
                      addEntry(coSupervisors, {
                        name: '',
                        email: '',
                        phoneNumber: '',
                      })
                    "
                    >Add More</v-btn
                  >
                  <v-btn
                    size="small"
                    class="w-24"
                    v-else
                    color="error"
                    @click="removeEntry(coSupervisors, index)"
                    >Delete</v-btn
                  >
                </v-col>
              </v-row>
            </div>
          </template>

          <template v-slot:item.2>
            <div class="pl-5">
              <small class="titleDes">Student Details</small>
              <v-row class="mt-1">
                <v-col cols="12" md="4">
                  <v-text-field
                    variant="outlined"
                    v-model="student.name"
                    label="Name"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    variant="outlined"
                    v-model="student.email"
                    label="Email"
                    :rules="emailRules"
                  ></v-text-field></v-col
                ><v-col cols="12" md="4">
                  <v-text-field
                    variant="outlined"
                    v-model="student.utmEmail"
                    label="UTM Email"
                    :rules="emailRules"
                  ></v-text-field></v-col
                ><v-col cols="12" md="4">
                  <v-text-field
                    variant="outlined"
                    v-model="student.phoneNumber"
                    label="Phone Number"
                    :rules="phoneRules"
                  ></v-text-field
                ></v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    variant="outlined"
                    v-model="student.matricNumber"
                    label="Matric Number"
                    :rules="matricCardRules"
                  ></v-text-field
                ></v-col>
                <v-col cols="12" md="4">
                  <v-select
                    variant="outlined"
                    v-model="student.studentProgram"
                    label="Program"
                    required
                    :items="currnetPrograms.programTypes"
                    :hint="student.studentProgram"
                    item-title="name"
                    item-value="abbreviation"
                  ></v-select
                ></v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    variant="outlined"
                    v-model="student.dissertationTitle"
                    label="Dissertation Title"
                    :rules="otherFieldsRules"
                  ></v-text-field
                ></v-col>
                <v-col cols="12" md="12">
                  <v-textarea
                    variant="outlined"
                    v-model="student.dissertationAbstract"
                    label="Dissertation Abstract"
                    :rules="otherFieldsRules"
                  ></v-textarea
                ></v-col>
              </v-row>
            </div>
          </template>

          <template v-slot:item.3>
            <div
              class="pb-10 pl-5"
              v-for="(internalExaminer, index) in internalExaminers"
              :key="index"
            >
              <small class="titleDes">Internal Examiner {{ index + 1 }}</small>
              <v-row class="mt-1">
                <v-col cols="12" md="6">
                  <v-text-field
                    variant="outlined"
                    v-model="internalExaminer.name"
                    label="Name"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    variant="outlined"
                    v-model="internalExaminer.email"
                    label="Email"
                    :rules="emailRules"
                  ></v-text-field></v-col
                ><v-col cols="12" md="6">
                  <v-text-field
                    variant="outlined"
                    v-model="internalExaminer.phoneNumber"
                    label="Phone Number"
                    :rules="phoneRules"
                  ></v-text-field></v-col
                ><v-col cols="12" md="6">
                  <v-file-input
                    variant="outlined"
                    :v-model="[internalExaminer.cvFile]"
                    :rules="[
                      (v) => !!v || 'File is required',
                      (v) => (v && v.length > 0) || 'File is required',
                    ]"
                    label="Examiner CV File"
                    @change="
                      handleInternalExaminerFileUpload(internalExaminer, $event)
                    "
                  ></v-file-input
                ></v-col>
                <v-col cols="12">
                  <v-btn
                    size="small"
                    color="success"
                    class="w-24"
                    v-if="index === 0"
                    @click="
                      addEntry(internalExaminers, {
                        name: '',
                        email: '',
                        phoneNumber: '',
                      })
                    "
                    >Add More</v-btn
                  >
                  <v-btn
                    size="small"
                    class="w-24"
                    v-else
                    color="error"
                    @click="removeEntry(internalExaminers, index)"
                    >Delete</v-btn
                  ></v-col
                >
              </v-row>
            </div>
          </template>
          <template v-slot:item.4>
            <div
              class="pb-10 pl-5"
              v-for="(externalExaminer, index) in externalExaminers"
              :key="index"
            >
              <small class="titleDes">External Examiner {{ index + 1 }}</small>
              <v-row class="mt-1">
                <v-col cols="12" md="4">
                  <v-text-field
                    variant="outlined"
                    v-model="externalExaminer.name"
                    label="Name"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    variant="outlined"
                    v-model="externalExaminer.email"
                    label="Email"
                    :rules="emailRules"
                  ></v-text-field></v-col
                ><v-col cols="12" md="4">
                  <v-text-field
                    variant="outlined"
                    v-model="externalExaminer.phoneNumber"
                    label="Phone Number"
                    :rules="phoneRules"
                  ></v-text-field
                ></v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    variant="outlined"
                    v-model="externalExaminer.institution"
                    label="Institution"
                    :rules="otherFieldsRules"
                  ></v-text-field
                ></v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    variant="outlined"
                    v-model="externalExaminer.expertise"
                    label="Expertise"
                    :rules="otherFieldsRules"
                  ></v-text-field
                ></v-col>
                <v-col cols="12">
                  <v-file-input
                    variant="outlined"
                    :v-model="[externalExaminer.cvFile]"
                    :rules="[
                      (v) => !!v || 'File is required',
                      (v) => (v && v.length > 0) || 'File is required',
                    ]"
                    label="Examiner CV File"
                    @change="
                      handleExternalExaminerFileUpload(externalExaminer, $event)
                    "
                  ></v-file-input
                ></v-col>
                <v-col cols="12"
                  ><v-btn
                    size="small"
                    color="success"
                    class="w-24"
                    v-if="index === 0"
                    @click="
                      addEntry(externalExaminers, {
                        name: '',
                        email: '',
                        phoneNumber: '',
                        institution: '',
                        expertise: '',
                      })
                    "
                    >Add More</v-btn
                  >
                  <v-btn
                    size="small"
                    class="w-24"
                    v-else
                    color="error"
                    @click="removeEntry(externalExaminers, index)"
                    >Delete</v-btn
                  ></v-col
                >
              </v-row>
            </div>
          </template>
          <template v-slot:item.5>
            <v-col cols="12">
              <v-checkbox
                v-model="passedDisserationTwo"
                label="Student passed Disseration 2"
              ></v-checkbox>
              <v-checkbox
                v-model="passedElectivesAndCores"
                label="Student passed electives and cores subjects"
              ></v-checkbox>
              <v-checkbox
                v-model="examinersNotified"
                label="Examiners were notified"
              ></v-checkbox>
              <v-btn
                color="deep-purple-darken-4"
                class="mb-2"
                size="large"
                variant="elevated"
                type="submit"
                :disabled="!valid"
                >Submit Nomination</v-btn
              >
              <br />
              <small class="text-red-600 text-sm" v-show="!valid"
                >*Please check all the fields and don't leave any empty</small
              >
            </v-col>
          </template>
        </v-stepper>
      </v-form>
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
const snackbar = ref(false);
const componentKey = ref(0);
const evaluationForm = ref(null);
const responseMessage = ref("");
const coSupervisors = ref([
  { name: "", email: "", phoneNumber: "" }, // Initial empty co-supervisor
]);
const student = ref({
  name: "",
  email: "",
  phoneNumber: "",
  utmEmail: "",
  studentProgram: "",
  matricNumber: "",
  dissertationTitle: "",
  dissertationAbstract: "",
});
const internalExaminers = ref([
  { name: "", email: "", phoneNumber: "", cvFile: null },
]);
const externalExaminers = ref([
  {
    name: "",
    email: "",
    phoneNumber: "",
    institution: "",
    expertise: "",
    cvFile: null,
  },
]);
const passedDisserationTwo = ref(false);
const passedElectivesAndCores = ref(false);
const examinersNotified = ref(false);
const currnetPrograms = ref({});

// Rules for input validation
const valid = ref(false);
const nameRules = [
  (value) =>
    (value && value.length >= 5 && /^[a-zA-Z\s]*$/.test(value)) ||
    "Name must be at least 5 characters with no numbers or symbols.",
];

const matricCardRules = [
  (value) =>
    (value && value.length === 9 && /^[a-zA-Z0-9]*$/.test(value)) ||
    "Matric number must be exactly 9 characters, alphanumeric only.",
];

const emailRules = [
  (value) => (value && /\S+@\S+\.\S+/.test(value)) || "Invalid email address.",
];

const phoneRules = [
  (value) =>
    (value && /^[0-9]*$/.test(value)) ||
    "Phone number should contain only numbers.",
];

const otherFieldsRules = [(value) => !!value || "This field is required."];

const apiUrl = import.meta.env.VITE_API_URL;

// Functions
onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/programs`);
    if (response.status === 200) {
      currnetPrograms.value = response.data.programs;
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching programs:", error);
  }
});

// Function to add or remove an entry to the respective array
const addEntry = (list, item) => {
  if (list) {
    list.push(item);
  }
};

const removeEntry = (list, index) => {
  if (list) {
    list.splice(index, 1);
  }
};

const resetForm = () => {
  evaluationForm.value.reset();
  coSupervisors.value = [{ name: "", email: "", phoneNumber: "" }];
  student.value = {
    name: "",
    email: "",
    phoneNumber: "",
    utmEmail: "",
    studentProgram: "",
    matricNumber: "",
    dissertationTitle: "",
    dissertationAbstract: "",
  };
  internalExaminers.value = [
    { name: "", email: "", phoneNumber: "", cvFile: null },
  ];
  externalExaminers.value = [
    {
      name: "",
      email: "",
      phoneNumber: "",
      institution: "",
      expertise: "",
      cvFile: null,
    },
  ];
};

const handleInternalExaminerFileUpload = (examiner, event) => {
  const file = event.target.files[0];
  const fileID = Date.now(); // Use current timestamp as a unique identifier
  examiner.cvFile = file;
  examiner.cvFileId = fileID;
};

const handleExternalExaminerFileUpload = (examiner, event) => {
  const file = event.target.files[0];
  const fileID = Date.now(); // Use current timestamp as a unique identifier
  examiner.cvFile = file;
  examiner.cvFileId = fileID;
};

const submitNomination = async () => {
  try {
    const token = localStorage.getItem("access_token");

    // Prepare the internalExaminers and externalExaminer data with CV file information
    const internalExaminersData = internalExaminers.value.map((examiner) => ({
      name: examiner.name,
      email: examiner.email,
      phoneNumber: examiner.phoneNumber,
      cvFile: examiner.cvFileId, // Include the CV file information
    }));

    const externalExaminersData = externalExaminers.value.map((examiner) => ({
      name: examiner.name,
      email: examiner.email,
      phoneNumber: examiner.phoneNumber,
      institution: examiner.institution,
      expertise: examiner.expertise,
      cvFile: examiner.cvFileId, // Include the CV file information
    }));

    // Create a FormData object to handle file uploads
    const formData = new FormData();

    // Append co-supervisors, student, internalExaminers, and externalExaminers data

    // Append co-supervisors
    formData.append(
      "coSupervisors",
      JSON.stringify(
        coSupervisors.value.map((supervisor) => ({ ...supervisor }))
      )
    );

    // Append student as an object
    formData.append("student", JSON.stringify({ ...student.value }));

    // Append internalExaminers as an array of objects
    formData.append("internalExaminers", JSON.stringify(internalExaminersData));

    // Append externalExaminers as an array of objects
    formData.append("externalExaminers", JSON.stringify(externalExaminersData));

    // Append other fields
    formData.append("passedDisserationTwo", passedDisserationTwo.value);
    formData.append("passedElectivesAndCores", passedElectivesAndCores.value);
    formData.append("examinersNotified", examinersNotified.value);

    // Append internal examiner CV files
    internalExaminers.value.forEach((examiner) => {
      const fileExtension = examiner.cvFile.name.split(".").pop(); // Extract file extension
      formData.append(
        `cvFiles`,
        examiner.cvFile,
        `internal-${examiner.cvFileId}.${fileExtension}`
      );
    });
    externalExaminers.value.forEach((examiner) => {
      const fileExtension = examiner.cvFile.name.split(".").pop(); // Extract file extension
      formData.append(
        `cvFiles`,
        examiner.cvFile,
        `external-${examiner.cvFileId}.${fileExtension}`
      );
    });

    const response = await axios.post(
      `${apiUrl}/lecturer/newnomination`,
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      // Update userInfo with the values from the input fields
      snackbar.value = true;
      responseMessage.value = "Nomination submitted successfully";
      // Clear form fields
      resetForm();
      componentKey.value += 1;
    } else {
      // Handle error cases or display an error message
      console.error("Error sending nomination:", response.data);
    }
  } catch (error) {
    console.error("Internal error sending nomination:", error);
    // Handle error, display an error message, or redirect if needed
  }
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
