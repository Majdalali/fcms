<template>
  <div>
    <div class="pt-10 mb-5">
      <h1 class="title text-lg font-medium">Lecturers & Supervisors</h1>
      <p class="titleDes text-base font-light">List of registered Lecturers</p>
    </div>
    <div class="lg:w-[90%]">
      <v-dialog v-model="dialog" max-width="800px">
        <template v-slot:activator="{ on }">
          <div v-if="!isLoading">
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
            <v-data-table
              class="border"
              :headers="headers"
              :items="userInfo"
              :search="search"
            >
              <template v-slot:item.numSupervised="{ item }">
                <a
                  class="text-blue-500 cursor-pointer"
                  v-if="item.numSupervised > 0"
                  @click="openDialog(item)"
                >
                  {{ item.numSupervised }}
                </a>
                <a v-else-if="item.numSupervised === 0"> 0 </a>
              </template>
              <template v-slot:item.numExaminees="{ item }">
                <a
                  class="text-blue-500 cursor-pointer"
                  v-if="item.numExaminees > 0"
                  @click="opendialogExaminees(item)"
                >
                  {{ item.numExaminees }}
                </a>
                <a v-else-if="item.numExaminees === 0"> 0 </a>
              </template>
            </v-data-table>
          </div>
          <v-skeleton-loader
            v-else
            class="mw-auto border"
            type="table"
          ></v-skeleton-loader>
        </template>

        <!-- Dialog content -->
        <v-card>
          <!-- Content of your dialog goes here -->
          <v-card-title> <span class="text-h6">Students</span></v-card-title>
          <v-card-text v-show="!spinner && studentsInfo">
            <v-table class="border">
              <thead>
                <tr>
                  <th class="text-center text-base">No.</th>
                  <th class="text-center text-base">Name</th>
                  <th class="text-center text-base">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(student, index) in studentsInfo" :key="student">
                  <td class="text-center text-base">{{ index + 1 }}</td>
                  <td class="text-center text-base">{{ student.name }}</td>
                  <td class="text-center text-base">
                    {{ student.email }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-skeleton-loader
            v-show="spinner"
            class="border"
            type="heading, heading"
          ></v-skeleton-loader>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              variant="outlined"
              class="w-32"
              @click="closeDialog()"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-dialog v-model="dialogExaminees" width="800px">
      <v-card>
        <v-card-title>Examinees</v-card-title>
        <v-card-text v-show="!spinner && examineesInfo">
          <v-table class="border">
            <thead>
              <tr>
                <th class="text-center text-base">No.</th>
                <th class="text-center text-base">Name</th>
                <th class="text-center text-base">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(examinee, index) in examineesInfo" :key="examinee">
                <td class="text-center text-base">{{ index + 1 }}</td>
                <td class="text-center text-base">{{ examinee.name }}</td>
                <td class="text-center text-base">
                  {{ examinee.email }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-skeleton-loader
          v-show="spinner"
          class="border"
          type="heading, heading"
        ></v-skeleton-loader>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="warning"
            variant="outlined"
            class="w-32"
            @click="closeDialog()"
          >
            Close
          </v-btn></v-card-actions
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Constants
const search = ref("");
const userInfo = ref([]);
const isLoading = ref(false);
const dialog = ref(false);
const dialogExaminees = ref(false);
const studentsInfo = ref([]);
const examineesInfo = ref([]);
const spinner = ref(false);
const headers = ref([
  { align: "start", key: "num", sortable: true, title: "Num." },
  { key: "username", sortable: false, title: "Name" },
  { key: "email", sortable: false, title: "Email" },
  { key: "numSupervised", sortable: false, title: "Students" },
  { key: "numExaminees", sortable: false, title: "Examinees" },
  // Add other headers as needed
]);
const apiUrl = import.meta.env.VITE_API_URL;

// Functions
const openDialog = async (user) => {
  dialog.value = true;
  spinner.value = true;
  try {
    const userStudents = user.supervisedStudents;
    for (let i = 0; i < userStudents.length; i++) {
      // Get examiner details from userStudents array
      const response = await axios.get(`${apiUrl}/student/${userStudents[i]}`);
      // Push examiner details to examinersInfo array
      studentsInfo.value.push(response.data);
    }
    spinner.value = false;
  } catch (error) {
    console.error("Error fetching supervisor info:", error);
  }
};

const opendialogExaminees = async (user) => {
  dialogExaminees.value = true;
  spinner.value = true;
  try {
    // get user examiners array from storedUser data
    const userExaminees = user.examinees;
    // Loop through userExaminees array
    for (let i = 0; i < userExaminees.length; i++) {
      // Get examiner details from userExaminees array
      const response = await axios.get(`${apiUrl}/student/${userExaminees[i]}`);
      // Push examiner details to examineesInfo array
      examineesInfo.value.push(response.data);
    }
    spinner.value = false;
  } catch (error) {
    console.log(error);
  }
};

const closeDialog = () => {
  dialog.value = false;
  dialogExaminees.value = false;
  studentsInfo.value = [];
  examineesInfo.value = [];
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${apiUrl}/lecturers`);
    userInfo.value = response.data.map((lecturer, num) => ({
      ...lecturer,
      num: num + 1,
      numSupervised: lecturer.supervisedStudents.length,
      numExaminees: lecturer.examinees.length,
    }));
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching lecturers info:", error);
  }
});
</script>

<style lang="scss" scoped>
.title {
  font-family: "DM Sans", sans-serif;
}
.titleData,
.titleDes {
  font-family: "Work Sans", sans-serif;
}
</style>
