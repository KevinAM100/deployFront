<template>
  <v-app>
    <v-app-bar app>
      <!-- Botones del app bar -->
      <v-btn text to="/">Facultades</v-btn>
      <v-spacer></v-spacer>
      <v-btn text to="/mapa">Mapa del sitio</v-btn>
      <v-spacer></v-spacer>
      <v-card class="logo-container" flat>
        <div class="logo-wrapper">
          <v-img :src="logoSrc" alt="Logo" />
        </div>
      </v-card>
      <v-spacer></v-spacer>
      <v-btn text to="/portal/registration">Registro</v-btn>
      <v-spacer></v-spacer>

      <!-- Botón de login -->
      <v-btn id="menu-activator" color="primary">Login</v-btn>

      <!-- Menú desplegable -->
      <v-menu activator="#menu-activator">
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <v-btn @click="() => navigateTo('/admin/dashboard/', 'admin')">Administrador </v-btn>
            </v-list-item-title>
            <v-list-item-title>
              <v-btn @click="() => navigateTo('/student/dashboard/', 'est')">Estudiante </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <Profile/>
    <v-main :style="{ backgroundImage: `url(${backgrndImage})` }"> </v-main>
  </v-app>
</template>

<script setup>
import backgrndImage from '@/assets/AM_assets/backgrnd.jpg';
import logoSrc from '@/assets/AM_assets/logo_ej.png';
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/MainStore.js'
import Profile from "@/components/app/Profile.vue";

const router = useRouter()
const store = useMainStore() // Obteniendo el store de Vuex

function navigateTo(route, role) {
  store.setUserRole(role) // Cambiando el rol de usuario
  router.push(route) // Navegando a la ruta correspondiente
}
</script>

<style scoped>
.centered-app-bar {
  margin: 0 auto;
  max-width: 900px;
}
.logo-container {
  display: flex;
  justify-content: center;
}

.logo-wrapper {
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: transparent;
}

.v-btn {
  font-family: Arial, sans-serif;
  color: black;
  font-weight: bold;
  font-size: 16px;
  background-color: transparent;
}

.v-btn:hover {
  background-color: rgba(0, 0, 0, 0); /* Azul marino con opacidad baja */
}

main {
  background-size: cover;
}
</style>
