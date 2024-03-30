<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">External Examiners Invites</h1>
      <p class="titleDes text-sm font-light">
        Here you can create accounts for external examiners to be registered
        into the system
      </p>
    </div>
    <div class="md:w-4/5 pt-10 h-full">
      <div>
        <v-form class="w-full" ref="inviteForm" v-model="valid">
          <v-row>
            <v-col class="py-0" cols="12" lg="8" md="12" sm="11">
              <span class="inputText">Name</span>
              <v-text-field
                v-model="username"
                class="mt-1"
                :rules="nameRules"
                variant="outlined"
                placeholder="Enter your full name"
                required
              ></v-text-field>
            </v-col>

            <v-col class="py-0" cols="12" lg="8" md="12" sm="11">
              <span class="inputText">Email</span>
              <v-text-field
                v-model="email"
                class="mt-1"
                :rules="emailRules"
                variant="outlined"
                placeholder="Enter your email address"
                required
              ></v-text-field>
            </v-col>

            <v-col class="py-0" cols="12" lg="8" md="12" sm="11">
              <span class="inputText">Password</span>
              <v-text-field
                v-model="password"
                class="mt-1"
                :rules="passwordRules"
                :counter="20"
                placeholder="Enter your password"
                variant="outlined"
                :type="visiblePass ? 'text' : 'password'"
                :append-inner-icon="visiblePass ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="visiblePass = !visiblePass"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" lg="8" md="12" sm="11">
              <v-btn
                width="100%"
                height="50px"
                :disabled="!valid"
                color="#800000"
                class="mr-4 inputText"
                @click="inviteExaminer"
              >
                {{ responseMessage == "" ? "Sign Up" : "Account Created!" }}
                <span v-if="isLoading" class="ml-2"
                  ><v-progress-circular
                    :size="22"
                    indeterminate
                  ></v-progress-circular
                ></span>
              </v-btn>
            </v-col>
            <v-col cols="12" lg="8" md="12" sm="11">
              <span class="title text-center text-[#800000]">
                {{ errorMessage }}
              </span></v-col
            >
          </v-row>
        </v-form>
      </div>
      <v-divider></v-divider>
      <div class="pt-10">
        <div class="pb-5">
          <h1 class="title text-lg font-medium">List of invited Examiners</h1>
        </div>
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
          :items="lecturers"
          :search="search"
        >
        </v-data-table>
      </div>
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

const headers = ref([
  { key: "username", sortable: false, title: "Name" },
  { key: "email", sortable: false, title: "Email" },
  { key: "invitedBy", sortable: false, title: "Invited By" },
]);

const apiUrl = import.meta.env.VITE_API_URL;
const search = ref("");
const inviteForm = ref(null);
const lecturers = ref([]);
const errorMessage = ref("");
const responseMessage = ref("");
const visiblePass = ref(false);
const username = ref("");
const email = ref("");
const password = ref("");
const valid = ref(false);
const isLoading = ref(false);
const snackbar = ref(false);
const emailRules = [
  (value) => {
    if (value) return true;
    return "E-mail is required.";
  },
  (value) => {
    if (/.+@.+\..+/.test(value)) {
      return true;
    } else {
      return "E-mail must be valid.";
    }
  },
];

const passwordRules = [
  (value) => {
    if (value) return true;
    return "Password is required.";
  },
  (value) => {
    if (value.length >= 8) {
      return true;
    } else {
      return "Password must be at least 8 characters.";
    }
  },
];

const nameRules = [
  (value) =>
    (value && value.length >= 5 && /^[a-zA-Z\s]*$/.test(value)) ||
    "Name must be at least 5 characters with no numbers or symbols.",
];

// Methods
onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl}/lecturers`);
    lecturers.value = response.data.filter((lecturer) => lecturer.isInvited);
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});

const inviteExaminer = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user.email;
  try {
    isLoading.value = true;
    const response = await axios.post(`${apiUrl}/lecturer/register`, {
      username: username.value,
      email: email.value.toLowerCase(),
      password: password.value,
      isInvited: true,
      invitedBy: userEmail,
    });

    if (response.status === 200) {
      responseMessage.value = response.data.message;
      snackbar.value = true;
      lecturers.value.push(response.data.user);
      inviteForm.value.reset();
      isLoading.value = false;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      responseMessage.value = "";
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = "An error occurred. Please try again later.";
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
  font-size: 1rem /* 18px */;
  line-height: 1.75rem /* 28px */;
}
.inputText {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 1.25rem /* 20px */;
  line-height: 1.85rem /* 28px */;
}
.inputText::after {
  content: " *";
  color: #800000;
}
</style>
