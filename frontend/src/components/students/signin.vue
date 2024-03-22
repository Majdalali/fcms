<template>
  <v-app
    :theme="isDark ? 'dark' : 'light'"
    :class="isDark ? 'tempDiv-dark' : 'tempDiv'"
  >
    <div class="parent flex flex-row w-screen h-screen">
      <div class="left w-full 2xl:w-1/2 flex flex-row items-center">
        <v-form class="w-full" v-model="valid">
          <v-container>
            <v-row class="justify-center items-center">
              <v-col cols="12" lg="8" md="12" sm="11">
                <v-img
                  :width="300"
                  aspect-ratio="16/9"
                  cover
                  :src="isDark ? UTMLogoBlack : UTMLogo"
                  class="mb-10"
                ></v-img>
                <h1 class="text-4xl font-bold title">Welcome back !</h1>
                <p class="text-lg font-light titleDes">
                  Don’t have an account ?
                  <router-link to="/register"
                    ><span
                      class="font-normal pb-[1px] border-b-2 border-b-[#FAC000]"
                      >Register Here</span
                    ></router-link
                  >
                </p>
              </v-col>
              <v-col cols="12" lg="8" md="12" sm="11">
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

              <v-col cols="12" lg="8" md="12" sm="11">
                <span class="inputText">Password</span>
                <v-text-field
                  v-model="password"
                  class="mt-1"
                  :rules="passwordRules"
                  :counter="20"
                  placeholder="*********"
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
                  @click="login"
                >
                  {{ responseMessage == "" ? "Sign In" : "Welcome back!" }}
                </v-btn>
              </v-col>
              <v-col cols="12" lg="8" md="12" sm="11">
                <span class="title text-center text-[#800000]">
                  {{ errorMessage }}
                </span></v-col
              >
            </v-row>
          </v-container>
        </v-form>
      </div>
      <div class="right 2xl:block w-1/2 hidden h-screen bg-[#880000]">
        <v-img cover :src="SignInBg"></v-img>
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
import { ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useDark } from "@vueuse/core";
import SignInBg from "@/assets/images/signinBG.svg";
import UTMLogo from "@/assets/images/utmLogo.png";
import UTMLogoBlack from "@/assets/images/utmLogoBlack.png";

// Constants
const apiUrl = import.meta.env.VITE_API_URL;
const router = useRouter();
const isDark = useDark();
const store = useStore();
const valid = ref(false);
const snackbar = ref(false);
const responseMessage = ref("");
const email = ref("");
const validEmail = ref(true);
const visiblePass = ref(false);
const emailRules = [
  (value) => {
    if (value) return true;
    return "E-mail is required.";
  },
  (value) => {
    if (/.+@.+\..+/.test(value)) {
      validEmail.value = true;
      return true;
    } else {
      validEmail.value = false;
      return "E-mail must be valid.";
    }
  },
];
const password = ref("");
const validPassword = ref(true);
const passwordRules = [
  (value) => {
    if (value) return true;
    return "Password is required.";
  },
  (value) => {
    if (value.length >= 3) {
      validPassword.value = true;
      return true;
    } else {
      validPassword.value = false;
      return "Password must be at least 8 characters.";
    }
  },
];
const errorMessage = ref("");

const login = async () => {
  try {
    const response = await axios.post(
      `${apiUrl}/login`,
      {
        email: email.value.toLowerCase(),
        password: password.value,
      },
      {
        withCredentials: true, // Ensure credentials are sent
      }
    );

    if (response.status === 200) {
      store.dispatch("loginUser", {
        user: response.data.user,
        access_token: response.data.token,
      });
      const userId = response.data.user.user_id;
      localStorage.setItem("user_id", userId);
      store.dispatch("connectSocket", userId);
      errorMessage.value = "";
      responseMessage.value = "Sign in successful";
      snackbar.value = true;
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/home");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = "Invalid email or password";
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
