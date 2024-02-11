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
            <h1 class="text-3xl font-medium title">Coordinator Dashboard!</h1>
            <p class="text-lg titleDes font-light">
              For program {{ programName.name }} ({{
                programName.abbreviation
              }})
            </p>
          </div>
          <div class="lowerDiv pt-10">
            <v-tabs
              :color="isDark ? '#FFC505' : 'indigo-darken-4'"
              bg-color="transparent"
              v-model="tab"
            >
              <v-tab class="v-tab" value="one">Session</v-tab>
              <v-tab class="v-tab" value="two">Proposals</v-tab>
              <v-tab class="v-tab" value="three">Evaluations</v-tab>
              <v-tab class="v-tab" value="four">Nominations</v-tab>
              <v-tab class="v-tab" value="five"> Program Students </v-tab>
            </v-tabs>
            <v-divider class="w-[90%]"></v-divider>

            <v-card-text class="pl-0">
              <v-window disabled v-model="tab">
                <v-window-item value="one"><CoordMain /> </v-window-item>
                <v-window-item value="two"> <CoordProposals /></v-window-item>
                <v-window-item value="three"
                  ><CoordEvaluations />
                </v-window-item>
                <v-window-item value="four"
                  ><CoordNominations />
                </v-window-item>
                <v-window-item value="five">
                  <ProgramStudents
                    :program="programName.abbreviation"
                    :name="programName.name"
                  />
                </v-window-item>
              </v-window>
            </v-card-text>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import { ref, onMounted } from "vue";
import axios from "axios";

import Navigation from "../navigation.vue";
import CoordProposals from "./coordinatorPages/coordProposals.vue";
import ProgramStudents from "./coordinatorPages/programStudents.vue";
import CoordNominations from "./coordinatorPages/coordNominations.vue";
import CoordEvaluations from "./coordinatorPages/coordEvaluations.vue";
import CoordMain from "./coordinatorPages/coordMain.vue";

// Constants
const isDark = useDark();
const tab = ref("");
const apiUrl = import.meta.env.VITE_API_URL;
const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const userProgram = storedUser.coordinator_program;
const programName = ref({ name: "", abbreviation: "" });

onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/programs`);
    if (response.status === 200) {
      // Find the user's program in the response
      const userProgramData = response.data.programs.programTypes.find(
        (programType) => programType.abbreviation === userProgram
      );

      // If the user's program is found, set the tab and programName
      if (userProgramData) {
        programName.value = {
          name: userProgramData.name,
          abbreviation: userProgramData.abbreviation,
        };
      }
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching programs:", error);
  }
});
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
.v-tab {
  text-transform: capitalize;
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  font-size: 18px;
}
.v-tab:first-child {
  text-align: start !important;
  padding-left: 0%;
}
</style>
