<template>
  <v-app
    :theme="isDark ? 'dark' : 'light'"
    :class="isDark ? 'tempDiv-dark' : 'tempDiv'"
  >
    <v-container fluid>
      <v-row>
        <v-col cols="2" class="nav">
          <Navigation />
        </v-col>
        <v-col
          cols="1"
          style="min-width: 70%; max-width: 90%"
          class="flex-grow-1 flex-shrink-0 main"
        >
          <div class="pt-4 upperDiv">
            <h1 class="text-3xl font-medium title">Admin Dashboard!</h1>
            <p class="text-lg titleDes font-light">
              The MDMS System For Semester 2023/2024 - 1
            </p>
          </div>
          <div class="lowerDiv pt-10">
            <v-tabs
              :color="isDark ? '#FFC505' : 'indigo-darken-4'"
              bg-color="transparent"
              v-model="tab"
            >
              <v-tab class="v-tab" value="one">General</v-tab>
              <v-tab class="v-tab" value="two">Proposals</v-tab>
              <v-tab class="v-tab" value="three">Evaluations</v-tab>
              <v-tab class="v-tab" value="four">Nominations</v-tab>
              <v-tab
                v-for="(curreentProgram, key) in currnetPrograms.programTypes"
                :key="key"
                class="v-tab"
                :value="curreentProgram.abbreviation"
                >{{ curreentProgram.abbreviation }} Students</v-tab
              >
            </v-tabs>
            <v-divider class="w-[90%]"></v-divider>

            <v-card-text class="pl-0">
              <v-window v-model="tab">
                <v-window-item value="one"><AdminMain /> </v-window-item>
                <v-window-item value="two"> <AdminProposals /></v-window-item>
                <v-window-item value="three"
                  ><AdminEvaluations />
                </v-window-item>
                <v-window-item value="four"
                  ><AdminNominations />
                </v-window-item>
                <v-window-item
                  v-for="(curreentProgram, key) in currnetPrograms.programTypes"
                  :value="curreentProgram.abbreviation"
                  ><ProgramStudents
                    :program="curreentProgram.abbreviation"
                    :name="curreentProgram.name"
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
import AdminMain from "./adminPages/adminMain.vue";
import AdminProposals from "./adminPages/adminProposals.vue";
import AdminEvaluations from "./adminPages/adminEvaluations.vue";
import AdminNominations from "./adminPages/adminNominations.vue";
import ProgramStudents from "./adminPages/programStudents.vue";

// Constants
const isDark = useDark();
const tab = ref("");
const currnetPrograms = ref({});
const apiUrl = import.meta.env.VITE_API_URL;

onMounted(async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/programs`);
    if (response.status === 200) {
      currnetPrograms.value = response.data.programs;
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching programs:", error);
  }
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1500px) {
  .nav {
    display: none;
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
