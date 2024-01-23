<template>
  <v-app :class="isDark ? 'glass-backgroundDark' : 'glass-background'">
    <div v-if="!isDark" class="overlay z-0"></div>

    <v-sheet
      :color="isDark ? '#0D0D0D' : 'white'"
      :elevation="8"
      class="z-10 px-[10%] h-20"
    >
      <div class="flex flex-row items-center justify-between w-full h-full">
        <div>
          <v-img
            :width="300"
            aspect-ratio="16/9"
            cover
            :src="isDark ? UTMLogoBlack : UTMLogo"
          ></v-img>
        </div>
        <div class="flex flex-row">
          <ul class="flex flex-row gap-16">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
          </ul>
        </div>
        <div>
          <ul class="flex flex-row gap-10">
            <li v-if="!user">
              <v-btn class="btn" variant="text" @click="dialogSignIn = true"
                >Sign In</v-btn
              >
            </li>
            <li v-if="!user">
              <v-btn
                class="btn"
                variant="flat"
                color="#800000"
                rounded="lg"
                @click="dialogRegister = true"
                >Register</v-btn
              >
            </li>
            <li v-if="user">
              <v-btn class="btn" variant="text" @click="logout">Sign Out</v-btn>
            </li>
            <li v-if="isAdminUser">Admin</li>
            <li v-if="user_type === 'student'">
              <router-link to="/profile"
                ><v-btn class="btn" variant="text" prepend-icon="mdi-account"
                  >Profile</v-btn
                ></router-link
              >
            </li>
            <li v-if="user_type === 'lecturer'">
              <router-link to="/lecturer-profile"
                ><v-btn class="btn" variant="text" prepend-icon="mdi-account"
                  >Profile</v-btn
                ></router-link
              >
            </li>
            <li>
              <v-btn
                variant="text"
                @click="toggleDark()"
                :color="isDark ? '#FAC000' : '#0D0D0D'"
                size="small"
                :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
              ></v-btn>
            </li>
          </ul>
        </div>
      </div>

      <v-dialog v-model="dialogSignIn" height="500" width="500">
        <v-card title="Sign In" :color="isDark ? 'white' : '#0D0D0D'">
          <v-card-text>
            <v-row class="justify-around py-10">
              <div class="student">
                <h1 class="title font-medium text-center mb-2">Student</h1>

                <router-link to="/signin"
                  ><v-btn
                    variant="elevated"
                    text="Sign In"
                    color="#800000"
                  ></v-btn
                ></router-link>
              </div>
              <div class="lecturer">
                <h1 class="title font-medium text-center mb-2">Lecturer</h1>
                <router-link to="/lecturer-signin"
                  ><v-btn
                    variant="elevated"
                    text="Sign In"
                    color="#800000"
                  ></v-btn
                ></router-link>
              </div>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="Cancel"
              variant="text"
              @click="dialogSignIn = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRegister" height="500" width="500">
        <v-card title="Register" :color="isDark ? 'white' : '#0D0D0D'">
          <v-card-text>
            <v-row class="justify-around py-10">
              <div class="student">
                <h1 class="title font-medium text-center mb-2">Student</h1>

                <router-link to="/register"
                  ><v-btn
                    variant="elevated"
                    text="Register"
                    color="#800000"
                  ></v-btn
                ></router-link>
              </div>
              <div class="lecturer">
                <h1 class="title font-medium text-center mb-2">Lecturer</h1>
                <router-link to="/lecturer-register"
                  ><v-btn
                    variant="elevated"
                    text="Register"
                    color="#800000"
                  ></v-btn
                ></router-link>
              </div>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="Cancel"
              variant="text"
              @click="dialogRegister = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-sheet>
    <div
      class="w-full h-full z-10 px-[10%] flex flex-row items-center justify-around"
    >
      <div class="heroLeft w-1/2">
        <h1
          class="title heroTitle uppercase text-[#0D0D0D] dark:text-[#F8F6F6] whitespace-nowrap"
        >
          <span class="mastersGradiant">Masters</span> System <br />for
          <span :class="isDark ? 'postGradiant' : 'postGradiantLight'"
            >Postgraduate</span
          ><br />
          students.
        </h1>
        <p
          class="heroPara pt-2 text-[#0D0D0D] dark:text-[#F8F6F6] whitespace-nowrap"
        >
          Welcome to our new masters management system, if <br />you're new
          please register a new account
        </p>
        <div class="mt-6">
          <v-btn
            class="btn"
            variant="flat"
            color="#800000"
            width="200"
            size="large"
            rounded="lg"
            text="Register"
            @click="dialogRegister = true"
          ></v-btn>
          <v-btn
            class="btn ml-6"
            variant="text"
            :color="isDark ? '#F8F6F6' : '#0D0D0D'"
            width="200"
            height="50"
            size="large"
            rounded="lg"
            ><span class="font-bold"
              >How Does it work?
              <v-divider
                :thickness="4"
                class="border-opacity-100 rounded-xl border-[#FAC000]"
              ></v-divider></span
          ></v-btn>
        </div>
      </div>
      <div class="heroRight">
        <v-img
          draggable="false"
          :width="800"
          aspect-ratio="16/9"
          cover
          :src="HeroImage"
        ></v-img>
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useDark, useToggle } from "@vueuse/core";
import UTMLogo from "@/assets/images/utmLogo.png";
import UTMLogoBlack from "@/assets/images/utmLogoBlack.png";
import HeroImage from "@/assets/images/heroImage.svg";

