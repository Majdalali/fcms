<template>
  <v-container fluid class="container z-30 hidden sm:block">
    <v-sheet
      class="z-10 px-[10%] h-20"
      :elevation="2"
      :theme="isDark ? 'dark' : 'light'"
      :color="isDark ? '#0D0D0D' : 'white'"
    >
      <div class="flex flex-row items-center justify-between w-full h-full">
        <div class="logo hidden">
          <v-img
            :width="300"
            aspect-ratio="16/9"
            cover
            :src="isDark ? UTMLogoBlack : UTMLogo"
          ></v-img>
        </div>
        <div class="flex flex-row nav z-10">
          <ul class="flex flex-row gap-16 whitespace-nowrap">
            <router-link to="/"><li>Home</li></router-link>
            <router-link to="/about"> <li>About us</li></router-link>
            <router-link to="/contact"> <li>Contact us</li></router-link>
          </ul>
        </div>
        <div class="menu hidden xl:block">
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
        <div class="burger xl:hidden">
          <v-menu location="start" color="black">
            <template v-slot:activator="{ props }">
              <v-btn variant="text" icon="mdi-menu" v-bind="props"> </v-btn>
            </template>
            <v-list class="text-center w-36 btn">
              <router-link v-if="user_type === 'student'" to="/profile">
                <v-list-item link title="Profile"> </v-list-item>
              </router-link>
              <router-link
                v-if="user_type === 'lecturer'"
                to="/lecturer-profile"
                ><v-list-item link title="Profile"> </v-list-item
              ></router-link>

              <v-list-item link title="Sign out" @click="logout" v-if="user">
              </v-list-item>
              <v-list-item
                link
                title="Sign in"
                v-if="!user"
                @click="dialogSignIn = true"
              >
              </v-list-item>
              <v-list-item
                v-if="!user"
                link
                title="Register"
                @click="dialogRegister = true"
              >
              </v-list-item>
              <v-list-item class="text-center">
                <v-btn
                  variant="text"
                  @click="toggleDark()"
                  :color="isDark ? '#FAC000' : '#0D0D0D'"
                  size="small"
                  :icon="
                    isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'
                  "
                ></v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-sheet>

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
  </v-container>
  <v-container class="sm:hidden">
    <v-app-bar :color="isDark ? '#0D0D0D' : 'white'" prominent>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>MPDS</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      location="top"
      temporarys
      class="h-auto"
    >
      <v-list class="text-center btn">
        <router-link to="/"
          ><v-list-item link title="Home"></v-list-item
        ></router-link>
        <router-link to="/about">
          <v-list-item link title="About us"></v-list-item
        ></router-link>
        <router-link to="/contact">
          <v-list-item link title="Contact us"></v-list-item
        ></router-link>
        <router-link v-if="user_type === 'student'" to="/profile">
          <v-list-item link title="Profile"> </v-list-item>
        </router-link>
        <router-link v-if="user_type === 'lecturer'" to="/lecturer-profile"
          ><v-list-item link title="Profile"> </v-list-item
        ></router-link>

        <v-list-item link title="Sign out" @click="logout" v-if="user">
        </v-list-item>
        <v-list-item
          link
          title="Sign in"
          v-if="!user"
          @click="dialogSignIn = true"
        >
        </v-list-item>
        <v-list-item
          v-if="!user"
          link
          title="Register"
          @click="dialogRegister = true"
        >
        </v-list-item>
        <v-list-item class="text-center">
          <v-btn
            variant="text"
            @click="toggleDark()"
            :color="isDark ? '#FAC000' : '#0D0D0D'"
            size="small"
            :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
          ></v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useDark, useToggle } from "@vueuse/core";
import UTMLogo from "@/assets/images/utmLogo.png";
import UTMLogoBlack from "@/assets/images/utmLogoBlack.png";

// Constants
const isDark = useDark();
const toggleDark = useToggle(isDark);
const store = useStore();
const dialogSignIn = ref(false);
const dialogRegister = ref(false);
const drawer = ref(false);

// Computed property to get the user from the store
const user = computed(() => store.state.user);
const user_type = computed(() => user.value !== null && user.value.user_type);

// Function to handle user logout
const logout = () => {
  store.dispatch("logoutUser");
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 !important;
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

// active li style
.router-link-active {
  color: #6589ff; /* Change text color */
}

// hide logo under 950px

@media (min-width: 950px) {
  .logo {
    display: block;
  }
}

// hide nav in small screens
@media (max-width: 530px) {
  .nav {
    display: none;
  }
}
</style>
