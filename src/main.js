import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { fa } from 'vuetify/iconsets/fa'
const globalAreaId = 3

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      fa,
    }
  }
})

const app = createApp(App)

app.config.globalProperties.$globalAreaId = globalAreaId 

app.config.globalProperties.globalAreaSelected = {
  id: 1,
  name: 'Facultad de Ciencias y Tecnología',
  initials: 'FCyT'
};

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount('#app');