// Constants
const isDark = useDark();
const toggleDark = useToggle(isDark);
const store = useStore();
const dialogSignIn = ref(false);
const dialogRegister = ref(false);

console.log(isDark.value);

// Computed property to get the user from the store
const user = computed(() => store.state.user);
const user_type = computed(() => user.value !== null && user.value.user_type);

// Computed property to check if the user is logged in
const isAdminUser = computed(
  () => user.value !== null && user.value.role === "admin"
);

// Function to handle user logout
const logout = () => {
  store.dispatch("logoutUser");
};
</script>

<style lang="scss" scoped>
.glass-background {
  background: linear-gradient(
    to top right,
    rgba(217, 175, 217, 0.8),
    rgba(151, 217, 225, 0.8)
  );
  /* You can adjust the gradient angle and colors as needed */
  backdrop-filter: blur(10px);
  /* Adjust the blur level for the glass effect */
  -webkit-backdrop-filter: blur(10px); /* For compatibility with Safari */
}
.glass-backgroundDark {
  background: linear-gradient(
    to top right,
    rgba(13, 13, 13, 1),
    rgba(28, 13, 13, 1)
  );
  /* You can adjust the gradient angle and colors as needed */
  backdrop-filter: blur(10px);
  /* Adjust the blur level for the glass effect */
  -webkit-backdrop-filter: blur(10px); /* For compatibility with Safari */
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  /* Adjust the opacity by changing the last parameter (0.45) */
  backdrop-filter: blur(3px);
  /* Apply the blur effect to the overlay */
  pointer-events: none;
}
li {
  font-family: "DM Sans", sans-serif;
  font-size: 18px;
  font-weight: 300 !important;
}

.title {
  font-family: "DM Sans", sans-serif;
}
.btn {
  font-family: "DM Sans", sans-serif;
}

.heroTitle {
  font-size: 3.75rem /* 60px */;
  line-height: 1.25;
  font-weight: bold;
}
.heroPara {
  font-family: "Work Sans", sans-serif;
  font-size: 1.5rem /* 24px */;
  line-height: 1.25;
  font-weight: 300;
}

.mastersGradiant {
  background: linear-gradient(
    to right,
    rgba(131, 0, 0, 1),
    rgba(212, 131, 0, 1),
    rgba(250, 192, 0, 1)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.postGradiant {
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 20%,
    rgba(131, 0, 0, 1),
    rgba(250, 192, 0, 1)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.postGradiantLight {
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 20%,
    rgba(131, 0, 0, 1),
    rgba(250, 192, 0, 1)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
