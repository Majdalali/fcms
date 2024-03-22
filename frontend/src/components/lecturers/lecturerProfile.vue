<template>
  <v-app
    :theme="isDark ? 'dark' : 'light'"
    :class="isDark ? 'tempDiv-dark' : 'tempDiv'"
  >
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="2" sm="0" class="nav sm:mb-5">
          <Navigation />
        </v-col>
        <v-col
          cols="12"
          md="12"
          lg="10"
          style="min-width: 70%; max-width: 100%"
          class="main"
        >
          <div class="pt-4 upperDiv">
            <h1 class="text-3xl font-medium title">Personal Profile</h1>
            <p v-if="userInfo" class="text-lg titleDes font-light">
              Hi {{ userInfo.username }}!
            </p>
          </div>
          <div class="middleDiv pt-10">
            <div v-if="userInfo">
              <v-sheet
                border
                class="lg:w-[90%] drop-shadow-lg p-5 rounded-lg h-80 md:h-[200px]"
              >
                <div class="flex flex-row items-center h-full md:pl-20">
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
                      <v-chip
                        text="Admin"
                        size="small"
                        label
                        color="red"
                        class="mt-2"
                        v-show="userInfo.isAdmin"
                      ></v-chip>
                      <v-chip
                        text="Coordinator"
                        size="small"
                        label
                        color="primary"
                        v-show="userInfo.isCoordinator"
                        class="ml-2 mt-2"
                      ></v-chip>
                    </div>
                    <div class="flex flex-col md:flex-row mt-2">
                      <v-tooltip location="bottom" text="Email">
                        <template v-slot:activator="{ props }">
                          <p v-bind="props" class="text-lg font-light para">
                            <v-icon class="mr-2"><Email /></v-icon
                            >{{ userInfo.email }}
                          </p>
                        </template>
                      </v-tooltip>
                      <v-tooltip location="bottom" text="Program">
                        <template v-slot:activator="{ props }">
                          <p
                            v-bind="props"
                            class="text-lg md:pl-10 uppercase font-light para"
                          >
                            <v-icon class="mr-2"><Flag /></v-icon
                            >{{ userInfo.coordinator_program }}
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
                          <span class="text-h5">Edit Profile</span>
                        </v-card-title>
                        <v-card-text>
                          <v-alert
                            v-if="errorMessage"
                            type="error"
                            variant="outlined"
                            closable
                            >{{ errorMessage }}</v-alert
                          >
                          <v-container>
                            <v-row>
                              <v-col cols="12" md="6">
                                <small class="titleDes">Name</small>
                                <v-text-field
                                  v-model="username"
                                  :placeholder="userInfo.username"
                                  :rules="nameRules"
                                  variant="outlined"
                                  required
                                ></v-text-field> </v-col
                              ><v-col cols="12" md="6">
                                <small class="titleDes"
                                  >Coordinator Program</small
                                >
                                <v-text-field
                                  v-model="program"
                                  :placeholder="userInfo.coordinator_program"
                                  :rules="nameRules"
                                  variant="outlined"
                                  hint="Please select the program that you are coordinating"
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
              <p
                v-if="userInfo.coordinator_program == null || ''"
                class="mt-2 text-sm text-orange-300 title"
              >
                Please choose your program if you are a coordinator by clicking
                <strong>Edit Profile</strong>
              </p>
            </div>

            <v-skeleton-loader
              v-else
              class="w-4/5 border"
              type="card"
            ></v-skeleton-loader>
          </div>
          <div class="lowerDiv pt-10"></div>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      :timeout="2000"
      color="indigo"
      variant="elevated"
      v-model="snackbar"
    >
      {{ snackbarMessage }}

      <template v-slot:actions>
        <v-btn color="white" variant="transparent" @click="snackbar = false">
          X
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useDark } from "@vueuse/core";
import axios from "axios";
import Navigation from "../navigation.vue";

// Icons
import Flag from "@/assets/icons/flag.vue";
import Email from "@/assets/icons/email.vue";

// Constants
const isDark = useDark();
const dialog = ref(false);
const userInfo = ref(null);

const username = ref("");
const program = ref("");
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
    program.value !== userInfo.value.coordinator_program ||
    email.value !== userInfo.value.email ||
    password.value !== "" ||
    passwordConfirmation.value !== ""
  );
});
const errorMessage = ref("");
const snackbar = ref(false);
const snackbarMessage = ref("");
const apiUrl = import.meta.env.VITE_API_URL;

// Functions

const editProfile = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const requestData = {
      username: username.value,
      email: email.value,
      coordinator_program: program.value,
    };

    if (password.value !== "" || passwordConfirmation.value !== "") {
      requestData.password = password.value;
    }
    const response = await axios.post(
      `${apiUrl}/updateLecturerDetails`,
      requestData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status === 200) {
      snackbarMessage.value = "Profile Updated Successfully";
      snackbar.value = true;
      userInfo.value.username = username.value;
      userInfo.value.email = email.value;
      userInfo.value.coordinator_program = program.value;
      await localStorage.setItem("user", JSON.stringify(userInfo.value));
      dialog.value = false;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = "User not found";
    } else {
      errorMessage.value = error.response.data.message;
      console.log("Error: ", error);
    }
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
    // delay to show the skeleton loader
    const response = await axios.get(`${apiUrl}/lecturer/${userId}`);
    userInfo.value = { ...response.data };

    // Set the values of the form
    username.value = response.data.username;
    email.value = response.data.email;
    program.value = response.data.coordinator_program;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1488px) {
  .nav {
    max-width: 1%;
  }
  .main {
    min-width: 100% !important;
  }
}
@media screen and (max-width: 639px) {
  .main {
    margin-top: 20px !important;
  }
}

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
