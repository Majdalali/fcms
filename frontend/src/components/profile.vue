<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="2">
          <Navigation />
        </v-col>
        <v-col cols="10">
          <div v-if="userInfo" class="profile-section">
            <h1 class="text-4xl">Hi {{ userInfo.username }}</h1>
            <p class="text-xl">This is your profile page</p>
            <p class="text-xl">Email: {{ userInfo.email }}</p>
            <p class="text-xl">Matric Card: {{ userInfo.matricCard }}</p>
          </div>
          <v-progress-circular v-else indeterminate></v-progress-circular>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Navigation from "./navigation.vue";

const userInfo = ref(null);

onMounted(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.user_id;
    const response = await axios.get(`http://localhost:8000/user/${userId}`); // Replace with your API endpoint
    userInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
});
</script>
