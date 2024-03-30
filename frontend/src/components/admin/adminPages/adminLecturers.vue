<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">List of Lecturers</h1>
      <p class="titleDes text-sm font-light">
        Track and manage all the lecturers in the system.
      </p>
    </div>
    <div class="md:w-4/5 pt-5 h-full">
      <v-card :rounded="0" :elevation="0">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          single-line
          :rounded="0"
          variant="outlined"
          hide-details
        ></v-text-field>
      </v-card>
      <v-data-table
        class="border"
        :headers="headers"
        :items="lecturers"
        :search="search"
      >
        <template v-slot:item.index="{ item }">
          <v-dialog v-model="item.dialog" width="1200">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" size="small" color="error">
                Delete
              </v-btn></template
            ><template v-slot:default=""
              ><v-card title="Warning!">
                <v-card-text class="mt-4">
                  <v-alert
                    v-show="alertText !== ''"
                    closable
                    class="mb-2 py-2 w-fit"
                    variant="outlined"
                    :text="alertText"
                    :type="alertType"
                  ></v-alert>
                  <h1 class="title">
                    Are you sure you want to <strong>delete</strong> this
                    account? This action is irreversible and will permanently
                    delete the account.
                  </h1>
                  <p class="titleDes text-red-400">
                    {{ item.username }} - {{ item.email }}
                  </p>
                </v-card-text>
                <v-card-actions class="my-2">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="warning"
                    variant="outlined"
                    class="w-32"
                    text="Cancel"
                    @click="closeDialog(item)"
                  ></v-btn>
                  <v-btn
                    color="error"
                    variant="elevated"
                    class="w-32"
                    @click="deleteLecturer(item.user_id)"
                    text="Delete"
                  ></v-btn>
                </v-card-actions> </v-card
            ></template>
          </v-dialog>
        </template>
        <template v-slot:item.isInvited="{ item }">
          <v-chip
            color="indigo-accent-4"
            v-if="item.isInvited"
            text="INVITED"
          ></v-chip>
        </template>
        <template v-slot:item.isCoordinator="{ item }">
          <v-chip
            color="orange"
            v-if="item.isCoordinator"
            text="COORDINATOR"
          ></v-chip>
        </template>
        <template v-slot:item.isAdmin="{ item }">
          <v-chip color="red" v-if="item.isAdmin" text="ADMIN"></v-chip>
        </template>
      </v-data-table>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Constants

const search = ref("");
const lecturers = ref([]);
const alertText = ref("");
const alertType = ref("error");
const apiUrl = import.meta.env.VITE_API_URL;
const isLoading = ref(false);
const snackbar = ref(false);
const responseMessage = ref("");

const headers = ref([
  { key: "username", sortable: false, title: "Name", width: "20%" },
  { key: "email", sortable: false, title: "Email", width: "20%" },
  { key: "createdAt", sortable: true, title: "Date Joined", width: "20%" },
  {
    key: "isInvited",
    sortable: true,
    title: "Invited by a Coordinator?",
    align: "center",
  },
  {
    key: "isCoordinator",
    sortable: true,
    title: "Coordinator?",
    align: "center",
  },
  { key: "isAdmin", sortable: true, title: "Admin?", align: "center" },
  { key: "index", sortable: false, title: "Action" },
]);

// Methods
onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${apiUrl}/lecturers`);
    lecturers.value = response.data.map((lecturer) => ({
      ...lecturer,
      createdAt: new Date(lecturer.createdAt).toLocaleDateString("en-UK", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});

// Delete Lecturer
const deleteLecturer = async (id) => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.delete(`${apiUrl}/api/lecturers/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.status === 200) {
      responseMessage.value = "Lecturer deleted successfully!";
      snackbar.value = true;
      alertText.value = "";
      lecturers.value = lecturers.value.filter(
        (lecturer) => lecturer.user_id !== id
      );
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      alertText.value = "Lecturer not found!";
    } else {
      alertText.value = "Error deleting lecturer! Please try again later.";
    }
  }
};

const closeDialog = (item) => {
  item.dialog = false;
  alertText.value = "";
};
</script>

<style lang="scss" scoped>
.title {
  font-family: "DM Sans", sans-serif;
}
.titleDes {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem /* 18px */;
  line-height: 1.75rem /* 28px */;
}
</style>
