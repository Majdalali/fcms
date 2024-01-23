<template>
  <v-app :theme="isDark ? 'dark' : 'light'" class="max-w-screen">
    <v-table v-if="userInfo">
      <thead>
        <tr>
          <th class="text-left">id</th>
          <th class="text-left">Name</th>
          <th class="text-left">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in userInfo" :key="user.user_id">
          <td>{{ user.user_id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </v-table>
    <template v-else>
      <v-progress-linear indeterminate></v-progress-linear>
    </template>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";
const isDark = useDark();
const userInfo = ref(null);
const apiUrl = import.meta.env.VITE_API_URL;

onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl}:8000/users`); // Replace with your API endpoint
    userInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});
</script>

<style lang="scss" scoped></style>
