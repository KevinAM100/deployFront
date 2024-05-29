<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { useAreaStore } from '@/stores/admin/configgeneral/areaStore.js';
import AreaFormComp from '@/components/admin/configgeneral/AreaFormComp.vue';

const areaStore = useAreaStore();

const headers = ref([
  { title: 'Nombre', align: 'start', key: 'name' },
  { title: 'Sigla', align: 'start', key: 'initials' },
  { title: 'descripción', align: 'start', key: 'description' },
  { title: 'Acciones', align: 'center', sortable: false, key: 'actions' }
]);
const editedIndex = ref(-1);
const area = ref({});
const areaViewRef = ref(null);

const deleteDialog = ref(false);
const deleteMessage = ref('');

const defaultArea = ref({
  id: null,
  name: '',
  initials: '',
  description: ''
});
const emit = defineEmits(['update-areas']);
defineExpose({
  areaViewRef,
});

function dialogFormTitle() {
  return editedIndex.value === -1 ? 'Nueva Facultad' : 'Editar Facultad';
}

function openNewDialog() {
  area.value = defaultArea.value;
  areaStore.dialog = true;
}

function openEditItem(item) {
  editedIndex.value = areaStore.areas.indexOf(item);
  area.value = Object.assign({}, item);
  areaStore.dialog = true;
}

function deleteItem(item) {
  editedIndex.value = areaStore.areas.indexOf(item);
  area.value = Object.assign({}, item);
  deleteMessage.value = `¿Quieres eliminar "${item.name}"?`
  deleteDialog.value = true;
}

async function confirmDelete() {
  await areaStore.deleteArea(area.value);
  closeDeleteDialog();
}

function closeDeleteDialog() {
  deleteDialog.value = false;
  nextTick(() => {
    area.value = Object.assign({}, defaultArea.value);
    editedIndex.value = -1;
  });
}

async function submitArea(area) {
  if (area.id) {
    await areaStore.editArea(area);
  } else {
    await areaStore.createArea(area);
  }
  areaStore.dialog = false;
}

function closeDialog() {
  editedIndex.value = -1;
  areaStore.dialog = false;
}

onMounted(async () => {
  await areaStore.getAreas();
});
</script>

<template>
  <div ref="areaViewRef"> 
    <v-data-table
      :headers="headers"
      :items="areaStore.areas"
      density="compact"
      item-key="name">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Lista de Facultades</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                dark
                class="mb-2"
                v-bind="props"
                @click="openNewDialog">
            Nuevo
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="openEditItem(item)" title="Editar">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item)" title="Eliminar">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>
    <area-form-comp
      :title="dialogFormTitle()"
      :area-obj="area"
      @submit="submitArea"
      @close="closeDialog"
    />
    <v-dialog v-model="deleteDialog" persistent width="350">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>{{deleteMessage}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="closeDeleteDialog">
            CANCEL
          </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="confirmDelete">
            SI
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>