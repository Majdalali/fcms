<template>
  <div>
    <div class="pt-5 lg:w-4/5">
      <v-divider class="mb-5"></v-divider>

      <h1 class="title text-lg font-medium">Previous Nominations</h1>
      <p class="titleDes mb-5 text-sm font-light">View your nominations</p>

      <v-data-table class="border" :headers="headers" :items="nominations">
        <template v-slot:item.details="{ item }">
          <v-dialog v-model="item.dialog" width="1200">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" size="small" color="primary" text="Details">
              </v-btn>
            </template>
            <template v-slot:default=""
              ><v-card title="Nomination Details">
                <v-card-text class="mt-4">
                  <v-expansion-panels color="grey-lighten-1">
                    <!--! STUDENT DETAILS -->
                    <v-expansion-panel title="Student Details">
                      <v-expansion-panel-text>
                        <v-data-table
                          class="border"
                          :headers="headersStudent"
                          :items="[
                            {
                              name: item.student.name,
                              matricNumber: item.student.matricNumber,
                              email: item.student.email,
                              utmEmail: item.student.utmEmail,
                              phoneNumber: item.student.phoneNumber,
                              studentExists: item.student.studentExists,
                            },
                          ]"
                          ><template #bottom></template>
                          <template v-slot:item.studentExists>
                            <v-chip
                              color="green"
                              v-if="item.student.studentExists"
                              >Yes</v-chip
                            >
                            <v-chip color="error" v-else>No</v-chip>
                          </template></v-data-table
                        >
                        <h1 class="title mt-5 mb-2">Dissertation Title</h1>
                        <v-sheet
                          class="p-4 rounded-t-lg"
                          elevation="4"
                          color="amber-lighten-4"
                        >
                          <h1>{{ item.student.dissertationTitle }}</h1>
                        </v-sheet>
                        <h1 class="title mt-5 mb-2">Dissertation Title</h1>
                        <v-sheet
                          class="p-4 rounded-t-lg"
                          elevation="4"
                          color="amber-lighten-4"
                        >
                          <h1>{{ item.student.dissertationAbstract }}</h1>
                        </v-sheet>
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <!--! CO SUPERVISOR DETAILS -->
                    <v-expansion-panel
                      class="my-2"
                      title="Co Supervisors Details"
                    >
                      <v-expansion-panel-text>
                        <v-table class="border mt-2">
                          <thead>
                            <tr>
                              <th class="text-left">Name</th>
                              <th class="text-left">Email</th>
                              <th class="text-left">Phone Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="coSupervisor in item.coSupervisors">
                              <td>{{ coSupervisor.name }}</td>
                              <td>{{ coSupervisor.email }}</td>
                              <td>{{ coSupervisor.phoneNumber }}</td>
                            </tr>
                          </tbody></v-table
                        >
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <!--! INTERNAL EXAMINERS DETAILS -->
                    <v-expansion-panel title="Internal Examiners Details">
                      <v-expansion-panel-text>
                        <v-table class="border mt-2">
                          <thead>
                            <tr>
                              <th class="text-left">Name</th>
                              <th class="text-left">Email</th>
                              <th class="text-left">Phone Number</th>
                              <th class="text-left">CV File</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="inExaminer in item.internalExaminers">
                              <td>{{ inExaminer.name }}</td>
                              <td>{{ inExaminer.email }}</td>
                              <td>{{ inExaminer.phoneNumber }}</td>

                              <td>
                                <a
                                  :href="`${apiUrl}/files/${inExaminer.cvFileId}`"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  v-if="inExaminer.cvFileId !== undefined"
                                >
                                  <span class="text-blue-200"> Open</span>
                                </a>
                                <h1 v-else class="title">
                                  <span class="text-red-500">No file</span>
                                </h1>
                              </td>
                            </tr>
                          </tbody></v-table
                        >
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <!--! EXTERNAL EXAMINERS DETAILS -->
                    <v-expansion-panel
                      class="my-2"
                      title="External Examiners Details"
                    >
                      <v-expansion-panel-text
                        ><v-table class="border mt-2">
                          <thead>
                            <tr>
                              <th class="text-left">Name</th>
                              <th class="text-left">Email</th>
                              <th class="text-left">Phone Number</th>
                              <th class="text-left">Institution</th>
                              <th class="text-left">Expertise</th>
                              <th class="text-left">CV File</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="exExaminer in item.externalExaminers">
                              <td>{{ exExaminer.name }}</td>
                              <td>{{ exExaminer.email }}</td>
                              <td>{{ exExaminer.phoneNumber }}</td>
                              <td>{{ exExaminer.institution }}</td>
                              <td>{{ exExaminer.expertise }}</td>

                              <td>
                                <a
                                  :href="`${apiUrl}/files/${exExaminer.cvFileId}`"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  v-if="exExaminer.cvFileId !== undefined"
                                >
                                  <span class="text-blue-200"> Open</span>
                                </a>
                                <h1 v-else class="title">
                                  <span class="text-red-500">No file</span>
                                </h1>
                              </td>
                            </tr>
                          </tbody></v-table
                        ></v-expansion-panel-text
                      >
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <small
                    v-if="item.status === 'done'"
                    class="mt-4 text-green-500"
                    >Examiners has beeen assigned to student
                    {{ item.student.name }}</small
                  >
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
                </v-card-actions> </v-card
            ></template>
          </v-dialog>
        </template>
        <template v-slot:item.delete="{ item }">
          <v-dialog width="500">
            <template v-slot:activator="{ props }">
              <v-btn v-bind:="props" size="small" color="error"> Delete </v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="Warning!">
                <v-card-text class="title">
                  Are you sure you want to delete this nomination?
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
                  <v-btn
                    color="error"
                    @click="deleteNomination(item.nominationId)"
                  >
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
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
const nominations = ref([]);
const snackbar = ref(false);
const responseMessage = ref("");
const headers = ref([
  { key: "nominationId", sortable: true, title: "ID." },
  { key: "student.name", sortable: false, title: "Student" },
  {
    key: "createdAt",
    sortable: false,
    title: "Submitted On",
    align: "center",
  },
  { key: "details", sortable: false, title: "Actions", align: "center" },
  { key: "delete", sortable: false, title: "Delete" },
]);

