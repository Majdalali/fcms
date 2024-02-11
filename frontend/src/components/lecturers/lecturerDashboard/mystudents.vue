<template>
  <div class="mt-10">
    <div>
      <h1 class="title text-lg font-medium">Your Students List</h1>
    </div>
    <div class="lg:w-4/5 mt-5">
      <div v-if="!emptyStudents">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          single-line
          :rounded="0"
          variant="outlined"
          hide-details
        ></v-text-field>
        <v-data-table
          class="border"
          v-show="!emptyStudents"
          :headers="headers"
          :items="students"
          :search="search"
        >
          <template v-slot:item.username="{ item }">
            {{ item.username }}
            <v-chip
              v-if="item.coSupervised"
              class="ml-2"
              variant="flat"
              color="indigo"
              size="x-small"
            >
              Co-supervised
            </v-chip>
          </template>
          <template v-slot:item.projectInfo="{ item }">
            <v-btn
              @click="openDialog(item)"
              size="small"
              :color="
                Object.keys(item.projectInfo).length > 0 ? 'info' : 'warning'
              "
            >
              Details
            </v-btn>
            <v-dialog v-model="item.dialog" width="1000">
              <v-card>
                <v-card-text class="mt-4">
                  <h1 class="title mb-2">Project Details</h1>
                  <v-table
                    v-if="Object.keys(item.projectInfo).length > 0"
                    class="border"
                  >
                    <thead>
                      <tr>
                        <th class="text-center text-base">Project</th>
                        <th class="text-center text-base">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="text-center titleDes">Title</td>
                        <td class="text-center titleDes py-2">
                          {{ item.projectInfo.projectTitle }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-center titleDes">Type</td>
                        <td class="text-center titleDes">
                          {{ item.projectInfo.projectType }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-center titleDes">Area</td>
                        <td class="text-center titleDes">
                          {{ item.projectInfo.projectArea }}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <v-alert v-else type="info" variant="outlined" class="my-4"
                    ><strong>{{ item.username }}</strong> hasn't updated their
                    project information yet</v-alert
                  >
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="warning"
                    variant="outlined"
                    class="w-32"
                    text="Cancel"
                    @click="closeDialog(item)"
                  ></v-btn>
                </v-card-actions> </v-card></v-dialog
          ></template>
        </v-data-table>
      </div>
      <v-alert
        v-else
        type="info"
        variant="outlined"
        class="my-4"
        text="You haven't been assigned any students yet"
      ></v-alert>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useDark } from "@vueuse/core";

// Constants

const isDark = useDark();
const supervisedStudents = ref([]);
const coSupervisedStudents = ref([]);
const emptyStudents = ref(false);
const students = ref([]);
const search = ref("");
const headers = ref([
  { key: "username", title: "Name" },
  { key: "email", title: "Email" },
  { key: "matricCard", title: "Matric No." },
  { key: "program", title: "Program" },
  { key: "projectInfo", title: "Project Details" },
]);
const apiUrl = import.meta.env.VITE_API_URL;

// Functions
onMounted(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.user_id;
    const response = await axios.get(`${apiUrl}/lecturer/mystudents/${userId}`); // Replace with your API endpoint
    supervisedStudents.value = response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.user_id;
    const response = await axios.get(
      `${apiUrl}/lecturer/myCoSupervisedStudents/${userId}`
    ); // Replace with your API endpoint

    coSupervisedStudents.value = response.data.map((student) => {
      return {
        ...student,
        coSupervised: true,
      };
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
  students.value.push(
    ...supervisedStudents.value,
    ...coSupervisedStudents.value
  );
  if (students.value.length === 0) {
    emptyStudents.value = true;
  }
});

const openDialog = (item) => {
  item.dialog = true;
};

const closeDialog = (item) => {
  item.dialog = false;
};
</script>

<style lang="scss" scoped>
.title {
  font-family: "DM Sans", sans-serif;
  font-weight: 400;
  font-size: 1.125rem /* 18px */;
  line-height: 1.75rem /* 28px */;
}
.titleDes {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem /* 18px */;
  line-height: 1.75rem /* 28px */;
}
</style>
