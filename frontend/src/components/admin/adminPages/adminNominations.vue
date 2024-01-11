<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">Nominations</h1>
      <p class="titleDes text-sm font-light">
        The nominations made by the lecturers
      </p>
    </div>
    <div class="w-4/5 pt-10 h-full">
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
        :items="nominations"
        :search="search"
      >
        <template v-slot:item.index="{ item }">
          <v-btn @click="openDialog(item)" size="small" color="primary">
            Details
          </v-btn>
          <v-dialog v-model="item.dialog" width="1200">
            <v-card title="Nomination Details">
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
                            <th class="text-left">Registered?</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="coSupervisor in item.coSupervisors">
                            <td>{{ coSupervisor.name }}</td>
                            <td>{{ coSupervisor.email }}</td>
                            <td>{{ coSupervisor.phoneNumber }}</td>
                            <td>
                              <v-chip
                                color="green"
                                text-color="white"
                                v-if="coSupervisor.coSupervisorsExist"
                                >Yes</v-chip
                              >
                              <v-chip color="error" text-color="white" v-else
                                >No</v-chip
                              >
                            </td>
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
                            <th class="text-left">Registered?</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="inExaminer in item.internalExaminers">
                            <td>{{ inExaminer.name }}</td>
                            <td>{{ inExaminer.email }}</td>
                            <td>{{ inExaminer.phoneNumber }}</td>
                            <td>
                              <v-chip
                                color="green"
                                text-color="white"
                                v-if="inExaminer.internalExaminersExist"
                                >Yes</v-chip
                              >
                              <v-chip color="error" text-color="white" v-else
                                >No</v-chip
                              >
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
                            <th class="text-left">Registered?</th>
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
                              <v-chip
                                color="green"
                                text-color="white"
                                v-if="exExaminer.externalExaminersExist"
                                >Yes</v-chip
                              >
                              <v-chip color="error" text-color="white" v-else
                                >No</v-chip
                              >
                            </td>
                          </tr>
                        </tbody></v-table
                      ></v-expansion-panel-text
                    >
                  </v-expansion-panel>
                </v-expansion-panels>

                <h1 class="mt-10">Examiners: {{ item.examinersIds }}</h1>
                <h1>{{ item.student.userId }}</h1>
                <small v-if="item.status === 'done'" class="text-green-500"
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
                <v-btn
                  variant="elevated"
                  color="deep-purple-darken-4"
                  text="Assign Examiners"
                  class="px-4"
                  @click="
                    AssignExaminers(item.student.userId, item.examinersIds)
                  "
                  :disabled="item.status === 'done'"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            class="w-24 justify-center"
            color="success"
            v-if="item.status === 'done'"
            >DONE</v-chip
          >
          <v-chip class="w-24 justify-center" color="warning" v-else
            >PENDING</v-chip
          >
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Constants

const headers = ref([
  { key: "nominationId", sortable: true, title: "ID." },
  {
    key: "supervisorName",
    sortable: true,
    title: "Submitted By",
    width: "25%",
  },
  { key: "student.name", sortable: false, title: "Student", width: "25%" },
  {
    key: "createdAt",
    sortable: false,
    title: "Submitted On",
    width: "25%",
    align: "center",
  },
  {
    key: "status",
    sortable: true,
    title: "Status",
    width: "20%",
    align: "center",
  },
  { key: "index", sortable: false, title: "Actions", align: "center" },
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

const search = ref("");
const nominations = ref([]);

// Methods
onMounted(async () => {
  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.get("http://localhost:8000/api/nominations", {
      headers: {
        Authorization: token,
      },
    });
    nominations.value = response.data.map((nomination) => {
      const internalExaminersIds = nomination.internalExaminers
        .filter(
          (examiner) =>
            examiner.userId !== undefined && examiner.userId !== null
        )
        .map((examiner) => examiner.userId);

      const externalExaminersIds = nomination.externalExaminers
        .filter(
          (examiner) =>
            examiner.userId !== undefined && examiner.userId !== null
        )
        .map((examiner) => examiner.userId);

      const allExaminersIds = [
        ...internalExaminersIds,
        ...externalExaminersIds,
      ];

      return {
        ...nomination,
        createdAt: formatDate(nomination.createdAt),
        examinersIds: allExaminersIds,
      };
    });
  } catch (error) {
    console.error("Error fetching proposal files:", error);
    // Handle error
  }
});

const AssignExaminers = async (studentId, examinersIds) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `http://localhost:8000/api/assignExaminers/${studentId}`,
      {
        examinerId: examinersIds,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status === 200) {
      console.log(response.data.message);
    }
  } catch (error) {
    console.error("Error: ", error);
  }
};

// format date
const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

// Function to open the dialog and set selectedItem
const openDialog = (item) => {
  item.dialog = true;
};

// Function to close the dialog and reset selectedItem
const closeDialog = (item) => {
  item.dialog = false;
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
