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
            <h1 class="text-3xl font-medium title">Chairman Dashboard!</h1>
            <p class="text-lg titleDes font-light">
              Assign final grades to students
            </p>
          </div>
          <div class="lowerDiv pt-10">
            <v-tabs
              :color="isDark ? '#FFC505' : 'indigo-darken-4'"
              bg-color="transparent"
              v-model="tab"
            >
              <v-tab class="v-tab" value="one">Evaluations</v-tab>
              <v-tab class="v-tab" value="two">Edit applications</v-tab>
            </v-tabs>
            <v-divider class="w-[90%]"></v-divider>

            <v-card-text class="pl-0">
              <v-window disabled v-model="tab">
                <v-window-item value="one"
                  ><ChairManEvaluations :evalData="evaluationData"
                /></v-window-item>
                <v-window-item value="two"><chairmanEdit /> </v-window-item>
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
import Navigation from "../navigation.vue";
import axios from "axios";
import ChairManEvaluations from "./chairmanPages/chairmanEvaluations.vue";
import chairmanEdit from "./chairmanPages/chairmanEdit.vue";

const tab = ref("");
const isDark = useDark();
const evaluationData = ref([]);
const apiUrl = import.meta.env.VITE_API_URL;

onMounted(async () => {
  // fetch data
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.get(`${apiUrl}/evaluations/questionnaires`, {
      headers: {
        Authorization: token,
      },
    });
    const filteredEvaluations = response.data.map((evaluation) => {
      return {
        ...evaluation,
        createdAt: formatDate(evaluation.createdAt),
        projectType:
          evaluation.projectType === "pOne" ? "Project 1" : "Project 2",
      };
    });

    evaluationData.value = filteredEvaluations;
  } catch (error) {
    console.error("Error fetching evaluations: ", error);
  }
});

const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-UK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
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
