<template>
  <div class="mt-10">
    <div v-if="userInfo">
      <v-sheet
        border
        :height="75"
        class="w-1/2 rounded-lg"
        :elevation="2"
        :color="isDark ? '' : '#f5f5f5'"
      >
        <div class="h-full flex flex-row items-center">
          <h1 class="text-lg title font-bold absolute left-10">Name</h1>
          <h1 class="text-lg font-Light titleDes absolute left-[20%]">
            {{ userInfo.name }}
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
            {{ userInfo.email }}
          </h1>
        </div>
      </v-sheet>
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
              :disabled="userInfo.name !== 'Not Selected Yet'"
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
                :disabled="userInfo.name !== 'Not Selected Yet'"
              >
                Select
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
const dialog = ref(false);
const email = ref("");
const userInfo = ref({
  name: "Not Selected Yet",
  email: "Not Selected Yet",
});
// Functions
onMounted(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.user_id;
    const response = await axios.get(
      `http://localhost:8000/getSupervisorDetails/${userId}`
    ); // Replace with your API endpoint
    userInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
});

const assignSupervisor = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      "http://localhost:8000/assignSupervisor",
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
    }
  } catch (error) {
    console.error("Error assigning a supervisor:", error);
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