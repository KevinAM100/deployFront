<script setup>
import firstPhoto from '@/assets/AM_assets/foto1.jpg';
</script>

<template>
  <v-parallax
    height="300"

    :style="{ backgroundImage: `url(${firstPhoto})` }"
  >
    <div class="d-flex flex-column fill-height justify-center align-center text-white">
      <div class="text-h1 font-weight-bold">UNIVERSIDAD MAYOR DE SAN SIMÓN</div>
    </div>
  </v-parallax>
  <v-container>
    <v-row class="mx-auto my-5">
      <v-col
        cols="12"
        sm="6"
        md="6"
      >
        <v-card variant="flat">
          <v-card-title class="font-weight-bold text-h4 text-center my-3">ANUNCIOS IMPORTANTES</v-card-title>
          <v-col>
            <v-row
              rows="12"
              sm="3"
              md="3"
            >
              <v-card
                variant="outlined"
                min-width="700"
                max-width="700"
                min-height="120"
                class="mx-auto my-2"
              >
                <v-card-title class="font-weight-bold">INICIO DE INSCRIPCIONES</v-card-title>
                <v-card-text>Las inscripciones empiezan el 12 de enero y terminan el 24 de febrero</v-card-text>
              </v-card>
            </v-row>
            <v-row
              rows="12"
              sm="3"
              md="3"
            >
              <v-card
                variant="outlined"
                min-width="700"
                max-width="700"
                min-height="120"
                class="mx-auto my-2"
              >
                <v-card-title class="font-weight-bold" >VENTAS DE MATRICULAS</v-card-title>
                <v-card-text>La compra de matriculas estará disponible desde el apartado de la pagina y en las ventanillas de la caja de la Facultad</v-card-text>
              </v-card>
            </v-row>
            <v-row
              rows="12"
              sm="3"
              md="3"
            >
              <v-card
                variant="outlined"
                min-width="700"
                max-width="700"
                min-height="120"
                class="mx-auto my-2"
              >
                <v-card-title class="font-weight-bold">MANTENIMIENTO</v-card-title>
                <v-card-text>El dia 24 de febrero se realizará el mantenimiento de la pagina por lo que se recomienda tomar precauciones</v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="6"
      >
        <v-card variant="outlined">
          <v-card-title class="font-weight-bold text-h4 text-center my-3">ACCESO RÁPIDOS</v-card-title>
          <v-col>
            <v-row
              rows="12"
              sm="3"
              md="3"
            >
              <v-card
                variant="tonal"
                rel="noopener"
                target="_blank"
                to="/student/kardex"
                min-width="700"
                max-width="700"
                min-height="120"
                class="mx-auto my-2"
              >
                <v-card-title class="font-weight-bold">Kardex</v-card-title>
                <v-card-text>Materias cursadas</v-card-text>
                <div class="d-flex flex-row-reverse mx-5">
                  <v-icon>mdi-open-in-new</v-icon>
                </div>
              </v-card>
            </v-row>
            <v-row
              rows="12"
              sm="3"
              md="3"
            >
              <v-card
                variant="tonal"
                rel="noopener"
                target="_blank"
                to="/student/matriculation"
                min-width="700"
                max-width="700"
                min-height="120"
                class="mx-auto my-2"
              >
                <v-card-title class="font-weight-bold" >Inscripcion</v-card-title>
                <v-card-text>Inscripción de materias para gestion actual</v-card-text>
                <div class="d-flex flex-row-reverse mx-5">
                  <v-icon>mdi-open-in-new</v-icon>
                </div>
              </v-card>
            </v-row>
            <v-row
              rows="12"
              sm="3"
              md="3"
            >
              <v-card
                variant="tonal"
                rel="noopener"
                target="_blank"
                to="/student/class-schedule"
                min-width="700"
                max-width="700"
                min-height="120"
                class="mx-auto my-2"
              >
                <v-card-title class="font-weight-bold">Horario de clases</v-card-title>
                <v-card-text>Visualización de horarios de la gestión actual</v-card-text>
                <div class="d-flex flex-row-reverse mx-5">
                  <v-icon>mdi-open-in-new</v-icon>
                </div>
              </v-card>
            </v-row>
          </v-col>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<style scoped>

</style>