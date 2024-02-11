<template>
  <div class="mt-10">
    <div v-if="userInfo">
      <v-sheet
        border
        :height="75"
        class="md:w-4/5 rounded-lg"
        :elevation="2"
        :color="isDark ? '' : '#f5f5f5'"
      >
        <div class="h-full flex flex-row items-center">
          <h1 class="text-lg title font-bold flex-1 text-center">Name</h1>
          <h1
            v-if="userInfo.name !== null"
            class="text-lg font-Light titleDes flex-1"
          >
            {{ userInfo.name }}
          </h1>
          <h1 v-else class="text-lg font-Light titleDes flex-1">
            Not Selected Yet
          </h1>
        </div>
      </v-sheet>
      <v-sheet
        border
        :height="75"
        :elevation="2"
        class="md:w-4/5 mt-4 rounded-lg"
        :color="isDark ? '' : '#f5f5f5'"
      >
        <div class="h-full flex flex-row items-center">
          <h1 class="text-lg title font-bold flex-1 text-center">Email</h1>
          <h1
            v-if="userInfo.email !== null"
            class="text-lg font-Light titleDes flex-1"
          >
            {{ userInfo.email }}
          </h1>
          <h1 v-else class="text-lg font-Light titleDes flex-1">
            Not Selected Yet
          </h1>
        </div>
      </v-sheet>
    </div>
    <div class="mt-5 flex flex-col md:flex-row gap-5">
      <v-dialog v-model="dialog" persistent width="1024">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            size="large"
            variant="elevated"
            :color="isDark ? 'deep-purple-darken-4' : 'black'"
            :disabled="userInfo.name !== null"
            >Select Supervisor</v-btn
          >
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Select a Supervisor</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Supervisor Email*"
                    v-model="email"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
            <v-alert
              v-show="errorMessage"
              density="compact"
              class="w-fit"
              type="error"
              variant="outlined"
              >{{ errorMessage }}</v-alert
            >
          </v-card-text>

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
            <v-btn
              @click="assignSupervisor()"
              color="indigo"
              variant="elevated"
              class="w-32"
              :disabled="userInfo.name !== null"
            >
              Select
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRemove" persistent width="1024">
        <template v-slot:activator="{ props }">
          <v-btn
            size="large"
            variant="elevated"
            color="red-accent-3"
            v-bind="props"
            :disabled="userInfo.name == null"
            text="Remove Supervisor"
          ></v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Warning!</span>
          </v-card-title>
          <v-card-text>
            <h1 class="title">
              Are you sure you want to remove your supervisor?
            </h1>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              variant="outlined"
              class="w-32"
              @click="dialogRemove = false"
            >
              Close
            </v-btn>
            <v-btn
              @click="removeSupervisor()"
              color="red-accent-3"
              variant="elevated"
              :disabled="userInfo.name == null"
            >
              Remove Supervisor
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import { useDark } from "@vueuse/core";

// Constants
const isDark = useDark();
const dialog = ref(false);
const dialogRemove = ref(false);
const email = ref("");
const userInfo = ref({
  name: null,
  email: null,
});
const snackbar = ref(false);
const responseMessage = ref("");
const errorMessage = ref("");
const apiUrl = import.meta.env.VITE_API_URL;

// Functions
onMounted(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.user_id;
    const response = await axios.get(
      `${apiUrl}/getSupervisorDetails/${userId}`
    );
    userInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});

const assignSupervisor = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${apiUrl}/assignSupervisor`,
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

      // Assign supervisor details to userInfo
      userInfo.value.name = supervisorDetails.name;
      userInfo.value.email = supervisorDetails.email;
      dialog.value = false;
      snackbar.value = true;
      responseMessage.value = "Supervisor assigned successfully";
    }
  } catch (error) {
    if (
      (error.response && error.response.status === 400) ||
      error.response.status === 404
    ) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = "An error occurred. Please try again";
    }
  }
};

const removeSupervisor = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${apiUrl}/removeSupervisor/supervisor`,
      { lecturerEmail: userInfo.value.email },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      userInfo.value.name = null;
      userInfo.value.email = null;
      dialogRemove.value = false;
      snackbar.value = true;
      responseMessage.value = "Supervisor removed successfully";
    }
  } catch (error) {
    if (
      (error.response && error.response.status === 400) ||
      error.response.status === 404
    ) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = "An error occurred. Please try again";
    }
  }
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