const headersStudent = ref([
  { key: "name", sortable: false, title: "Name", width: "20%" },
  { key: "matricNumber", sortable: false, title: "Matric No.", width: "13%" },
  { key: "email", sortable: false, title: "Email", width: "20%" },
  { key: "utmEmail", sortable: false, title: "UTM Email", width: "20%" },
  { key: "phoneNumber", sortable: false, title: "Phone Number" },
  {
    key: "studentExists",
    sortable: false,
    title: "Registered?",
  },
]);

const apiUrl = import.meta.env.VITE_API_URL;

// Functions

onMounted(async () => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.get(
      `${apiUrl}/myNominations`,

      {
        headers: {
          Authorization: token,
        },
      }
    );
    nominations.value = response.data.map((nomination) => {
      return {
        ...nomination,
        createdAt: formatDate(nomination.createdAt),
      };
    });
  } catch (error) {
    console.log(error);
  }
});

const deleteNomination = async (nominationId) => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.delete(
      `${apiUrl}/nominations/${nominationId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    responseMessage.value = response.data.message;
    snackbar.value = true;
    nominations.value = nominations.value.filter(
      (nomination) => nomination.nominationId !== nominationId
    );
  } catch (error) {
    if (error.response && error.response.status === 404) {
      snackbar.value = true;
      responseMessage.value = error.response.data.error;
    } else {
      snackbar.value = true;
      responseMessage.value =
        "Error deleting evaluatio. Please try again later";
    }
  }
};

const openDialog = (item) => {
  item.dialog = true;
};

const closeDialog = (item) => {
  item.dialog = false;
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
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
.formText {
  font-family: "Work Sans", sans-serif;
}
</style>
