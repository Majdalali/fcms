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
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin,
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/myproject',
    name: 'myproject',
    component: MyProject,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: { requiresAuth: true },
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

// Add navigation guard to check if the route requires authentication
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if the user is authenticated (you can define your own condition here)
    if (!store.state.user) {
      // If the user is not logged in, redirect to the sign-in page
      next({ name: 'signin' }); // Adjust the name to your sign-in route
    } else {
      // If the user is authenticated, proceed to the requested route
      next();
    }
  } else {
    // If the route does not require authentication, proceed to the requested route
    next();
  }
});
router.beforeEach((to, from, next) => {
  // Check the token expiration before navigating to each route
  store.dispatch('checkTokenExpiration');

  next(); // Continue navigation
});

export default router;