<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">Your Chairman Application</h1>
      <p class="titleDes text-base font-light">
        Here you can view the application from your chairman and the final
        decision
      </p>
    </div>
    <div class="pt-10 h-full">
      <div v-if="!isLoading">
        <div v-if="!isEmpty">
          <v-data-table
            class="mt-5"
            :headers="appsHeaders"
            :items="studentChairmanApp"
          >
            <template v-slot:item.chairmanAppDecision="{ item }">
              {{ item.chairmanAppDecision.toUpperCase() }}
            </template>

            <template v-slot:item.docs="{ item }">
              <v-menu v-if="item.chairmanAppSupportingDocuments.length > 0">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" v-bind="props"> View files </v-btn>
                </template>
                <v-list>
                  <a
                    v-for="(item, index) in item.chairmanAppSupportingDocuments"
                    :key="index"
                    :href="`${apiUrl}/files/${item}`"
                    target="_blank"
                    class="text-indigo-500"
                  >
                    <v-list-item class="text-center" link>
                      {{ index + 1 }}
                    </v-list-item>
                  </a>
                </v-list>
              </v-menu>
              <v-btn v-else variant="text" text="Not Provided"></v-btn>
            </template>
            <!-- Delete table footer -->
            <template #bottom></template>
          </v-data-table>
        </div>
        <v-alert
          v-else
          type="secondary"
          variant="outlined"
          border="left"
          elevation="0"
          icon="mdi-information"
          text="There is no application from your chairman yet. Please check back later"
        >
        </v-alert>
      </div>
      <v-skeleton-loader v-if="isLoading" type="table"> </v-skeleton-loader>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";

const props = defineProps({
  projectType: String,
});

const isDark = useDark();
const isEmpty = ref(false);
const isLoading = ref(false);
const studentChairmanApp = ref([]);
const apiUrl = import.meta.env.VITE_API_URL;

const appsHeaders = ref([
  { key: "studentName", sortable: false, title: "Student" },
  { key: "matricNumber", sortable: false, title: "Matric No." },
  { key: "createdAt", sortable: true, title: "Date" },
  { key: "chairmanAppDecision", sortable: false, title: "Chairman Decision" },
  { key: "chairmanId", sortable: true, title: "Chairman" },
  { key: "docs", sortable: false, title: "Comments" },
]);

onMounted(async () => {
  isLoading.value = true;
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.get(`${apiUrl}/api/student/chairmanApp`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      studentChairmanApp.value.push(
        ...response.data.map((item) => {
          return {
            ...item,
            createdAt: formatDate(item.createdAt),
          };
        })
      );
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
    } else {
      console.log("An error occurred. Please try again later.");
    }
  }
  isLoading.value = false;
});

const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }); // Format the date as per the locale
};

const getText = (grade) => {
  switch (grade) {
    case "a":
      return "No correction";
    case "b1":
      return "One month correction";
    case "b2":
      return "Three months correction";
    case "c1":
      return "Six months correction";
    case "c2":
      return "Six months correction and Re-Presentation";
    default:
      return ""; // Or any default message you want to show if grade is not matched
  }
};

const openDialog = (item) => {
  item.dialog = true;
};

// Function to close the dialog and reset selectedItem
const closeDialog = (item) => {
  item.dialog = false;
};
</script>

<style lang="scss" scoped>
.titleDes,
.title {
  font-family: "DM Sans", sans-serif;
}
.expantionPanel:first-child {
  margin-top: 0px !important;
}
.commentContent {
  font-family: "Source Sans Pro", sans-serif;
}
</style>
