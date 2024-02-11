<template>
  <v-app :class="isDark ? 'glass-backgroundDark' : 'glass-background'">
    <div v-if="!isDark" class="overlay z-0"></div>
    <HomeNavigation />
    <div
      class="w-full h-full z-10 flex flex-row items-center justify-center max-xl:text-center xl:px-[10%] xl:justify-around"
    >
      <div class="heroLeft xl:w-1/2">
        <h1
          class="title heroTitle uppercase text-[#0D0D0D] dark:text-[#F8F6F6] whitespace-nowrap hidden sm:font- xl:block"
        >
          <span class="mastersGradiant">Masters</span> System <br />for
          <span :class="isDark ? 'postGradiant' : 'postGradiantLight'"
            >Postgraduate</span
          ><br />
          students.
        </h1>
        <h1
          class="title heroTitle uppercase text-[#0D0D0D] dark:text-[#F8F6F6] xl:hidden"
        >
          <span class="mastersGradiant">Masters</span> System for
          <span :class="isDark ? 'postGradiant' : 'postGradiantLight'"
            >Postgraduate</span
          >
          students.
        </h1>
        <p
          class="heroPara pt-2 text-[#0D0D0D] dark:text-[#F8F6F6] md:whitespace-nowrap"
        >
          Welcome to our Masters Project & Dissertation System, if
          <br class="max-md:hidden" />you're new please register a new account
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
            class="btn sm:ml-6"
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
      <div class="heroRight hidden xl:block">
        <v-img
          draggable="false"
          :width="800"
          aspect-ratio="16/9"
          cover
          :src="HeroImage"
        ></v-img>
      </div>
    </div>
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
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useDark } from "@vueuse/core";
import HeroImage from "@/assets/images/heroImage.svg";
import HomeNavigation from "./homeNavigation.vue";

// Constants
const isDark = useDark();
const dialogRegister = ref(false);
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

// active li style
.router-link-active {
  color: #6589ff; /* Change text color */
}

@media screen and (max-width: 635px) {
  .heroTitle {
    font-size: 32px;
  }

  .heroPara {
    font-size: 16px;
    white-space: normal;
  }
  .heroLeft {
    width: 80%;
  }
  .btn:nth-child(2) {
    margin-top: 10px;
  }
}
</style>
