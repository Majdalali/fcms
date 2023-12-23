<template>
  <v-app
    :theme="isDark ? 'dark' : 'light'"
    :class="isDark ? 'tempDiv-dark' : 'tempDiv'"
  >
    <div class="parent flex flex-row w-screen max-h-screen">
      <div class="left w-1/2">
        <v-form class="w-full ml-24 mt-24" v-model="valid">
          <v-container>
            <v-col>
              <v-col cols="12" lg="12">
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
              <v-col cols="12" lg="8">
                <span class="inputText">Email</span>
                <v-text-field
                  v-model="email"
                  class="mt-1"
                  :rules="emailRules"
                  variant="outlined"
                  hide-details
                  placeholder="Enter your email address or matric number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="8" v-if="!validEmail">
                <v-alert dense outlined type="error">
                  Invalid email format
                </v-alert>
              </v-col>
              <v-col cols="12" lg="8">
                <span class="inputText">Password</span>
                <v-text-field
                  v-model="password"
                  class="mt-1"
                  :rules="passwordRules"
                  :counter="20"
                  placeholder="Enter your password"
                  variant="outlined"
                  hide-details
                  :type="visiblePass ? 'text' : 'password'"
                  :append-inner-icon="visiblePass ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="visiblePass = !visiblePass"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="8" v-if="!validPassword">
                <v-alert dense outlined type="error">
                  Invalid password format
                </v-alert>
              </v-col>
              <v-col cols="12" lg="8">
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
              <v-col cols="12" lg="8">
                <span
                  :class="
                    isDark
                      ? 'titleDes  orSpanBlack text-base '
                      : 'titleDes  orSpan text-base '
                  "
                  >OR</span
                >
              </v-col>
              <v-col cols="12" lg="8" class="text-center mt-2">
                <v-btn
                  width="100%"
                  height="50px"
                  variant="outlined"
                  class="google"
                  >Sign Up with Google</v-btn
                >
              </v-col>
            </v-col>
          </v-container>
        </v-form>
      </div>
      <div class="right w-1/2 h-screen bg-[#880000]">
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
const router = useRouter();
const isDark = useDark();
const store = useStore();
const valid = ref(false);
const snackbar = ref(false);
const responseMessage = ref("");
const delay = new Promise((resolve) => setTimeout(resolve, 3000));
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

const login = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8000/login",
      {
        email: email.value,
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
      responseMessage.value = "Sign in successful";
      snackbar.value = true;
      await delay;
      router.push("/dashboard");
    } else {
      // Handle failed login (display error message, etc.)
      console.error("Sign in failed:", response.data.error);
      // Reset form fields or handle error state as needed
    }
  } catch (error) {
    console.error("Sign in error:", error);
    // Handle error, e.g., display a generic error message to the user
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
