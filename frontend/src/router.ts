import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import store from "./store";

import Home from "./components/home.vue";
import About from "./components/about.vue";
import Register from "./components/students/register.vue";
import Signin from "./components/students/signin.vue";
import Profile from "./components/students/profile.vue";
import Users from "./components/users.vue";
import UserHome from "./components/userHome.vue";
import MyProject from "./components/students/myproject.vue";
import Proposal from "./components/students/myProject/proposal.vue";
import ProjectOne from "./components/students/myProject/projectOne.vue";
import ProjectTwo from "./components/students/myProject/projectTwo.vue";
import notificationCenter from "./components/notificationCenter.vue";
import clientTokenMiddleware from "./middleware/tokenGuard";
import lecturerSignin from "./components/lecturers/lecturerSignin.vue";
import lecturerRegister from "./components/lecturers/lecturerRegister.vue";
import lecturerDashboard from "./components/lecturers/lecturerDashboard.vue";
import lecturerProfile from "./components/lecturers/lecturerProfile.vue";
import adminDashboard from "./components/admin/adminDashboard.vue";
import coordinatorDashboard from "./components/coordinator/coordinatorDashboard.vue";
import Coontact from "./components/contact.vue";
import Notfound from "./components/notfound.vue";
import Forms from "./components/globalPages/forms.vue";
import Calendar from "./components/globalPages/calendar.vue";
import Presentation from "./components/globalPages/presentation.vue";
import Rubric from "./components/globalPages/rubric.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: "/signin",
    name: "signin",
    component: Signin,
    meta: { requiresGuest: true },
  },
  {
    path: "/users",
    name: "users",
    component: Users,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/home",
    name: "dashboard",
    component: UserHome,
    meta: { requiresAuth: true },
  },
  {
    path: "/activity-feed",
    name: "activity-feed",
    component: notificationCenter,
    meta: { requiresAuth: true },
  },
  {
    path: "/forms",
    name: "forms",
    component: Forms,
    meta: { requiresAuth: true },
  },
  {
    path: "/calendar",
    name: "calendar",
    component: Calendar,
    meta: { requiresAuth: true },
  },
  {
    path: "/presentation-schedule",
    name: "presentation",
    component: Presentation,
    meta: { requiresAuth: true },
  },
  {
    path: "/evaluation-rubrics",
    name: "rubric",
    component: Rubric,
    meta: { requiresAuth: true },
  },
  {
    path: "/myproject",
    name: "myproject",
    component: MyProject,
    meta: { requiresAuth: true, allowedUserType: "student" },
  },
  {
    path: "/myproject/proposal",
    name: "proposal",
    component: Proposal,
    meta: { requiresAuth: true, allowedUserType: "student" },
  },
  {
    path: "/myproject/1",
    name: "projectOne",
    component: ProjectOne,
    meta: { requiresAuth: true, allowedUserType: "student" },
  },
  {
    path: "/myproject/2",
    name: "projectTwo",
    component: ProjectTwo,
    meta: { requiresAuth: true, allowedUserType: "student" },
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },{
    path: "/contact",
    name: "contact",
    component: Coontact,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: { requiresAuth: true, allowedUserType: "student" },
  },

  // Lecturer routes
  {
    path: "/lecturer-signin",
    name: "lecturer-signin",
    component: lecturerSignin,
    meta: { requiresGuest: true },
  },
  {
    path: "/lecturer-register",
    name: "lecturer-register",
    component: lecturerRegister,
    meta: { requiresGuest: true },
  },
  {
    path: "/lecturer-dashboard",
    name: "lecturer-dashboard",
    component: lecturerDashboard,
    meta: { requiresAuth: true, allowedUserType: "lecturer" },
  },
  {
    path: "/lecturer-profile",
    name: "lecturer-profile",
    component: lecturerProfile,
    meta: { requiresAuth: true, allowedUserType: "lecturer" },
  },
  {
    path: "/admin",
    name: "admin",
    component: adminDashboard,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      allowedUserType: "lecturer",
    },
  },
  {
    path: "/coordinator",
    name: "coordinator",
    component: coordinatorDashboard,
    meta: { allowedUserType: "lecturer" , requiresCoordinator: true, requiresAuth: true},
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: Notfound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    try {
      // Check if the token has expired
      await store.dispatch("checkTokenExpiration");
      // Perform authentication check
      const decodedUserData = await clientTokenMiddleware();

      // Check user's type if the route requires a specific user type
      if (
        to.matched.some((record) => record.meta.allowedUserType) &&
        decodedUserData.user_type !== to.meta.allowedUserType
      ) {
        // If the user type does not match the required type for the route, deny access
        return next({ name: "home" });
      }
      // Check if the route requires admin access
      if (
        to.matched.some((record) => record.meta.requiresAdmin) &&
        decodedUserData.isAdmin !== true // isAdmin is a boolean value
      ) {
        // If the user is not an admin and the route requires admin access, deny access
        return next({ name: "home" });
      }

      // Check if user is a coordinator
      if (
        to.matched.some((record) => record.meta.requiresCoordinator) &&
        decodedUserData.isCoordinator !== true
      ) {
        return next({ name: "home" });
      }
      // If authentication and user type checks pass, allow navigation
      next();
    } catch (error) {
      // If authentication fails or user type check fails, redirect to the login page or another appropriate route
      next({ name: "signin" });
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    try {
      if (store.state.user) {
        next({ name: "home" });
      } else {
        next();
      }
    } catch (error) {
      next({ name: "signin" });
    }
  } else {
    // If the route does not require authentication, proceed with navigation
    next();
  }
});

export default router;
