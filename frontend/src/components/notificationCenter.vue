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
            <h1 class="text-3xl font-medium title">Notifications Center</h1>
            <p class="text-base titleDes font-light">
              Stay Updated with Important Notices and announcements!
            </p>
          </div>
          <div v-if="notificationsInfo" class="lowerDiv pt-10 w-fit">
            <v-alert
              v-if="errorMessage"
              class="mb-4 py-2"
              type="error"
              variant="outlined"
              closable
              >{{ errorMessage }}</v-alert
            >
            <v-card
              v-for="(notification, index) in notificationsInfo"
              :key="index"
              color="indigo-lighten-5"
              class="rounded-lg vCard mt-2"
            >
              <template v-slot:text>
                <p class="title text-base font-medium mb-1">
                  <v-badge color="indigo" dot inline></v-badge>
                  {{ notification.message }}
                </p>
                <div class="w-full flex justify-between">
                  <div>
                    <v-chip
                      variant="flat"
                      :color="getCreatorChipColor(notification.creator)"
                      size="x-small"
                    >
                      <v-icon start icon="mdi-account"></v-icon>
                      {{ notification.creator }}
                    </v-chip>
                    <v-chip
                      class="ml-2"
                      variant="flat"
                      color="blue-grey"
                      size="x-small"
                    >
                      <v-icon start icon="mdi-alert-box-outline"></v-icon>
                      {{ notification.type }}
                    </v-chip>
                    <small class="ml-2 titleDes">
                      {{ notification.createdAt }}</small
                    >
                  </div>
                  <v-btn
                    size="small"
                    class="text-end"
                    variant="text"
                    @click="deleteNotification(notification.notificationId)"
                  >
                    <v-icon color="red" icon="mdi-delete"></v-icon>
                  </v-btn>
                </div>
              </template>
            </v-card>
          </div>
          <h1 v-if="notificationsInfo == ''" class="title text-amber-400">
            You don't have any notifications yet
          </h1>
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
import Navigation from "./navigation.vue";
import { useDark } from "@vueuse/core";
import { ref, onMounted } from "vue";
import axios from "axios";

// Constants
const isDark = useDark();
const notificationsInfo = ref([]);
const apiUrl = import.meta.env.VITE_API_URL;
const snackbar = ref(false);
const snackbarMessage = ref("");
const errorMessage = ref("");

// Functions

const deleteNotification = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.user_id;
    const response = await axios.post(
      `${apiUrl}/notification/${id}`,
      { userId: userId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status === 200) {
      notificationsInfo.value = notificationsInfo.value.filter(
        (notification) => notification.notificationId !== id
      );
      snackbarMessage.value = "Notification Deleted Successfully";
      snackbar.value = true;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = "Notification not found";
    } else {
      errorMessage.value = "An error occurred while deleting the notification";
    }
  }
};

onMounted(async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${apiUrl}/myNotifications`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.status === 200) {
      notificationsInfo.value = response.data.map((notification) => ({
        ...notification,
        createdAt: formatDate(notification.createdAt),
      }));
    } else if (response.status === 204) {
      notificationsInfo.value = [];
    } else {
      errorMessage.value = "An error occurred while fetching notifications";
    }
  } catch (error) {
    errorMessage.value = "An error occurred while fetching notifications";
  }
});
const getCreatorChipColor = (creator) => {
  // Assign chip colors based on creator type
  switch (creator) {
    case "Coordinator":
      return "pink"; // Assign chip color for coordinator
    case "Student":
      return "primary"; // Assign chip color for student
    case "Supervisor":
      return "indigo"; // Assign chip color for supervisor
    case "Examiner":
      return "brown"; // Assign chip color for examiner
    default:
      return "grey"; // Default chip color
  }
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-UK", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }); // Format the date as per the locale
};
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
.tempDiv {
  background-color: #fdfefb !important;
}
.tempDiv-dark {
  background-color: #0d0d0d !important;
}
.vCard:nth-child(1) {
  margin-top: 0px !important;
}
</style>
