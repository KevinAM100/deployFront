<script setup>
import { onMounted, ref } from 'vue'
import { useItineraryGroupStore} from '@/stores/admin/schedule/groupItineraryStore.js'
import {useMainStore} from '@/stores/MainStore.js'
import { useRoute } from 'vue-router';
import { useItineraryStore } from '@/stores/admin/schedule/itineraryStore.js'
const route = useRoute();

const itineraryGroupStore = useItineraryGroupStore()
const itineraryStore=useItineraryStore()
const mainStore=useMainStore()

const careerId = ref(null)
const itineraryId=ref(null)
const careerName =ref(null)
const itineraryName= ref(null)

const sortBy=ref([{ key: 'id', order: 'desc' }])
const headers = ref([
  { title: 'N°',  align: 'center', key: 'id' },
  { title: 'Nombre Asignatura',align:'start', key: 'subjectName' , style: 'font-weight: bold;'},
  { title: 'Grupo',align:'start', key: 'groupIdentifier' },
  { title: 'Horario',align:'start', key: 'listScheduleDto' },
  { title: 'Aula',align:'start', key: 'listScheduleDto' },
  { title: 'Docente Designado',align:'start', key: 'listScheduleDto' },

]);

onMounted( async () =>{
  careerId.value = route.params.careerId
  itineraryId.value= route.params.itineraryId


  await itineraryStore.getItineraryById(itineraryId.value)
  await itineraryGroupStore.getInineraryGroups(careerId.value,itineraryId.value)

  careerName.value=itineraryStore.currentItinerary.careerName
  itineraryName.value=itineraryStore.currentItinerary.name

})
const formatTime = (time) => {
  if (!time) return 'null';
  const [hours, minutes] = time;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const changedDayOfWeek = {
  MONDAY: 'LU',
  TUESDAY: 'MA',
  WEDNESDAY: 'MA',
  THURSDAY: 'JU',
  FRIDAY: 'VI',
  SATURDAY: 'SA',
  SUNDAY: 'DO',
};

const changeDayOfWeek= (dayOfWeek) => changedDayOfWeek[dayOfWeek] || dayOfWeek;
</script>

<template>

  <v-card
    class="mx-auto my-16"
    min-width="1000"
    max-width="1300"
  >
    <p class="mx-10 my-4">Carrera: {{ careerName }}</p>
    <p class="text-center text-h5 font-weight-bold my-4" >
      Itinerario: {{ itineraryName }}
    </p>
    <div class="d-flex flex-row-reverse">
    </div>
  <v-card-text>
    <v-data-table
        v-model:sort-by="sortBy"
        :headers="headers"
        :items="itineraryGroupStore.itineraryGroups"

    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.subjectName }}</td>
          <td>{{ item.groupIdentifier }}</td>

          <td>
            <ul>
              <li v-for="schedule in item.listScheduleDto" :key="schedule.id">
                {{ changeDayOfWeek(schedule.dayOfWeek)}}
                {{ formatTime(schedule.startTime) }} -
                {{ formatTime(schedule.endTime) }}
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li v-for="schedule in item.listScheduleDto" :key="schedule.id">
                {{ schedule.classroomInitials }}
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li v-for="schedule in item.listScheduleDto" :key="schedule.id">
                {{ schedule.professorFullName ? schedule.professorFullName : 'Por designar' }}
              </li>
            </ul>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card-text>
  </v-card>
</template>

<style scoped>

</style>