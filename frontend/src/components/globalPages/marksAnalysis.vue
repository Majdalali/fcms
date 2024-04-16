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
            <h1 class="text-3xl font-medium title">Marks Analysis</h1>
            <p class="text-base titleDes font-light">
              Here you can find all the marks analysis related to evaluation and
              grading.
            </p>
          </div>
          <!-- {{ groupedEvals }} -->
          <div v-if="!isLoading" class="lowerDiv pt-5 lg:w-[95%]">
            <v-tabs
              :color="isDark ? '#FFC505' : 'indigo-darken-4'"
              bg-color="transparent"
              v-model="tab"
            >
              <v-tab
                v-for="(curreentProgram, key) in currnetPrograms.programTypes"
                :key="key"
                class="v-tabMain"
                :value="curreentProgram.abbreviation"
                >{{ curreentProgram.abbreviation }}</v-tab
              >
            </v-tabs>
            <v-window disabled v-model="tab">
              <!--? Program  Tab -->
              <v-window-item
                v-for="(curreentProgram, key) in currnetPrograms.programTypes"
                :value="curreentProgram.abbreviation"
              >
                <div class="w-fit m-auto mt-10">
                  <v-tabs
                    class="rounded-3xl md:px-20"
                    align-tabs="center"
                    :bg-color="isDark ? '#fdfefb' : '#BDBDBD'"
                    v-model="tabSecondry"
                  >
                    <v-tab value="one">Project 1</v-tab>
                    <v-tab value="two">Project 2</v-tab>
                  </v-tabs>
                </div>

                <div class="pl-0 w-full">
                  <v-window disabled v-model="tabSecondry">
                    <v-window-item value="one">
                      <marksBuilder
                        :evaluationData="evaluationData"
                        :programType="curreentProgram.abbreviation"
                        projectType="pOne"
                        :evalType="curreentProgram.hasQuestionnaireEvaluations"
                      ></marksBuilder>
                    </v-window-item>
                    <v-window-item value="two">
                      <marksBuilder
                        :evaluationData="evaluationData"
                        :programType="curreentProgram.abbreviation"
                        projectType="pTwo"
                        :evalType="curreentProgram.hasQuestionnaireEvaluations"
                      ></marksBuilder>
                    </v-window-item>
                  </v-window>
                </div>
              </v-window-item>
            </v-window>
          </div>
          <v-row v-else class="pt-5 justify-center lg:w-[95%]">
            <v-col cols="12">
              <v-skeleton-loader
                class="sm:w-1/3"
                type="heading"
              ></v-skeleton-loader>
            </v-col>
            <div class="mt-8 w-1/2 md:w-1/4">
              <v-skeleton-loader type="heading"></v-skeleton-loader>
            </div>

            <v-col cols="12">
              <v-skeleton-loader
                class="sm:w-1/4 mt-8"
                type="heading"
              ></v-skeleton-loader>
              <v-skeleton-loader class="mt-4" type="table"></v-skeleton-loader>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import Navigation from "../navigation.vue";
import { useDark } from "@vueuse/core";
import { ref, onMounted } from "vue";
import axios from "axios";
import marksBuilder from "./marksBuilder.vue";

// Constants
const isDark = useDark();
const apiUrl = import.meta.env.VITE_API_URL;
const isLoading = ref(false);
const evaluationData = ref([]);
const currnetPrograms = ref([]);
const tab = ref(0);
const tabSecondry = ref("");

onMounted(async () => {
  isLoading.value = true;
  const token = localStorage.getItem("access_token");
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
  try {
    const response = await axios.get(`${apiUrl}/evaluations`, {
      headers: {
        Authorization: token,
      },
    });
    const filteredEvaluations = response.data.filter(
      (evaluation) => evaluation.evalType !== "questionnaire"
    );

    // Extract criteriaProgram for evaluations with evalType "questionnaire"
    const questionnairePrograms = response.data
      .filter((evaluation) => evaluation.evalType === "questionnaire")
      .map((evaluation) => evaluation.criteriaProgram);

    // Map through current programs and check if their abbreviation matches
    currnetPrograms.value.programTypes.forEach((program) => {
      if (questionnairePrograms.includes(program.abbreviation)) {
        program.hasQuestionnaireEvaluations = true;
      } else {
        program.hasQuestionnaireEvaluations = false;
      }
    });

    // Update evaluationData with filtered evaluations
    evaluationData.value = filteredEvaluations;
  } catch (error) {
    console.error("Error fetching evaluations: ", error);
  }

  isLoading.value = false;
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
.titleSec {
  font-family: "Work Sans", sans-serif;
}
.tempDiv {
  background-color: #fdfefb !important;
}
.tempDiv-dark {
  background-color: #0d0d0d !important;
}
.vCard:nth-child(1) {
  margin-top: 0px !important;
}
.v-tabMain {
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  font-size: 18px;
}

.v-tabMain:first-child {
  text-align: start !important;
  padding-left: 0%;
}
</style>
