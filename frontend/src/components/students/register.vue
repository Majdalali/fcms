<template>
  <v-app
    :theme="isDark ? 'dark' : 'light'"
    :class="isDark ? 'tempDiv-dark' : 'tempDiv'"
  >
    <div class="parent flex flex-row w-screen h-screen">
      <div class="left w-full 2xl:w-1/2 flex flex-row items-center">
        <v-form class="w-full" v-model="valid">
          <v-container>
            <v-row class="justify-center">
              <v-col class="pb-5" cols="12" lg="8" md="12" sm="11">
                <v-img
                  :width="300"
                  aspect-ratio="16/9"
                  cover
                  :src="isDark ? UTMLogoBlack : UTMLogo"
                  class="mb-10"
                ></v-img>
                <h1 class="text-4xl w-max font-bold title">Create account</h1>
                <p class="text-lg w-max font-light titleDes">
                  Already have an account ?
                  <router-link to="/signin"
                    ><span
                      class="font-normal pb-[1px] border-b-2 border-b-[#FAC000]"
                      >Sign in</span
                    ></router-link
                  >
                </p>
              </v-col>
              <v-col class="py-0" cols="12" lg="8" md="6" sm="11">
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
              <v-col class="py-0" cols="12" lg="8" md="6" sm="11">
                <span class="inputText">Matric Number</span>
                <v-text-field
                  v-model="matricCard"
                  class="mt-1"
                  :rules="matricCardRules"
                  :counter="9"
                  variant="outlined"
                  placeholder="Enter your matric number"
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
                <v-select
                  v-model="user_program"
                  label="Program"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Program is required']"
                  required
                  :items="currnetPrograms.programTypes"
                  item-title="name"
                  item-value="abbreviation"
                ></v-select>
              </v-col>
              <v-col cols="12" lg="8" md="12" sm="11">
                <v-btn
                  width="100%"
                  height="50px"
                  :disabled="!valid"
                  color="#800000"
                  class="mr-4 inputText"
                  @click="register"
                >
                  {{
                    responseMessage == ""
                      ? "Sign Up"
                      : "Registration successful!"
                  }}
                </v-btn>
              </v-col>
              <v-col cols="12" lg="8" md="12" sm="11">
                <span class="title text-center text-[#800000]">
                  {{ errorMessage }}
                </span></v-col
              >
            </v-row></v-container
          >
        </v-form>
      </div>
      <div class="right 2xl:block w-1/2 hidden h-screen bg-[#880000]">
        <v-img cover :src="RegisterBG"></v-img>
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
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useDark } from "@vueuse/core";
import RegisterBG from "@/assets/images/registerBG.svg";
import UTMLogo from "@/assets/images/utmLogo.png";
import UTMLogoBlack from "@/assets/images/utmLogoBlack.png";

// Constants
const isDark = useDark();
const router = useRouter();
const errorMessage = ref("");
const valid = ref(false);
const username = ref("");
const email = ref("");
const password = ref("");
const matricCard = ref("");
const user_program = ref("");
const visiblePass = ref(false);
const snackbar = ref(false);
const responseMessage = ref("");

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
    if (value.length >= 3) {
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

const matricCardRules = [
  (value) => {
    if (value) return true;
    return "Matric Number is required.";
  },
  (value) => {
    if (value.length == 9) {
      return true;
    } else {
      return "Matric Number must be 9 characters.";
    }
  },
];

const currnetPrograms = ref({});
const apiUrl = import.meta.env.VITE_API_URL;

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

const register = async () => {
  try {
    const response = await axios.post(`${apiUrl}/students`, {
      username: username.value,
      email: email.value.toLowerCase(),
      password: password.value,
      matricCard: matricCard.value,
      user_program: user_program.value,
    });

    if (response.status === 200) {
      responseMessage.value = response.data.message;
      snackbar.value = true;

      router.push("/signin");
    } else {
      errorMessage.value =
        response.data.error || "Registration failed. Please try again later.";
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
.tempDiv {
  background-color: #fdfefb !important;
}
.tempDiv-dark {
  background-color: #0d0d0d !important;
}
.title {
  font-family: "DM Sans", sans-serif;
}
.titleDes {
  font-family: "Work Sans", sans-serif;
}
// media under 600px
@media (max-width: 600px) {
  .parent {
    flex-direction: column;
  }
  .left {
    width: 100%;
    padding-left: 2%;
    padding-right: 2%;
  }
  .right {
    display: none;
  }
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
.orSpan {
  display: flex;
  align-items: center;
}
.orSpanBlack {
  display: flex;
  align-items: center;
}
.orSpan::before,
.orSpan::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  margin: 0 15px;
}
.orSpanBlack::before,
.orSpanBlack::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin: 0 15px;
}
.google {
  font-size: 18px;
  font-family: "Work Sans", sans-serif;
  color: #463c84;
}
</style>
