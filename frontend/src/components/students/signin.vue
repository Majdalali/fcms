<template>
  <div>
    <div>
      <v-form v-model="valid">
        <v-container>
          <v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" v-if="!validEmail">
              <v-alert dense outlined type="error">
                Invalid email format
              </v-alert>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :counter="20"
                label="Password"
                hide-details
                type="password"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" v-if="!validPassword">
              <v-alert dense outlined type="error">
                Invalid password format
              </v-alert>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                :disabled="!valid"
                color="primary"
                class="mr-4"
                @click="login"
              >
                Login
              </v-btn>
            </v-col>
          </v-col>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const valid = ref(false);
const email = ref("");
const validEmail = ref(true);
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
      // Redirect to another page or perform necessary actions upon successful login
      console.log("Login successful:");
      router.push("/");
    } else {
      // Handle failed login (display error message, etc.)
      console.error("Login failed:", response.data.error);
      // Reset form fields or handle error state as needed
    }
  } catch (error) {
    console.error("Login error:", error);
    // Handle error, e.g., display a generic error message to the user
  }
};
</script>

<style lang="scss" scoped></style>
