<script setup>
import {onMounted, ref, watch} from 'vue'
import {useRoute} from "vue-router";
import {useSubjectStore} from "@/stores/admin/configgeneral/subjectStore.js";
import {useClassroomStore} from "@/stores/admin/configgeneral/classroomStore.js";
import {useItineraryGroupStore} from "@/stores/admin/schedule/groupItineraryStore.js";
import {useItineraryStore} from "@/stores/admin/schedule/itineraryStore.js";
import {useItineraryScheduleStore} from "@/stores/admin/schedule/scheduleItineraryStore.js"
import AxiosAM from "@/services/AxiosAM.js";

const route = useRoute();
const subjectStore=useSubjectStore()
const classroomStore = useClassroomStore()
const itineraryGroupStore = useItineraryGroupStore()
const itineraryStore=useItineraryStore()
const itineraryScheduleStore=useItineraryScheduleStore()
const form = ref(null);

const dialogVisible = ref(false);
const selectedOption = ref('option3');

//espero que terminara service de professor en backend
//puedes crear dos filas en tabla de professor en BD
const professor =ref([
    {id:1, name:'BORIS CALANCHA NAVIA'},
    {id:2, name:'LETICIA BLANCO COCA'}
])

const Days=ref([
    {name:'LUNES', nameEng:'MONDAY'},
    {name:'MARTES',nameEng:'TUESDAY'},
    { name:'MIERCOLES',nameEng:'WEDNESDAY' },
    { name:'JUEVES', nameEng:'THURSDAY'},
    { name:'VIERNES', nameEng:'FRIDAY'},
    { name:'SABADO', nameEng:'SATURDAY' },
    { name:'DOMINGO', nameEng:'SUNDAY' }
])
const headers = ref([
  { title: 'Dia', value: 'dayOfWeek', align: 'center' },
  { title: 'Horario Inicio',align:'start', key: 'startTime' , style: 'font-weight: bold;'},
  { title: 'Horario Fin',align:'start', key: 'endTime' },
  { title: 'Aula',align:'start', key: 'classroomName' },
  { title: 'Docente',align:'start', key: 'professorFullName' },
  { title: 'Opcion', align:'center' ,sortable: false, key: 'actions' }
])

const subjectId = ref(1)
const curriculumId = ref(1)
const careerId = ref(null)
const itineraryId=ref(null)
const areaID = ref(null)
const selectedSubject = ref(null)
const identGroup=ref('')
const remark=ref('')
const suggestIdentifier = ref(null)

const dayOfWeek=ref('')
const startTime=ref('')
const endTime=ref('')
const professorId=ref(null)
const assistant=ref(null)
const classroomId=ref(null)

const IsCreatedGroup=ref(true)
const stateBack=ref(false)
const stateSC=ref(true)

const { getSuggestedIdentifier } = useItineraryGroupStore()

areaID.value=route.params.areaId
careerId.value=route.params.careerId
itineraryId.value=route.params.itineraryId

const listSchedule = ref([])
const lastId=ref(null)

watch(() => subjectStore.subjects, (subjects) => {
  if (subjects.length > 0) {
    selectedSubject.value = subjects[0].id;
  }
}, { immediate: true });

onMounted( async ()=>{
  await subjectStore.getSubjects(areaID.value)
  await classroomStore.getClassrooms(areaID.value)
  await itineraryStore.getItineraryById(itineraryId.value)
  await subjectStore.getSubjects(areaID.value)

  const response = await AxiosAM.get(`/admin/areas/${areaID.value}/careers/${careerId.value}/itineraries/${itineraryId.value}/itinerary-groups/suggest-group-identifier?subjectId=1&curriculumId=1`);
  if (response.status === 200 && response.data.suggestedIdentGroup) {
    const suggestedIdentGroup = response.data.suggestedIdentGroup;
    identGroup.value = suggestedIdentGroup;
  } else {
    console.log("Error al obtener nombre sugerido:", response.statusText);
  }

})

watch(selectedSubject, async (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (newValue!== null) {
      const materiaSelecionada = newValue
      suggestIdentifier.value = await getSuggestedIdentifier(areaID.value, careerId.value, itineraryId.value, materiaSelecionada ,curriculumId.value);
    } else {
      suggestIdentifier.value = null;
    }
  }
});

