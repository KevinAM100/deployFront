<script setup>
import { ref } from 'vue';

const tab = ref('option-1');
const desserts = [{n:1, manage:'1/2024', careers:'Ingenieria de Sistemas', dateMatricula:[{start:'12/02/2024', end:'24/02/2024'}], amountMatricula:15.0}];
const headers= [
  { title: 'N°', align: 'start', key: 'number' },
  { title: 'Nombre', align: 'start', key: 'name' },
  { title: 'Sigla', align: 'start', key: 'initial' },
  { title: 'Nivel', align: 'start', key: 'level' },
  { title: 'Electiva', align: 'start', key: 'elective' },
  { title: 'Opciones', align: 'start', key: 'actions' },
]

const listSubjects=[
  {number:1, name:'Introducción a la Programacion',initial:'Intro', level:'A', elective:'NO'},
  {number:2, name:'Elementos de la  Programacion',initial:'EP', level:'B', elective:'NO'},
  {number:3, name:'Base de Datos 1',initial:'BD1', level:'C', elective:'NO'},]
const nextTab = () => {
  if (tab.value === 'option-1') {
    tab.value = 'option-2';
  } else if (tab.value === 'option-2') {
    tab.value = 'option-3';
  }
  // Puedes agregar más condiciones si tienes más pestañas
}
</script>

<template>
    <v-container>
      <v-card max-width="1200" variant="flat" class="mx-auto my-16">
      <v-tabs
        v-model="tab"
        align-tabs="center"
        bg-color="#001E89"
        slider-color="blue-lighten-5"
      >
        <v-tab value="option-1">
          PASO 1 - PAGAR MATRICULA
        </v-tab>
        <v-tab value="option-2">
          PASO 2 - OBTENER CODIGO
        </v-tab>
        <v-tab value="option-3">
          PASO 3 - INSCRIPCIÓN DE MATERIAS
        </v-tab>
      </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="option-1">
            <v-card flat>
              <v-card-text>
                <p class="font-weight-bold text-h6 text-center my-5">PAGAR MATRÍCULA</p>
                <v-table>
                  <thead>
                  <tr>
                    <th class="text-left">
                      N°
                    </th>
                    <th class="text-left">
                      Gestión
                    </th>
                    <th class="text-left">
                      Carrera
                    </th>
                    <th class="text-left">
                      Fecha compra matrícula
                    </th>
                    <th class="text-left">
                      Monto
                    </th>
                    <th class="text-left">
                      Pagar matricula
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                    v-for="item in desserts"
                    :key="item.n"
                  >
                    <td>{{ item.n }}</td>
                    <td>{{ item.manage }}</td>
                    <td>{{ item.careers }}</td>
                    <td>
                      <p>{{ "Desde: "+item.dateMatricula[0].start}}</p>
                      <p>{{" Hasta: "+ item.dateMatricula[0].end}}</p>
                    </td>
                    <td>{{ item.amountMatricula }} Bs.</td>
                    <td><v-btn color="#001E89">pagar</v-btn></td>
                  </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item value="option-2">
            <v-card flat>
              <v-card-text>
                <p class="font-weight-bold text-h5 text-center my-5">OBTENER CODIGO DE ACCESO</p>
                <v-row justify="center" class="my-4">
                    <v-btn color="#001E89" width="280" height="110">
                      <p class="font-weight-regular text-h6 ">ENVIAR A CORREO</p>
                    </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item value="option-3">
            <v-card flat>
              <v-card-text>
                <p class="font-weight-bold text-h6 text-center my-5">INSCRIPCIÓN DE MATERIAS</p>
                <v-data-table
                  :headers="headers"
                  :items="listSubjects"
                  density="compact"
                  item-key="name"
                >
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-row justify="space-around">
                      <v-btn color="#001E89" class="my-4">
                        INSCRIBIRSE
                      </v-btn>
                    </v-row>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>
  <v-btn @click="nextTab" :disabled="tab === 'option-3'">Siguiente</v-btn>

</template>

<style scoped>

</style>