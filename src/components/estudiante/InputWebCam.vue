<template>
  <div>
    <h2>Toma una foto!</h2>
    <camera @abrir-foto="onFotoTomada" />
    <img v-if="foto" :src="foto" alt="Foto capturada">
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Camera from './Camera.vue';

export default defineComponent({
  data() {
    return {
      foto: null // Variable to store the photo URL
    }
  },
  methods: {
    onFotoTomada(foto) { // Receive the photo URL from the Camera component
      this.foto = foto; // Store the URL in the 'foto' variable
      console.log('Foto capturada:', foto); // Optional: log the capture to the console
    }
  },

  components:{
    Camera
  }
});
</script>