watch(suggestIdentifier, (newValue) => {
  if (newValue !== null) {
    identGroup.value = newValue;
  }
});

const onSubmit = async ()=>{
  const { valid } = await form.value.validate()
  if(valid){
    if(IsCreatedGroup.value){
      const Group={
        itineraryId:itineraryId.value,
        curriculumId:itineraryStore.currentItinerary.curriculumId,
        subjectId:selectedSubject.value,
        identifier:identGroup.value,
        remark:remark.value,
        listSchedule:[{
          dayOfWeek:dayOfWeek.value,
          startTime:startTime.value,
          endTime:endTime.value,
          professorId:professorId.value,
          assistant:assistant.value,
          classroomId:classroomId.value
        }]
      }
      //crear itinerario-grupo
      await itineraryGroupStore.createItineraryGroup(areaID.value,careerId.value,itineraryId.value,Group)
      IsCreatedGroup.value=false
      stateBack.value=true
      selectedOption.value='option3'
      stateSC.value=false

    }else{
      const Schedule={
        dayOfWeek:dayOfWeek.value,
        startTime:startTime.value,
        endTime:endTime.value,
        professorId:professorId.value,
        assistant:assistant.value,
        classroomId:classroomId.value,
        groupItineraryId:lastId.value
      }
      //crear horario con id de itinerario-grupo
      await itineraryScheduleStore.createItinerarySchedule(lastId.value,Schedule)
      selectedOption.value='option3'
    }
    cleanDialog()
    closeDialog();

    //si hay error porque la materia no es de la carrera
    if(itineraryGroupStore.statusGet){
      const response = await  itineraryGroupStore.getInineraryGroups(careerId.value, itineraryId.value)
      // Ordena los datos por ID de manera descendente
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      // Obtiene el último ID
      lastId.value = sortedData[0].id;

      await itineraryGroupStore.getInineraryGroupById(lastId.value)
      listSchedule.value=itineraryGroupStore.currentItineraryGroup.listScheduleDto
    }else{
      // habilita crear itinenary-group y inténtalo
      IsCreatedGroup.value=true
      stateBack.value=false
      stateSC.value=true
      clean()
    }
  }
}

const openDialog = () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  cleanDialog();
};

async function confirmDelete(id){
  await itineraryScheduleStore.deleteItinerarySchedule(id)
  await itineraryGroupStore.getInineraryGroupById(lastId.value);
  listSchedule.value=itineraryGroupStore.currentItineraryGroup.listScheduleDto
}

const cleanDialog=()=>{
  dayOfWeek.value=''
  startTime.value=''
  endTime.value=''
  professorId.value=null
  assistant.value=null
  classroomId.value=null
}
const clean =()=>{
  selectedSubject.value=null
  identGroup.value=''
}
const deleteGroup = async ()=>{
  await itineraryGroupStore.deleteItinerarGroup(lastId.value)
  selectedSubject.value=null
  identGroup.value=''
  listSchedule.value=[]
  stateBack.value=false
  IsCreatedGroup.value=true
  stateSC.value=true
}

