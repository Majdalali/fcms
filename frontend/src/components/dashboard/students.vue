<template>
  <div>
    <div class="pt-10 mb-5">
      <h1 class="title text-xl font-medium">Students</h1>
      <p class="titleDes text-base font-light">List of registered students</p>
    </div>
    <div class="w-[90%]">
      <v-dialog v-model="dialog" max-width="800px">
        <template v-slot:activator="{ on }">
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
            <template v-slot:item.index="{ item }">
              <a
                class="text-blue-500 cursor-pointer"
                v-if="item.index === 1"
                @click="openDialog(item)"
              >
                1
              </a>
              <a v-else-if="item.index === 0"> 0 </a>
            </template>
            <template v-slot:item.indexTwo="{ item }">
              <a
                class="text-blue-500 cursor-pointer"
                v-if="item.indexTwo > 0"
                @click="openDialogExaminers(item)"
              >
                {{ item.indexTwo }}
              </a>
              <a v-else-if="item.indexTwo === 0"> 0 </a>
            </template>
          </v-data-table>
        </template>

        <!-- Dialog content -->
        <v-card>
          <!-- Content of your dialog goes here -->
          <v-card-title> <span class="text-h6">Supervisor</span></v-card-title>
          <v-card-text v-show="!spinner && supervisorInfo">
            <v-table class="border">
              <thead>
                <tr>
                  <th class="text-center text-base">Name</th>
                  <th class="text-center text-base">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center text-base">
                    {{ supervisorInfo.name }}
                  </td>
                  <td class="text-center text-base">
                    {{ supervisorInfo.email }}
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
              @click="dialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-dialog v-model="dialogExaminers" width="800px">
      <v-card>
        <v-card-title>Student Examiners</v-card-title>
        <v-card-text v-show="!spinner && examinersInfo">
          <v-table class="border">
            <thead>
              <tr>
                <th class="text-center text-base">No.</th>
                <th class="text-center text-base">Name</th>
                <th class="text-center text-base">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(examiner, index) in examinersInfo" :key="examiner">
                <td class="text-center text-base">{{ index + 1 }}</td>
                <td class="text-center text-base">{{ examiner.name }}</td>
                <td class="text-center text-base">
                  {{ examiner.email }}
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
            @click="closeDialogExaminers()"
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
const dialog = ref(false);
const dialogExaminers = ref(false);
const supervisorInfo = ref({});
const examinersInfo = ref([]);
const spinner = ref(false);
const headers = ref([
  { align: "start", key: "num", sortable: true, title: "Num." },
  { key: "username", sortable: false, title: "Name" },
  { key: "email", sortable: false, title: "Email" },
  { key: "user_program", sortable: true, title: "Program Code" },
  { key: "index", sortable: false, title: "Supervisor" },
  { key: "indexTwo", sortable: false, title: "Examiners" },
  // Add other headers as needed
]);

// Functions

const openDialog = async (user) => {
  dialog.value = true;
  spinner.value = true;
  try {
    const response = await axios.get(
      `http://localhost:8000/getSupervisorDetails/${user.user_id}`
    );
    supervisorInfo.value = response.data;
    spinner.value = false;
  } catch (error) {
    console.error("Error fetching supervisor info:", error);
  }
};

const openDialogExaminers = async (user) => {
  dialogExaminers.value = true;
  spinner.value = true;
  try {
    // get user examiners array from storedUser data
    const userExaminers = user.examiners;
    // Loop through userExaminers array
    for (let i = 0; i < userExaminers.length; i++) {
      // Get examiner details from userExaminers array
      const response = await axios.get(
        `http://localhost:8000/getExaminersDetails/${userExaminers[i]}`
      );
      // Push examiner details to examinersInfo array
      examinersInfo.value.push(response.data);
    }
    spinner.value = false;
  } catch (error) {
    console.log(error);
  }
};

const closeDialogExaminers = () => {
  dialogExaminers.value = false;
  examinersInfo.value = [];
};

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8000/users`);
    userInfo.value = response.data.map((user, num) => ({
      ...user,
      num: num + 1,
      index: user.supervisor ? 1 : 0,
      indexTwo: user.examiners.length,
    }));
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});
</script>

<style lang="scss" scoped>
.title,
.titleDes {
  font-family: "DM Sans", sans-serif;
}
.titleData {
  font-family: "Work Sans", sans-serif;
}
</style>
