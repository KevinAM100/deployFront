<template>
    <div class="text-center">
      <v-btn
        color="indigo"
        @click="mostrarSnackbar"
      >
        Generar
      </v-btn>
  
      <v-snackbar
        v-model="mostrarInternal"
        vertical
        :color="error ? 'error' : 'success'"
      >
        <div class="text-subtitle-1 pb-2">{{ mensaje }}</div>
  
        <template v-slot:actions>
          <v-btn
            color="white"
            variant="text"
            @click="ocultarSnackbar"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      error: {
        type: Boolean,
        default: false
      },
      mensaje: {
        type: String,
        default: ''
      },
      mostrar: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        mostrarInternal: this.mostrar
      };
    },
    watch: {
      mostrar(newValue) {
        this.mostrarInternal = newValue;
      }
    },
    methods: {
      mostrarSnackbar() {
        if (this.mostrarInternal) return;
        this.mostrarInternal = true;
      },
      ocultarSnackbar() {
        this.mostrarInternal = false;
      }
    }
  }
  </script>
  
  <style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
  </style>
  