const formatTime = (time) => {
  if (!time) return 'null';
  const [hours, minutes] = time;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
const changeDayOfWeek= (dayOfWeek) => changedDayOfWeek[dayOfWeek] || dayOfWeek;
  const changedDayOfWeek = {
    MONDAY: 'LU',
    TUESDAY: 'MA',
    WEDNESDAY: 'MA',
    THURSDAY: 'JU',
    FRIDAY: 'VI',
    SATURDAY: 'SA',
    SUNDAY: 'DO',
  }

const typeRules = [
  (value) => {
    if (!value) {
      return 'This is required.'
    } else {
      return true
    }
  },
]
</script>

<template>
  <v-card
  class="mx-auto my-16"
  min-width="1000"
  max-width="700"
>
    <div class="d-flex flex-row-reverse">
    <v-btn
      class="mx-10"
      color="primary"
      width="200"
      height="50"
      :disabled="stateBack"
      :to="'/admin/areas/'+areaID+'/careers/'+careerId+'/itineraries/'+itineraryId+'/edit'">
      <<< volver
    </v-btn>
    </div>
    <p class="text-center text-h5 font-weight-bold my-4" >
      Crear Grupo
    </p>
    <v-card >
      <v-row class="mx-auto my-1">
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
          <v-select
              v-model="selectedSubject"
              :items="subjectStore.subjects"
              label="Asignatura *"
              :item-title="'name'"
              :item-value="'id'"
              variant="outlined"
          ></v-select>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
          <v-text-field
              v-model="identGroup"
              label="Identificador de Grupo *"
              variant="outlined"
              class="mx-4"
          ></v-text-field>
        </v-col>

      </v-row>
  <v-card-text>
    <v-dialog v-model="dialogVisible" persistent class="mx-auto my-16"
              min-width="500"
              max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-h5">Añadir Itinerario</span>
        </v-card-title>
        <v-form ref="form" @submit.prevent="onSubmit">
          <v-card-text>
            <v-container>
              <v-select
                  v-model="remark"
                  label="Periodo"
                  :items="['plan nuevo 2021', 'plan nuevo 2022', 'plan nuevo 2023']"
                  variant="outlined"
              ></v-select>
              <v-row>
                <v-col>
                  <v-select
                      v-model="dayOfWeek"
                      label="Dia *"
                      :items=Days
                      :item-title="'name'"
                      :item-value="'nameEng'"
                      variant="outlined"
                      :rules="typeRules"
                  ></v-select>
                </v-col>
                <v-col>
                  <v-text-field
                      v-model="startTime"
                      label="Hora inicio *"
                      type="time"
                      suffix="hrs"
                      variant="outlined"
                      :rules="typeRules"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                      v-model="endTime"
                      label="Hora fin *"
                      type="time"
                      suffix="hrs"
                      variant="outlined"
                      :rules="typeRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <p class="my-4">Seleccione una opción</p>
              <v-radio-group inline v-model="selectedOption">
                <v-radio label="Docente" value="option1" class="mx-4"></v-radio>
                <v-radio label="Asistente" value="option2" class="mx-4"></v-radio>
                <v-radio label="Por designar" value="option3"  class="mx-4"></v-radio>
              </v-radio-group>
              <div v-if="selectedOption==='option2'">
                <v-text-field
                    v-model="assistant"
                    label="Asistente"
                    variant="outlined"
                ></v-text-field>
              </div>
              <div v-else>
                <v-select
                    v-model="professorId"
                    label="Docente"
                    :item-title="'name'"
                    :item-value="'id'"
                    :items="professor"
                    :disabled="selectedOption === 'option3'"
                    variant="outlined"
                ></v-select>
              </div>
              <v-select
                  v-model="classroomId"
                  label="Aula *"
                  :items="classroomStore.classrooms"
                  :item-title="'name'"
                  :item-value="'id'"
                  :rules="typeRules"
                  variant="outlined"
              ></v-select>

            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="closeDialog"> Cancelar </v-btn>
            <v-btn type="submit" color="blue-darken-1" variant="text"> Añadir </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-data-table
        :headers="headers"
        :items="listSchedule"
        density="compact"
        item-key="name">
      <template v-slot:item.dayOfWeek="{ item }">
        {{ changeDayOfWeek(item.dayOfWeek) }}
      </template>
      <template v-slot:item.startTime="{ item }">
        {{ formatTime(item.startTime) }}
      </template>
      <template v-slot:item.endTime="{ item }">
        {{ formatTime(item.endTime) }}
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Horario</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openDialog" :disabled="identGroup===''">
            Nuevo
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-row justify="space-around">
          <v-btn variant="text" >
            <v-icon icon="mdi-close-circle-outline" color="red" @click="confirmDelete(item.id)"></v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-table>
  </v-card-text>
    </v-card>
    <v-form ref="form" @submit.prevent="onSubmit">
    <v-row justify="end" class="my-2">
      <v-col cols="3">
        <v-btn
            class="mx-4"
            color="primary"
            width="200"
            height="50"
            :disabled="stateSC"
            @click="deleteGroup"
        >
          Cancelar
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn
            class="mx-4"
            color="primary"
            width="200"
            height="50"
            :disabled="stateSC"
            :to="'/admin/areas/'+areaID+'/careers/'+careerId+'/itineraries/'+itineraryId+'/edit'"
        >
          Guardar
        </v-btn>
      </v-col>
    </v-row>
    </v-form>
</v-card>

</template>

<style scoped>

</style>