<template>
  <div>
    <v-btn @click="abrirCamara">Activar Cámara</v-btn>
    <v-img :src="foto" v-if="foto" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  setup() {
    const $q = useQuasar();
    let foto = null;

    const abrirCamara = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'camera' });
        if (permission.state === 'granted') {
          // Permission granted, proceed to start the camera
          const stream = await $q.camera.start();
          // ... rest of the camera access logic ...
        } else if (permission.state === 'denied') {
          console.error('Permiso de cámara denegado');
        } else if (permission.state === 'prompt') {
          // Request permission again
          const newPermission = await navigator.permissions.request({ name: 'camera' });
          if (newPermission.state === 'granted') {
            // Permission granted after prompting, proceed to start the camera
            const stream = await $q.camera.start();
            // ... rest of the camera access logic ...
          } else {
            console.error('Permiso de cámara sigue denegado');
          }
        } else {
          console.error('Error al obtener el estado del permiso de cámara');
        }
      } catch (error) {
        console.error('Error al abrir la cámara:', error);
      }
    };

    return {
      foto,
      abrirCamara,
    };
  },
});
</script>

<style scoped>
/* Vuetify styles for the component */
</style>
