import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import Home from './components/home.vue'
import About from './components/about.vue'
import Register from './components/students/register.vue'
import Signin from './components/students/signin.vue'

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
    path: '/about',
    name: 'about',
    component: About,
  },
];


const router = createRouter({ history: createWebHistory(), routes });
export default router;