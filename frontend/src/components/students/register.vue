<template>
  <v-app :theme="isDark ? 'dark' : 'light'" class="">
    <div>
      <h1 class="text-6xl">Registeration</h1>
    </div>
    <div>
      <v-form v-model="valid">
        <v-container>
          <v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="username"
                :rules="nameRules"
                label="Name"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="matricCard"
                :rules="matricCardRules"
                label="Matric Number"
                :counter="9"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="user_program"
                label="Program"
                required
                :items="currnetPrograms.programTypes"
                item-title="name"
                item-value="abbreviation"
              ></v-select>
              <h1>Selected Program abbre: {{ user_program }}</h1>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                :disabled="!valid"
                color="primary"
                class="mr-4"
                @click="register"
              >
                Sign Up
              </v-btn>
            </v-col>
            <span v-if="errorMessage" class="error-message">{{
              errorMessage
            }}</span>
          </v-col>
        </v-container></v-form
      >
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useDark } from "@vueuse/core";
const isDark = useDark();
const router = useRouter();
const errorMessage = ref("");
const valid = ref(false);
const username = ref("");
const email = ref("");
const password = ref("");
const matricCard = ref("");
const user_program = ref("");

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

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/programs");
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
    const response = await axios.post("http://localhost:8000/register", {
      username: username.value,
      email: email.value,
      password: password.value,
      matricCard: matricCard.value,
      user_program: user_program.value,
    });

    if (response.status === 200) {
      console.log("Registration successful!");
      errorMessage.value = "Registration successful!";

      router.push("/signin");
    } else {
      errorMessage.value =
        response.data.error || "Registration failed. Please try again later.";
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.error ||
      "Registration failed. Please try again later.";
  }
};
</script>

<style lang="scss" scoped></style>
