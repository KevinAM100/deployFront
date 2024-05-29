<template>
  <v-app>
    <v-container>
      <v-file-input
        v-model="selectedFile"
        label="Seleccionar imagen"
        accept=".png,.jpg,.jpeg"
        @change="onFileSelected"
      ></v-file-input>

      <v-img v-if="image" :src="image" :width="imageWidth" :height="imageHeight" contain></v-img>
    </v-container>
  </v-app>
</template>
  
  <script>
import axios from 'axios'

export default {
  data() {
    return {
      selectedFile: null,
      image: null,
      imageWidth: 512,
      imageHeight: 512
    }
  },
  methods: {
    async onFileSelected(event) {
      const file = event.target.files[0]

      // Verificar si se seleccionó un archivo
      if (!file) return

      // Verificar si el archivo es una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido (PNG o JPEG)')
        return
      }

      // Crear un objeto FileReader para leer el archivo
      const reader = new FileReader()
      reader.onload = () => {
        // Mostrar la imagen en pantalla
        this.image = reader.result
      }
      reader.readAsDataURL(file)
    },
    async uploadImage() {
      try {
        const formData = new FormData()
        formData.append('image', this.selectedFile)

        // Enviar la imagen mediante Axios
        const response = await axios.post('tu_url_de_destino', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        console.log('Respuesta del servidor:', response.data)
      } catch (error) {
        console.error('Error al enviar la imagen:', error)
      }
    }
  }
}
</script>
  
  <style>
/* Estilos personalizados */
</style>
  