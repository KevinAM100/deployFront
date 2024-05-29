<script setup>
const daysOfWeek = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];
const hoursOfDay = ["06:45 - 8:15","8:15 - 9:45","9:45 - 11:15", "11:15 - 12:45", "12:45 - 14:15", "14:15 - 15:45",];

</script>

<template>
  <v-container>
    <p class="font-weight-bold text-h4 text-center my-8">HORARIO DE CLASES</p>
    <v-card max-width="1500" class="mx-auto my-16" variant="flat">
      <v-row
        no-gutters
      >
        <v-col
          md="6"
          sm="5"
        >
          <v-sheet class="pa-2 ma-2">
            <v-select
              label="Gestión*"
              :items="['2023', '2024']"
              variant="outlined"
            ></v-select>
          </v-sheet>
        </v-col>
        <v-col
          md="6"
          sm="5"
        >
          <v-sheet class="pa-2 ma-2" >
            <v-select
              label="Período Académico*"
              :items="['1 - Primer Semestre', '2 - Segundo Semestre', '3 - Verano', '4 - Invierno']"
              variant="outlined"
            ></v-select>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col
          md="6"
          sm="5"
        >
          <v-sheet class="pa-2 ma-2" >
            <v-select
              label="Carrera"
              :items="['Ingenieria de Sistemas', 'Ingenieria Informática']"
              variant="outlined"
            ></v-select>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2"></v-col>
        <v-col v-for="(day, index) in daysOfWeek" :key="index" cols="2">
          <v-card color="#001E89">

            <v-card-title><p class=" text-center">{{ day }}</p></v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-for="(hour, index) in hoursOfDay" :key="index">
        <v-col cols="2">
          <v-card variant="outlined">
            <v-card-title><p class=" text-center">{{ hour }}</p></v-card-title>
          </v-card>
        </v-col>
        <v-col v-for="(day, index) in daysOfWeek" :key="index" cols="2">
          <v-card>
            <v-card-text>
              <!-- Contenido de las clases aquí -->
<!--              <p class="text-center"> Test Materia</p>-->
<!--              <v-card-subtitle>-->
<!--                <p class="text-center my-4" > 630A - G:1</p>-->
<!--              </v-card-subtitle>-->
            </v-card-text>

          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>