import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store';

import Home from './components/home.vue'
import About from './components/about.vue'
import Register from './components/students/register.vue'
import Signin from './components/students/signin.vue'
import Profile from './components/profile.vue'
import Users from './components/users.vue'
import Dashboard from './components/dashboard.vue'
import MyProject from './components/students/myproject.vue'
import notificationCenter from './components/notificationCenter.vue';
import clientTokenMiddleware from './middleware/tokenGuard';
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin,
    meta: { requiresGuest: true },
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/activity-feed',
    name: 'activity-feed',
    component: notificationCenter,
    meta: { requiresAuth: true },
  },
  {
    path: '/myproject',
    name: 'myproject',
    component: MyProject,
    meta: { requiresAuth: true, allowedUserType: 'student' },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: { requiresAuth: true, allowedUserType: 'lecturer' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      // Check if the token has expired
      await store.dispatch('checkTokenExpiration');
      // Perform authentication check
      const decodedUserData = await clientTokenMiddleware();

      // Check user's type if the route requires a specific user type
      if (
        to.matched.some(record => record.meta.allowedUserType) &&
        decodedUserData.user_type !== to.meta.allowedUserType
      ) {
        // If the user type does not match the required type for the route, deny access
        return next({ name: 'home' });
      }
        // Check if the route requires admin access
      if (
          to.matched.some(record => record.meta.requiresAdmin) &&
          decodedUserData.isAdmin !== true // isAdmin is a boolean value
        ) {
          // If the user is not an admin and the route requires admin access, deny access
          return next({ name: 'home' });
        }

      // If authentication and user type checks pass, allow navigation
      next();
    } catch (error) {
      // If authentication fails or user type check fails, redirect to the login page or another appropriate route
      next({ name: 'signin' });
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    try {
      
      if (store.state.user) {
        next({ name: 'home' });
      } else {
        next();
      }
    } catch (error) {
      next({ name: 'signin' });
    }
  }  else {
    // If the route does not require authentication, proceed with navigation
    next();
  } 
});

export default router;  