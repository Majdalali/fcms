<template>
  <div>
    <div class="pt-4">
      <v-divider class="w-4/5 mb-5"></v-divider>

      <h1 class="title text-lg font-medium">Criterias</h1>
      <p class="titleDes text-sm font-light">Create and edit criterias</p>
    </div>
    <div class="w-4/5 pt-5 h-full">
      <v-alert
        v-show="errorMessage !== ''"
        closable
        class="mb-2 py-2"
        variant="flat"
        :text="errorMessage"
        type="error"
      ></v-alert>
      <v-form ref="criteriaForm" v-model="valid">
        <small class="text-orange-500 font-semibold"
          >*The default program selected matches your current program. You can
          change it. However, changing the program will affect the criteria
          associated with it.</small
        >

        <v-row class="mt-1">
          <v-col cols="12" md="7">
            <v-text-field
              v-model="criteriaName"
              :rules="nameRules"
              label="Criteria Name"
              hint="e.g. Masters of Cyber Security Criteria"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <!-- <v-text-field
              :rules="nameRules"
              label="Criteria Program"
              hint="e.g. MECC, MCSD, etc."
            ></v-text-field> -->
            <v-select
              v-model="criteriaProgram"
              label="Criteria Program"
              required
              :items="props.programsData.programTypes"
              item-title="abbreviation"
              item-value="abbreviation"
              :item-props="itemProps"
            ></v-select>
          </v-col>
          <v-col cols="12"> </v-col>
        </v-row>
        <div
          class="pt-2"
          v-for="(criteriasObject, index) in criteriasObjects"
          :key="index"
        >
          <small class="titleDes">Criteria {{ index + 1 }}</small>
          <v-row class="mt-1">
            <v-col cols="12" md="7">
              <v-text-field
                v-model="criteriasObject.name"
                :rules="nameRules"
                label="Evaluation Criteria"
                hint="e.g. Project Managment Progress 1, Project Performance, etc."
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                :rules="gradeRules"
                v-model="criteriasObject.outOf"
                label="Out Of"
                hint="Total marks for this criteria"
              ></v-text-field
            ></v-col>
            <v-col cols="12" md="1" class="mt-1">
              <v-btn
                size="large"
                color="success"
                v-if="index === 0"
                @click="addEntry(criteriasObjects, { name: '', outOf: '' })"
                ><v-icon icon="mdi-plus-circle"></v-icon
              ></v-btn>
              <v-btn
                size="large"
                v-else
                color="error"
                @click="removeEntry(criteriasObjects, index)"
                ><v-icon icon="mdi-delete"></v-icon
              ></v-btn>
            </v-col>
          </v-row>
        </div>
        <v-btn
          size="large"
          variant="elevated"
          color="deep-purple-darken-4"
          @click="submitCriteria()"
          :disabled="!valid"
          >Submit Criteria</v-btn
        >
      </v-form>
    </div>
    <div class="w-4/5 pt-5 h-full">
      <v-divider class="mb-5"></v-divider>
      <h1 class="title text-lg mb-5 font-medium">Current Existing Criterias</h1>

      <v-data-table :headers="headers" :items="criteriaData">
        <template v-slot:item.criteriasObjects="{ item }">
          <v-btn @click="openDialog(item)" size="small" color="primary">
            Details
          </v-btn>
          <v-dialog v-model="item.dialog" width="800">
            <v-card>
              <v-card-text class="mt-4">
                <h1 class="title mb-2">Criteria Details</h1>
                <v-table class="border">
                  <thead>
                    <tr>
                      <th class="text-center text-base">Criteria</th>
                      <th class="text-center text-base">Out Of</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, key) in item.criteriasObjects"
                      :key="key"
                    >
                      <td class="text-center text-base">
                        {{ key }}
                      </td>
                      <td class="text-center text-base">
                        {{ value }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
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
        <template v-slot:item.delete="{ item }">
          <v-dialog width="500">
            <template v-slot:activator="{ props }">
              <v-btn v-bind:="props" size="small" color="error"> Delete </v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="Warning!">
                <v-card-text class="title">
                  Are you sure you want to delete this criteria?
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
                  <v-btn
                    @click="deleteCriteria(item.criteriaProgram)"
                    color="error"
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
const props = defineProps({
  criteriaData: Array,
  programsData: Object,
});
const valid = ref(false);
const criteriaForm = ref(null);
const headers = ref([
  { key: "criteriaName", sortable: false, title: "Critera Name" },
  { key: "criteriaProgram", sortable: false, title: "Program" },
  { key: "criteriaTotalMark", sortable: false, title: "Total Marks" },
  { key: "criteriasObjects", sortable: true, title: "Action" },
  { key: "delete", sortable: false, title: "Delete" },
]);

// Request Body
const storedUser = JSON.parse(localStorage.getItem("user"));
const userProgram = storedUser.coordinator_program;
const criteriaName = ref("");
const criteriaProgram = ref(userProgram);
const criteriasObjects = ref([{ name: "", outOf: "" }]);

// Feedback
const responseMessage = ref("");
const errorMessage = ref("");
const snackbar = ref(false);

// Rules
const nameRules = [
  (value) =>
    (value && value.trim().length >= 2 && /^[a-zA-Z0-9\s]*$/.test(value)) ||
    "Criteria must be at least 2 characters, alphanumeric and space only.",
];

const gradeRules = [
  (value) =>
    (value?.trim() !== "" &&
      !isNaN(value?.trim()) &&
      value === value?.trim()) ||
    "Grade must be a valid number without leading or trailing spaces.",
];

// Functions

onMounted(() => {
  criteriaProgram.value = userProgram; // Set the default value to userProgram
});

const addEntry = (list) => {
  list.push({ name: "", outOf: "" });
};

const removeEntry = (list, index) => {
  list.splice(index, 1);
};

const resetForm = () => {
  criteriaForm.value.reset();
};

const apiUrl = import.meta.env.VITE_API_URL;
const submitCriteria = async () => {
  const token = localStorage.getItem("access_token");
  try {
    // Fill in criteriaObjects with data from criteriaObjects
    const criteriasObjectsPayload = {};
    criteriasObjects.value.forEach((criteria) => {
      criteriasObjectsPayload[criteria.name] = criteria.outOf;
    });

    const response = await axios.post(
      `${apiUrl}/api/newCriteria`,
      {
        criteriaName: criteriaName.value,
        criteriaProgram: criteriaProgram.value,
        criteriasObjects: criteriasObjectsPayload,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status === 200) {
      // Handle success
      errorMessage.value = "";
      props.criteriaData.push(response.data.criteria);
      responseMessage.value = response.data.message;
      snackbar.value = true;
      resetForm();
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.error;
    } else if (error.response && error.response.status === 500) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = "An unexpected error occurred. Please try again.";
    }
  }
};

const deleteCriteria = async (program) => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.delete(`${apiUrl}/api/criterias/${program}`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.status === 200) {
      // Handle success
      errorMessage.value = "";
      // Find the index of the item in criteriaData
      const indexToDelete = props.criteriaData.findIndex(
        (item) => item.criteriaProgram === program
      );

      // Remove the item from the criteriaData array
      if (indexToDelete !== -1) {
        props.criteriaData.splice(indexToDelete, 1);
      }

      responseMessage.value = response.data.message;
      snackbar.value = true;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message;
    } else if (error.response && error.response.status === 500) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = "An unexpected error occurred. Please try again.";
    }
  }
};

const openDialog = (item) => {
  item.dialog = true;
};

const closeDialog = (item) => {
  item.dialog = false;
};

const itemProps = (item) => ({
  title: item.abbreviation,
  subtitle:
    item.name + (item.abbreviation === userProgram ? " (Your Program)" : ""),
});
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
