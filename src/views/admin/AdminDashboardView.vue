<script setup>

import firstPhoto from "@/assets/AM_assets/foto1.jpg";
</script>

<template>
  <v-app>
    <v-parallax class="custom-parallax"
                :style="{ backgroundImage: `url(${firstPhoto})`,backgroundSize: 'cover', backgroundPosition: 'center'}"
    >
      <div class="overlay">
        <div class="d-flex flex-column fill-height justify-center text-white">
          <div class="text-personalized font-weight-bold">UNIVERSIDAD MAYOR DE SAN SIMÓN</div>
        </div>
      </div>
    </v-parallax>
    <div class="dashboard-container">
        <v-row>
          <!--Accesos rapidos-->
          <v-col cols="12" sm="6">
            <v-card class="quick-access-card" variant="outlined">
              <v-card-title class="font-weight-bold custom-tittle-card">ACCESOS RÁPIDOS</v-card-title>
              <v-col >
                <v-row>
                  <v-card class="quick-access-item" variant="tonal" to="/admin/manage-classes"
                          prepend-icon="mdi mdi-file-document-multiple-outline"
                          text="Generar una nueva oferta academica o Editar alguna existente, adiccionando, editando o
eliminando nuevos grupos"
                          title="Gestionar Clases"
                  ></v-card>
                </v-row>
                <v-row>
                  <v-card class="quick-access-item" variant="tonal" to="/admin/careers"
                          prepend-icon="mdi mdi-school-outline"
                          text="Lista de carreras de una Facultad, con la opcion de ver las Mallas Curriculares"
                          title="Carreras"
                  ></v-card>
                </v-row>
                <v-row>
                  <v-card class="quick-access-item" variant="tonal" to="/admin/itinerary"
                          prepend-icon="mdi-invoice-text-clock-outline"
                          text="Listado de los Itinerarios disponibles para la edicion y eliminacion"
                          title="Itinerario de Clases"
                  ></v-card>
                </v-row>
              </v-col>
            </v-card>
          </v-col>
          <!--Anuncios importantes-->
          <v-col cols="12" sm="6">
            <v-card class="quick-access-card" variant="text">
              <v-card-title class="font-weight-bold custom-tittle-card">ANUNCIOS IMPORTANTES</v-card-title>
              <v-col>
                <v-row>
                  <v-card class="card-custom-announcement" variant="outlined">
                    <v-card-title class="font-weight-bold">INICIO DE INSCRIPCIONES</v-card-title>
                    <v-card-text>Las inscripciones empiezan el 12 de enero y terminan el 24 de febrero</v-card-text>
                  </v-card>
                </v-row>
                <v-row>
                  <v-card class="card-custom-announcement" variant="outlined">
                    <v-card-title class="font-weight-bold">VENTAS DE MATRICULAS</v-card-title>
                    <v-card-text>La compra de matriculas estará disponible desde el apartado de la pagina y en las
                      ventanillas de la caja de la Facultad
                    </v-card-text>
                  </v-card>
                </v-row>
                <v-row>
                  <v-card class="card-custom-announcement" variant="outlined">
                    <v-card-title class="font-weight-bold">MANTENIMIENTO</v-card-title>
                    <v-card-text>El dia 24 de febrero se realizará el mantenimiento de la pagina por lo que se recomienda
                      tomar precauciones
                    </v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
    </div>
  </v-app>
</template>

<style scoped>
.custom-tittle-card {
  font-size: 22px;
  text-align: center;
  letter-spacing: -0.5px;
}

.custom-parallax {
  height: 200px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Color negro con 50% de opacidad */
}

.text-personalized {
  font-size: 90px;
  line-height: 1;
  padding-left: 20px;
}
.quick-access-card {
  max-width: 800px;
  margin: 5px;
  padding: 5px;
}
.quick-access-card .quick-access-item {
  margin: 0 25px 10px;
}
.card-custom-announcement {
  margin-bottom: 10px;
}
.dashboard-container {
  padding: 20px;
}
@media screen and (max-width: 768px) {
  .text-personalized {
    font-size: 5vw; /* Tamaño de fuente más grande para pantallas más pequeñas */
    padding-left: 3%;
  }

  .custom-parallax {
    height: 100px; /* Ajusta la altura del parallax para pantallas más pequeñas */
  }
}
</style>
