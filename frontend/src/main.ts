import './assets/main.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const getFullYear = new Date().getFullYear();
console.log(`${getFullYear} — All Rights Reserved by UTM
Faculty of Computing, Universiti Teknologi Malaysia (UTM)
Developed by: @MajdAlali`);

const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: "light",
    },
})

const app = createApp(App); 
app.use(router); 
app.use(store);
app.use(vuetify); 

const user_id = localStorage.getItem("user_id");
if (user_id) {
  store.dispatch("connectSocket", user_id);
}

app.mount('#app'); 