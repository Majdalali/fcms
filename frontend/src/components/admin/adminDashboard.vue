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
              <v-tab class="v-tabMain" value="one">General</v-tab>
              <v-tab class="v-tabMain" value="two">Overview</v-tab>
              <v-tab
                v-for="(curreentProgram, key) in currnetPrograms.programTypes"
                :key="key"
                class="v-tabMain"
                :value="curreentProgram.abbreviation"
                >{{ curreentProgram.abbreviation }} Students</v-tab
              >
            </v-tabs>
            <v-divider class="w-[90%]"></v-divider>

            <v-window disabled v-model="tab">
              <!--? General Tab -->
              <v-window-item value="one"><AdminMain /> </v-window-item>

              <!--? Overview Tab -->
              <v-window-item value="two">
                <div class="w-fit m-auto mt-10">
                  <v-tabs
                    class="rounded-3xl md:px-20"
                    align-tabs="center"
                    :bg-color="isDark ? '#fdfefb' : '#BDBDBD'"
                    v-model="tabSecondry"
                  >
                    <v-tab value="one">Evaluations</v-tab>
                    <v-tab value="two">Nominations</v-tab>
                  </v-tabs>
                </div>

                <div class="pl-0 w-full">
                  <v-window disabled v-model="tabSecondry">
                    <v-window-item value="one"
                      ><AdminEvaluations
                    /></v-window-item>
                    <v-window-item value="two"
                      ><AdminNominations
                    /></v-window-item>
                  </v-window>
                </div>
              </v-window-item>

              <!--? Program Students Tab -->
              <v-window-item
                v-for="(curreentProgram, key) in currnetPrograms.programTypes"
                :value="curreentProgram.abbreviation"
              >
                <ProgramStudents
                  :program="curreentProgram.abbreviation"
                  :name="curreentProgram.name"
                />
              </v-window-item>
            </v-window>
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
import ProgramStudents from "./adminPages/programStudents.vue";
import AdminEvaluations from "./adminPages/adminEvaluations.vue";
import AdminNominations from "./adminPages/adminNominations.vue";

// Constants
const isDark = useDark();
const tab = ref("");
const tabSecondry = ref("");
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

.v-tabMain {
  text-transform: capitalize;
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  font-size: 18px;
}

.v-tabMain:first-child {
  text-align: start !important;
  padding-left: 0%;
}
</style>
