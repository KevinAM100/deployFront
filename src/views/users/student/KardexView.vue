<script setup>

const headers= [
  { title: 'N°', align: 'start', key: 'number' },
  { title: 'Año', align: 'start', key: 'anio' },
  { title: 'Periodo Académico', align: 'center', key: 'period' },
  { title: 'Materia', align: 'start', key: 'subject' },
  { title: 'Nivel', align: 'start', key: 'level' },
  { title: 'Grupo', align: 'start', key: 'group' },
  { title: 'T1', align: 'start', key: 'first_t' },
  { title: 'T2', align: 'start', key: 'second_t' },
  { title: 'T3', align: 'start', key: 'third_t' },
  { title: 'EF', align: 'start', key: 'final_exam' },
  { title: '2da', align: 'start', key: 'second_ins' },
  { title: 'Nota Final', align: 'start', key: 'final_note' },
  { title: 'Estado', align: 'start', key: 'status' }
]

const listSubjects=[
  {number:1, anio:'2024',period:'1', subject:'Introducción a la Programacion', level:'A', group:1, first_t:80, second_t:80, third_t:'', final_exam:51, second_ins:'', final_note:80,status:'Aprobado'},
  {number:1, anio:'2024',period:'1', subject:'Calculo I', level:'A', group:5, first_t:52, second_t:50, third_t:10, final_exam:10, second_ins:15, final_note:15,status:'Reprobado'},
  {number:1, anio:'2024',period:'1', subject:'Calculo II', level:'B', group:2, first_t:52, second_t:20, third_t:12, final_exam:20, second_ins:51, final_note:51,status:'Aprobado'},
]
</script>

<template>
  <v-container>
    <p class="font-weight-bold text-h4 text-center my-8">KARDEX</p>
    <v-card>
      <v-sheet class="mx-4" width="500">
        <v-select
          label="Carrera"
          :items="['Ingenieria de Sistemas', 'Ingenieria Informática']"
          variant="outlined"
          class="my-4 "
        ></v-select>
      </v-sheet>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="listSubjects"
          density="compact"
          item-key="name"
        >

        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>