<template>
  <v-alert
    v-if="mostrar && (error || mensaje)"
    :text="mensaje"
    :type="error ? 'error' : 'success'"
    :title="error ? 'Error' : 'Éxito'"
    dismissible
    dense
    class="v-alert--text-wrap custom-alert"
  >
    <template v-slot:close>
      <v-icon :onclick="cerrarAlerta">mdi-close</v-icon>
    </template>
  </v-alert>
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
      default: true
    }
  },
  methods: {
    cerrarAlerta() {
      this.$emit('cerrar')
    }
  }
}
</script>
  
<style scoped>
.custom-alert {
  max-width: 400px;
}
</style>