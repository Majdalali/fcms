<template>
  <div class="mt-10">
    <div class="w-1/2">
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
          <v-card title="Add a Co-Supervisor">
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
                  Cancel
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
const apiUrl = import.meta.env.VITE_API_URL;

// Functions
onMounted(async () => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.get(`${apiUrl}/myCoSupervisors`, {
      headers: { Authorization: token },
    });

    // Push supervisor details to userInfo array
    userInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching supervisor details:", error);
  }
});

const addCoSupervisor = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${apiUrl}/udateCoSupervisors`,
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
    if (
      (error.response && error.response.status === 400) ||
      error.response.status === 404
    ) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = "An error occurred. Please try again";
      console.log("Error adding co-supervisor:", error);
    }
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
