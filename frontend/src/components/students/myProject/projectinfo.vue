<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">Project Information</h1>
      <p class="titleDes text-base font-light">
        Check the home page for deadlines
      </p>
    </div>
    <!-- Project Information -->
    <v-alert
      v-show="isProjectInfoEmpty"
      text="Please update your project information"
      type="warning"
      variant="outlined"
      closable
      class="mt-10 lg:w-4/5 uppercase text-bold"
    ></v-alert>
    <v-alert
      v-show="alertText !== ''"
      closable
      class="mt-10 lg:w-4/5 uppercase text-bold"
      variant="outlined"
      :text="alertText"
      :type="alertType"
    ></v-alert>
    <div v-show="!editMode" class="pt-10 h-full xl:w-4/5">
      <div v-if="userInfo">
        <v-card
          v-for="(value, key) in projectInfo"
          :key="key"
          :title="getTitle(key)"
          :color="isDark ? '' : '#f5f5f5'"
          :elevation="2"
          class="card title p-10 rounded-lg h-max"
        >
          <v-card-text class="text-gray-300">
            {{ userInfo.projectInfo[key] }}
          </v-card-text>
        </v-card>

        <v-btn
          class="w-56 mt-5"
          variant="elevated"
          color="deep-purple-darken-4"
          size="large"
          @click="toggleEditMode"
          >Edit Project</v-btn
        >
      </div>
      <template v-else>
        <v-skeleton-loader
          :elevation="4"
          type="list-item-avatar"
        ></v-skeleton-loader>
        <v-skeleton-loader
          :elevation="4"
          type="list-item-avatar"
          class="mt-5"
        ></v-skeleton-loader>
        <v-skeleton-loader
          class="mt-5"
          :elevation="4"
          type="list-item-avatar"
        ></v-skeleton-loader>
      </template>
    </div>
    <!-- Edit Project -->
    <div v-show="editMode" class="pt-10 h-full">
      <v-form v-model="valid">
        <v-text-field
          required
          v-model="projectTitle"
          variant="outlined"
          :rules="rules"
          label="Project Title"
          hint="Enter your project title"
        ></v-text-field>
        <v-text-field
          required
          v-model="projectArea"
          variant="outlined"
          :rules="rules"
          label="Project Area"
          hint="e.g. web development, mobile development, etc."
          class="mt-4"
        ></v-text-field>
        <v-text-field
          required
          v-model="projectType"
          variant="outlined"
          :rules="rules"
          label="Project Type"
          hint="e.g. research, development, etc."
          class="mt-4"
        ></v-text-field>

        <div class="mt-5 flex flex-col sm:flex-row gap-5">
          <v-btn
            class="w-56"
            variant="flat"
            color="blue-darken-4"
            size="large"
            :disabled="!isFormChanged || !valid"
            @click="updateProjectInfo"
            >Submit</v-btn
          >
          <v-btn
            class="w-56"
            variant="outlined"
            color="warning"
            size="large"
            @click="cancelEdit"
            >Cancel</v-btn
          >
        </div>
      </v-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";

// Constants
const isDark = useDark();
const projectTitle = ref("");
const projectArea = ref("");
const projectType = ref("");
const editMode = ref(false);
const valid = ref(false);
const userInfo = ref(null);
const projectInfo = ref({
  projectTitle: "",
  projectArea: "",
  projectType: "",
});
const rules = [
  (value) => {
    if (!value) return "Field can't be empty.";
    if (!isNaN(value)) return "Field can't contain only digits.";
    return true;
  },
];
const alertText = ref("");
const alertType = ref("warning");
const apiUrl = import.meta.env.VITE_API_URL;

// functions
const getTitle = (key) => {
  switch (key) {
    case "projectTitle":
      return "Project Title";
    case "projectArea":
      return "Project Area";
    case "projectType":
      return "Project Type";
    default:
      return key;
  }
};

const isFormChanged = computed(() => {
  return (
    projectTitle.value !== userInfo.value?.projectInfo?.projectTitle ||
    projectArea.value !== userInfo.value?.projectInfo?.projectArea ||
    projectType.value !== userInfo.value?.projectInfo?.projectType
  );
});

const toggleEditMode = () => {
  editMode.value = true;
};

const cancelEdit = () => {
  editMode.value = false;
};

onMounted(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.user_id;
    const response = await axios.get(`${apiUrl}/user/${userId}`); // Replace with your API endpoint
    userInfo.value = response.data;
    // Set default values for input fields
    projectTitle.value = userInfo.value?.projectInfo?.projectTitle || "";
    projectArea.value = userInfo.value?.projectInfo?.projectArea || "";
    projectType.value = userInfo.value?.projectInfo?.projectType || "";
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
});

const isProjectInfoEmpty = computed(() => {
  return (
    userInfo.value && Object.keys(userInfo.value.projectInfo || {}).length === 0
  );
});

const updateProjectInfo = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const updatedProjectInfo = {
      projectTitle: projectTitle.value,
      projectArea: projectArea.value,
      projectType: projectType.value,
    };

    const response = await axios.post(
      `${apiUrl}/updateProjectInfo`,
      { projectInfo: updatedProjectInfo },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      // Update userInfo with the values from the input fields
      userInfo.value = {
        ...userInfo.value,
        projectInfo: updatedProjectInfo,
      };
      editMode.value = false; // Hide the edit mode after successful update

      // Display success alert
      alertText.value = response.data.message;
      alertType.value = "success";
    } else {
      // Handle error cases or display an error message
      console.error("Error updating project info:", response.data);

      // Display error alert
      alertText.value = response.data.error;
      alertType.value = "error";
    }
  } catch (error) {
    console.error("Error updating project info:", error);
    editMode.value = false;
    alertText.value = error.message;
    alertType.value = "error";
    // Handle error, display an error message, or redirect if needed
  }
};
</script>

<style lang="scss" scoped>
.title {
  font-family: "DM Sans", sans-serif;
}
.titleDes {
  font-family: "Work Sans", sans-serif;
}
.cardValue {
  font-family: "Source Sans Pro", sans-serif;
}
.card {
  width: 100%;
}
.card:nth-child(2),
.card:nth-child(3) {
  margin-top: 20px;
}
.card :deep(.v-card-subtitle) {
  font-weight: 500;
}
</style>
