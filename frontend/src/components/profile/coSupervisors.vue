<template>
  <div class="mt-10">
    <div class="w-1/2">
      <!-- <v-sheet
        border
        :height="75"
        class="w-1/2 mt-4 rounded-lg"
        :elevation="2"
        :color="isDark ? '' : '#f5f5f5'"
      >
        <div class="h-full flex flex-row items-center">
          <h1 class="text-lg title font-bold absolute left-10">Name</h1>
          <h1 class="text-lg font-Light titleDes absolute left-[20%]">
            {{ user.name }}
          </h1>
        </div>
      </v-sheet>
      <v-sheet
        border
        :height="75"
        :elevation="2"
        class="w-1/2 mt-4 rounded-lg"
        :color="isDark ? '' : '#f5f5f5'"
      >
        <div class="h-full flex flex-row items-center">
          <h1 class="text-lg title absolute left-10 font-bold">Email</h1>
          <h1 class="text-lg font-Light titleDes absolute left-[20%]">
            {{ user.email }}
          </h1>
        </div>
      </v-sheet> -->
      <v-data-table-virtual
        class="border w-1/2"
        :headers="headers"
        :items="userInfo"
      >
      </v-data-table-virtual>
    </div>
    <div class="w-1/2 mt-5">
      <div>
        <v-dialog v-model="dialog" persistent width="1024">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="large"
              variant="elevated"
              :color="isDark ? 'deep-purple-darken-4' : 'black'"
              >Add Co-Supervisor</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Add a Co-Supervisor</span>
            </v-card-title>
            <v-form v-model="valid">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Co-Supervisor Email*"
                        v-model="email"
                        :rules="emailRules"
                        required
                      ></v-text-field>
                      <v-alert
                        v-show="errorMessage"
                        density="compact"
                        class="w-fit"
                        type="error"
                        variant="outlined"
                        >{{ errorMessage }}</v-alert
                      >
                    </v-col>
                  </v-row>
                </v-container>

                <small>*Only add the assigned co-supervisors to you.</small>
              </v-card-text>
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
                <v-btn
                  color="indigo"
                  variant="elevated"
                  class="w-32"
                  @click="addCoSupervisor()"
                  :disabled="!valid"
                >
                  Add
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-snackbar
          :timeout="2000"
          color="indigo"
          variant="elevated"
          v-model="snackbar"
        >
          {{ responseMessage }}

          <template v-slot:actions>
            <v-btn
              color="white"
              variant="transparent"
              @click="snackbar = false"
            >
              X
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";

// Constants
const isDark = useDark();
const snackbar = ref(false);
const responseMessage = ref("");
const errorMessage = ref("");
const dialog = ref(false);
const email = ref("");
const valid = ref(false);
const userInfo = ref([]);
const emailRules = [
  (v) => !!v || "Email is required",
  (v) => /.+@.+\..+/.test(v) || "Email must be valid",
];
const headers = ref([
  { key: "name", sortable: false, title: "Name" },
  { key: "email", sortable: false, title: "Email" },
]);
// Functions
onMounted(async () => {
  try {
    // Get user from local storage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (
      storedUser &&
      storedUser.coSupervisors &&
      Array.isArray(storedUser.coSupervisors)
    ) {
      const userCoSupervisors = storedUser.coSupervisors;
      // Loop through userCoSupervisors array
      for (let i = 0; i < userCoSupervisors.length; i++) {
        // Get supervisor details from userCoSupervisors array
        const response = await axios.get(
          `http://localhost:8000/getCoSuperVisorsDetails/${userCoSupervisors[i]}`
        );
        // Push supervisor details to userInfo array
        userInfo.value.push(response.data);
      }
    } else {
      console.error(
        "Invalid or missing coSupervisedStudents array in storedUser:",
        storedUser
      );
    }
  } catch (error) {
    console.error("Error fetching supervisor details:", error);
  }
});

const addCoSupervisor = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      "http://localhost:8000/udateCoSupervisors",
      {
        email: email.value,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      const supervisorDetails = response.data.supervisorDetails;

      // Assign co supervisor details to userInfo
      userInfo.value.push(supervisorDetails);
      snackbar.value = true;
      responseMessage.value = "Co-Supervisor added successfully";
      email.value = "";
      dialog.value = false;
    }
  } catch (error) {
    if (error.response.status === 404) {
      errorMessage.value = "Supervisor wasn't found, please check the email!";
    } else if (error.response.status === 400) {
      errorMessage.value = "Lecturer already assigned as co-supervisor!";
    } else {
      errorMessage.value = "System error, please try again later.";
    }
    console.error("Error assigning a supervisor:", error);
  }
};
const closeDialog = () => {
  dialog.value = false;
  errorMessage.value = "";
  email.value = "";
};
</script>

<style lang="scss" scoped>
.title {
  font-family: "DM Sans", sans-serif;
}
.titleDes {
  font-family: "Work Sans", sans-serif;
}
</style>
