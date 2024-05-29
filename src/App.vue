<template>
  <v-layout class="rounded rounded-md">
    <!-- Main navigation drawer component -->
    <component v-if="showNavigationDrawer" :is="AppNavigationDrawer" />
    <component v-else-if="showNavigationDrawer_est" :is="AppNavigationDrawer_est" />

    <v-main style="min-height: 300px;">
      <RouterView/>
    </v-main>
  </v-layout>
</template>

<style scoped>

</style>

<script setup>
import { RouterView, useRouter } from 'vue-router';
import AppNavigationDrawer from '@/components/app/AppNavigationDrawer.vue';
import AppNavigationDrawer_est from '@/components/app/AppNavigationDrawer_est.vue';
import { ref } from 'vue';
import { useMainStore } from './stores/MainStore.js';

const showNavigationDrawer = ref(false);
const showNavigationDrawer_est = ref(false);

const router = useRouter();

function isStudent() {
  return useMainStore().userRole === 'est'; // Verifica si el rol es 'estudiante'
}
function isAdmin() {
  return useMainStore().userRole  === 'admin'; // Verifica si el rol es 'administrador'
}

router.beforeEach((to, from, next) => {
  showNavigationDrawer.value = isAdmin();
  showNavigationDrawer_est.value = isStudent();

  if (to.name === 'portal') {
    showNavigationDrawer.value = false;
    showNavigationDrawer_est.value = false;
  }

  next();
});
</script>