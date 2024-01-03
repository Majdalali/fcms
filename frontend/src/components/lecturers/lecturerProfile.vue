<template>
  <v-app
    :theme="isDark ? 'dark' : 'light'"
    :class="isDark ? 'tempDiv-dark' : 'tempDiv'"
  >
    <v-container fluid>
      <v-row>
        <v-col cols="2">
          <Navigation />
        </v-col>
        <v-col cols="10" class="main">
          <div class="pt-4 upperDiv">
            <h1 class="text-3xl font-medium title">Personal Profile</h1>
            <p v-if="userInfo" class="text-lg titleDes font-light">
              Hi {{ userInfo.username }}!
            </p>
          </div>
          <div class="middleDiv pt-10">
            <div v-if="userInfo">
              <v-sheet
                :height="200"
                border
                class="w-[90%] drop-shadow-lg p-10 rounded-lg"
              >
                <div class="flex flex-row items-center h-full pl-20">
                  <v-avatar
                    :text="getInitials(userInfo.username)"
                    color="#9C3D3D"
                    class="text-3xl title"
                    size="100"
                  ></v-avatar>
                  <div class="flex flex-col pl-5">
                    <div>
                      <h1 class="text-2xl capitalize font-bold title">
                        {{ userInfo.username }}
                      </h1>
                    </div>
                    <div class="flex flex-row">
                      <v-tooltip location="bottom" text="Email">
                        <template v-slot:activator="{ props }">
                          <p v-bind="props" class="text-lg font-light para">
                            <v-icon class="mr-2"><Email /></v-icon
                            >{{ userInfo.email }}
                          </p>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
                <div class="absolute right-5 bottom-5">
                  <v-dialog v-model="dialog" persistent width="1024">
                    <template v-slot:activator="{ props }">
                      <v-btn color="primary" v-bind="props" size="large"
                        >Edit Profile</v-btn
                      >
                    </template>
                    <v-form v-model="valid">
                      <v-card>
                        <v-card-title>
                          <span class="text-h5">User Profile</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12">
                                <small class="titleDes">Name</small>
                                <v-text-field
                                  v-model="username"
                                  :placeholder="userInfo.username"
                                  :rules="nameRules"
                                  variant="outlined"
                                  hide-details
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <small class="titleDes">Email</small>
                                <v-text-field
                                  v-model="email"
                                  variant="outlined"
                                  :placeholder="userInfo.email"
                                  :rules="emailRules"
                                  hide-details
                                  required
                                ></v-text-field>
                              </v-col>
                              <!-- <v-col cols="12">
                                  <v-text-field
                                    v-model="password"
                                    :rules="passwordRules"
                                    variant="outlined"
                                    label="Password"
                                    type="password"
                                    hide-details
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-text-field
                                    label="Re-enter Password"
                                    type="password"
                                    variant="outlined"
                                    v-model="passwordConfirmation"
                                    :rules="passwordConfirmationRules"
                                    :required="passwordRules"
                                    hide-details
                                  ></v-text-field>
                                </v-col> -->
                            </v-row>
                          </v-container>
                          <small
                            >*Please only update your details if there was a
                            mistake at registration!</small
                          >
                          <span v-if="responseMessage" class="">{{
                            responseMessage
                          }}</span>
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
                            color="indigo"
                            variant="elevated"
                            class="w-32"
                            :disabled="!isFormChanged || !valid"
                            @click="editProfile()"
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-form>
                  </v-dialog>
                </div>
              </v-sheet>
            </div>

            <v-progress-circular v-else indeterminate></v-progress-circular>
          </div>
          <div class="lowerDiv pt-10"></div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useDark } from "@vueuse/core";
import axios from "axios";
import Navigation from "../navigation.vue";

// Icons
import Email from "@/assets/icons/email.vue";

// Constants
const isDark = useDark();
const dialog = ref(false);
const userInfo = ref(null);

const username = ref("");
const email = ref("");
const password = ref("");
const isPasswordEdited = computed(() => {
  return password.value !== "" || passwordConfirmation.value !== "";
});

const passwordConfirmation = ref("");
const valid = ref(false);
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
    if (isPasswordEdited.value && value) return true;
    if (!isPasswordEdited.value) return true;
    return "Password is required.";
  },
  (value) => {
    if (value.length >= 3 || !isPasswordEdited.value) {
      return true;
    } else {
      return "Password must be at least 8 characters.";
    }
  },
];
const passwordConfirmationRules = [
  (value) => {
    if (isPasswordEdited.value && value === password.value) return true;
    if (!isPasswordEdited.value) return true;
    return "Password must match.";
  },
];
const nameRules = [
  (value) => {
    if (value) return true;
    return "Name is required.";
  },
  (value) => {
    if (value.length >= 3) {
      return true;
    } else {
      return "Name must be at least 3 characters.";
    }
  },
];

const isFormChanged = computed(() => {
  return (
    username.value !== userInfo.value.username ||
    email.value !== userInfo.value.email ||
    password.value !== "" ||
    passwordConfirmation.value !== ""
  );
});
const responseMessage = ref("");

// Functions

const editProfile = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const requestData = {
      username: username.value,
      email: email.value,
    };

    if (password.value !== "" || passwordConfirmation.value !== "") {
      requestData.password = password.value;
    }
    const response = await axios.post(
      "http://localhost:8000/updateLecturerDetails",
      requestData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status === 200) {
      console.log("The student details has been updated!");
      responseMessage.value = "The student details has been updated!";
      location.reload();
    } else {
      responseMessage.value =
        response.data.error || "Process failed. Please try again later.";
    }
  } catch (error) {
    responseMessage.value =
      error.response?.data?.error || "Process failed. Please try again later.";
  }
};

const getInitials = (username) => {
  const names = username.split(" ");
  return names
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();
};
onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser.user_id;

  try {
    const response = await axios.get(
      `http://localhost:8000/lecturer/${userId}`
    );
    userInfo.value = { ...response.data };
    // Set the values of the form
    username.value = response.data.username;
    email.value = response.data.email;
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
});
</script>

<style lang="scss" scoped>
.title,
.titleDes {
  font-family: "DM Sans", sans-serif;
}
.para {
  font-family: "Work Sans", sans-serif;
}
.tempDiv {
  background-color: #fdfefb !important;
}
.tempDiv-dark {
  background-color: #0d0d0d !important;
}
.v-tab {
  text-transform: capitalize;
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  font-size: 18px;
}
.v-tab:first-child {
  text-align: start !important;
  padding-left: 0%;
}
</style>