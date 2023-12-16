<template>
  <v-app
    :theme="isDark ? 'dark' : 'light'"
    :class="isDark ? 'tempDiv-dark' : 'tempDiv'"
  >
    <v-container fluid>
      <v-row>
        <v-col cols="2">
          <Navigation />
        </v-col>
        <v-col cols="10" class="main">
          <div class="pt-4 upperDiv">
            <h1 class="text-3xl font-medium title">Personal Profile</h1>
            <p v-if="userInfo" class="text-lg titleDes font-light">
              Hi {{ userInfo.username }}!
            </p>
          </div>
          <div class="middleDiv pt-10">
            <div v-if="userInfo">
              <v-sheet
                :height="200"
                border
                class="w-[90%] drop-shadow-lg p-10 rounded-lg"
              >
                <div class="flex flex-row items-center h-full pl-20">
                  <v-avatar
                    :text="getInitials(userInfo.username)"
                    color="#9C3D3D"
                    class="text-3xl title"
                    size="100"
                  ></v-avatar>
                  <div class="flex flex-col pl-5">
                    <div>
                      <h1 class="text-2xl capitalize font-bold title">
                        {{ userInfo.username }}
                      </h1>
                    </div>
                    <div class="flex flex-row">
                      <v-tooltip location="bottom" text="Email">
                        <template v-slot:activator="{ props }">
                          <p v-bind="props" class="text-lg font-light para">
                            <v-icon class="mr-2"><Email /></v-icon
                            >{{ userInfo.email }}
                          </p>
                        </template>
                      </v-tooltip>
                      <v-tooltip location="bottom" text="Matric No.">
                        <template v-slot:activator="{ props }">
                          <p
                            v-bind="props"
                            class="text-lg ml-10 uppercase font-light para"
                          >
                            <v-icon class="mr-2"><UserCard /></v-icon
                            >{{ userInfo.matricCard }}
                          </p>
                        </template>
                      </v-tooltip>
                      <v-tooltip location="bottom" text="Program">
                        <template v-slot:activator="{ props }">
                          <p
                            v-bind="props"
                            class="text-lg ml-10 uppercase font-light para"
                          >
                            <v-icon class="mr-2"><Flag /></v-icon
                            >{{ userInfo.user_program }}
                          </p>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
                <div class="absolute right-5 bottom-5">
                  <v-btn color="primary" size="large">Edit Profile</v-btn>
                </div>
              </v-sheet>
            </div>

            <v-progress-circular v-else indeterminate></v-progress-circular>
          </div>
          <div class="lowerDiv pt-10">
            <v-tabs
              :color="isDark ? '#FFC505' : 'indigo-darken-4'"
              bg-color="transparent"
              v-model="tab"
            >
              <v-tab class="v-tab" value="one">Supervisor</v-tab>
              <v-tab
                v-for="(examiner, index) in examinersInfo"
                :key="index"
                class="v-tab"
                :value="'examiner-' + index"
                >Examiner {{ index + 1 }}</v-tab
              >
              <v-tab class="v-tab" value="four">Comments</v-tab>
            </v-tabs>
            <v-divider class="w-[90%]"></v-divider>

            <v-card-text class="pl-0">
              <v-window v-model="tab">
                <v-window-item value="one"> <Supervisor /> </v-window-item>

                <v-window-item
                  v-for="(examiner, index) in examinersInfo"
                  :key="index"
                  :value="'examiner-' + index"
                >
                  <Examiner :name="examiner.name" :email="examiner.email" />
                </v-window-item>
                <v-window-item class="w-[60%]" value="four">
                  <Comments />
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
import { ref, onMounted } from "vue";
import { useDark } from "@vueuse/core";
import axios from "axios";
import Navigation from "./navigation.vue";
import Supervisor from "./profile/supervisor.vue";
import Examiner from "./profile/examiner.vue";
import Comments from "./students/myProject/comments.vue";
// Icons
import Email from "@/assets/icons/email.vue";
import UserCard from "@/assets/icons/userCard.vue";
import Flag from "@/assets/icons/flag.vue";

// Constants
const isDark = useDark();
const tab = ref("");
const userInfo = ref(null);
const examinersInfo = ref([]);
const getInitials = (username) => {
  const names = username.split(" ");
  return names
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();
};
onMounted(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.user_id;
    const response = await axios.get(`http://localhost:8000/user/${userId}`); // Replace with your API endpoint
    userInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle error, display an error message, or redirect if needed
  }
  try {
    // Get user from local storage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    // get user examiners array from storedUser data
    const userExaminers = storedUser.examiners;
    // Loop through userExaminers array
    for (let i = 0; i < userExaminers.length; i++) {
      // Get examiner details from userExaminers array
      const response = await axios.get(
        `http://localhost:8000/getExaminersDetails/${userExaminers[i]}`
      );
      // Push examiner details to examinersInfo array
      examinersInfo.value.push(response.data);
    }
  } catch (error) {
    console.log(error);
  }
});
</script>

<style lang="scss" scoped>
.title,
.titleDes {
  font-family: "DM Sans", sans-serif;
}
.para {
  font-family: "Work Sans", sans-serif;
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
