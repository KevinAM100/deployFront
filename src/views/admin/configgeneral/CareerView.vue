<template>
  <div>
    <h1 style="text-align: center;">Lista de Carreras</h1>
    
    <v-container class="table-container">
      <div class="button-with-margin">
        <v-btn
      v-if="careersReady"
      prepend-icon="mdi-plus"
      color="primary"
      style="width: 200px; height: 50px;"
      @click="crearCarrera = true"
    >
      <template v-slot:prepend>
        <v-icon class="white-icon">mdi-plus</v-icon>
      </template>
      Crear Nuevo
    </v-btn>
    <career-form
        v-model:crearCarrera="crearCarrera"
        v-model:name="name"
        v-model:initials="initials"
        v-model:description="description"
        v-model:creationDate="creationDate"
        v-model:area="area"
        @update:name="val => name = val" 
        @update:initials="val => initials = val" 
        @update:description="val => description = val" 
        @update:area="val => area = {id: val}" 
        :onSaved="reloadTable"
        @close-dialog="crearCarrera = false"
      ></career-form>

    <delete-career
      v-model:eliminarCarrera="eliminarCarrera"
        :deleteCareerId="deleteCareerId"
      @close-deleteDialog="updateDeleteCareer"
    ></delete-career>    
  </div>    
      <v-data-table
      v-if="careersReady"
    :headers="headers"
    :items="formatCareers(careerStore.careers)"
    density="compact"
    :sort-by="[{ key: 'id', order: 'asc' }]"
     >
     <template v-slot:[`item.actions`]="{ item }">
      <v-row justify="space-around">
          <v-btn variant="text" class="botones-tabla-btn">
            <svg-icon type="mdi" :path="icon2"></svg-icon>
            MALLAS CURRICULARES
          </v-btn>
          <v-btn variant="text" class="botones-tabla-btn"  @click="editCareerSetId(item.id)">
          <svg-icon type="mdi" :path="icon1"></svg-icon>
          Editar  
          </v-btn> 
          <v-btn variant="text" class="botones-tabla-btn"  @click="deleteCareerSetId(item.id)">
          <svg-icon type="mdi" :path="icon3"></svg-icon>
            Eliminar
          </v-btn>
        </v-row> 
    </template>
  </v-data-table>
  <div v-else>
        <p>No Seleccionaste ningun Area aun, No tenemos carreras que mostrarte</p>
  </div>
    <edit-career
  v-model:editCareer="editCareer"
  :editCareerId="editCareerId"
  @close-dialogEdit="updateEditCareer"
  :onSaved="reloadTable"
></edit-career>
  </v-container>
  </div>
</template>
<script setup>
import { ref, onMounted, watch} from 'vue';
import { useMainStore,sharedReload } from '@/stores/MainStore';
import { useCareerStore } from '@/stores/admin/configgeneral/careerStore';
import { useAreaStore } from '@/stores/admin/configgeneral/areaStore';
import CareerForm from '@/components/app/CareerForm.vue';
import EditCareer from '@/components/app/EditCareer.vue';
import DeleteCareer from '@/components/app/DeleteCareer.vue';
import {
  mdiSquareEditOutline,
  mdiFileDocumentOutline,
  mdiTrashCanOutline,
} from '@mdi/js';

const mainStore = useMainStore();
const careerStore = useCareerStore();
const areaStore = useAreaStore();
const icon1 = mdiSquareEditOutline;
const icon2 = mdiFileDocumentOutline;
const icon3 = mdiTrashCanOutline;
const areasSelect = ref([]);
const crearCarrera = ref(false);
const eliminarCarrera = ref(false);
const editCareer = ref(false);
const formattedCareers = ref([]);
const careersReady = ref(false);
const editCareerId = ref(0);
const deleteCareerId = ref(0);
const careers = ref([]);

const headers = [
{ title: 'Id', align: 'start', key: 'id' },
  { title: 'Nombre', align: 'start', key: 'name' },
  { title: 'Sigla', align: 'start', key: 'initials' },
  { title: 'Fecha Fundación', align: 'start', key: 'creationDate' },
  { title: 'Descrición', align: 'start', key: 'description' },
  { title: 'Acción', align: 'center', sortable: false, key: 'actions' },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; 
}

const editCareerSetId = (areaID) => {
  editCareerId.value = areaID;
  editCareer.value = true;
};

const deleteCareerSetId = (id) => {
  deleteCareerId.value = id;
  eliminarCarrera.value = true;
};

const updateEditCareer = (value) => {
  if (value === false) {
    console.log(editCareer.value);
  }
  editCareer.value = value;
};

const updateDeleteCareer = (value) => {
  if (value === false) {
    console.log(eliminarCarrera.value);
  }
  eliminarCarrera.value = value;
};

const formatCareers = (careers) => {
  return careers.map((career) => ({
    ...career,
    creationDate: formatDate(career.creationDate),
  }));
};

async function reloadTable() {
  const newAreaId = mainStore.area.areaId;
  if (newAreaId !== null) {
    await careerStore.getCareers(newAreaId);
    careers.value = careerStore.careers;
    formattedCareers.value = careers.value.map((career) => ({
      ...career,
      creationDate: formatDate(career.creationDate),
    }));
    careersReady.value = true;
  }
}

watch(
  () => mainStore.area.areaId,
  async (newAreaId) => {
    if (newAreaId !== null) {
      await reloadTable();
    } 
  }
);

onMounted(async () => {
  await areaStore.getAreas();
  areasSelect.value = areaStore.areas.map((area) => ({
    id: area.id,
    name: area.name,
  }));
  await reloadTable();
});



</script>

<style scoped>

  .table-container {
    margin: 10px auto; 
    max-width: 1500px;
  }

.white-icon {
    color: white !important;
  }
  .button-with-margin {
    margin-right: 20px;
    margin-bottom: 20px;
    text-align: right;
  }
  .table-container {
    margin: 10px auto; 
    max-width: 1500px;
  }
</style>

