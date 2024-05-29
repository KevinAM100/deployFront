<script setup>

import { ref, onMounted, watch } from 'vue';
import { useAcademicPeriodStore } from '@/stores/admin/configgeneral/academicPeriodStore.js'
import { useMainStore  } from '@/stores/MainStore'

const academicPeriodStore = useAcademicPeriodStore();
const mainStore = useMainStore();
const formattedAcademicPeriods  = ref([]);
const id = ref('');
const formTitle = ref('');
const showError = ref(false);
const headers = ref([
  { title: 'Nº', align: 'center', sortable: false, key: 'index' }, 
  {
          title: 'Nombre',
          sortable: false,
          key: 'name',
  },
  { title: 'Año', key: 'year' },
  { title: 'Fecha Incio', key: 'startDate' },
  { title: 'Fecha Fin', key: 'endDate'},
  { title: 'Costo Matricula', key:'enrollmentCost'},
  { title: 'Opciones', align: 'center', sortable: false, key: 'actions' }
]);

watch(
  () => mainStore.area.areaId,
  async (newAreaId) => {
    if (newAreaId !== null) {
      await academicPeriodStore.listAcademicPeriodByArea(newAreaId);
      formattedAcademicPeriods.value = academicPeriodStore.academicPeriods;
    }
  }
);

onMounted(async () => {
  await academicPeriodStore.listAcademicPeriodByArea(mainStore.area.areaId);
  formattedAcademicPeriods.value = academicPeriodStore.academicPeriods;
});

const dialog = ref(false);
const dialogDelete = ref(false);
const editIndex = ref(-1);
const editedItem = ref({
  name: '',
  year: 0,
  startDate: '',
  endDate: '',
  enrollmentCost: 0.00,
});
const defaultItem = ref({
  name: '',
  year: 0,
  startDate: '',
  endDate: '',
  enrollmentCost: 0.00,
});

const editItem = (item) => {
  editIndex.value = formattedAcademicPeriods.value.indexOf(item);
  editedItem.value = { ...item };
  formTitle.value = 'Editar Perido Academico';
  dialog.value = true;
};
const crearItem = (item) => {
  showError.value = false;
  editIndex.value = formattedAcademicPeriods.value.indexOf(item);
  editedItem.value = { ...item };
  formTitle.value = 'Añadir Periodo Academico';
  dialog.value = true;
};

const deleteItem = (item) => {
  id.value=item.id;
  editIndex.value = formattedAcademicPeriods.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};

const deleteItemConfirm = () => {
  academicPeriodStore.deleteAcademicPeriod(id.value)
  formattedAcademicPeriods.value.splice(editIndex.value, 1);
  closeDelete();
};

const close = () => {
  dialog.value = false;
  resetEditedItem();
};

const closeDelete = () => {
  dialogDelete.value = false;
  resetEditedItem();
};

const save = () => {
  showError.value = true;
  if (editIndex.value > -1) {
    Object.assign(formattedAcademicPeriods.value[editIndex.value], editedItem.value);
    academicPeriodStore.editAcademicPeriod(editedItem.value, editedItem.value.id);
    close();
  } else {
    if (editedItem.value.name && editedItem.value.year && editedItem.value.startDate && editedItem.value.endDate) {
      academicPeriodStore.createAcademicPeriod(editedItem.value).then(({ success, data }) => {
        if (success) {
          formattedAcademicPeriods.value = academicPeriodStore.academicPeriods;
          showError.value = false;
          close();
        }
      });
    } else {
      console.log("Los Campos estan vacios");
    }
  }
};

const resetEditedItem = () => {
  editedItem.value = { ...defaultItem.value };
  editIndex.value = -1;
  formTitle.value = '';
  id.value= -1;

};

const years = ref([]);
const currentYear = new Date().getFullYear();
const startYear = currentYear - 2;
const endYear = currentYear + 10;

for (let i = startYear; i <= endYear; i++) {
  years.value.push(i);
}

const startDateRules = [
  v => !!v || 'La fecha de fin es obligatoria',
  v => {
    if (!v) return true;
    const pattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (!pattern.test(v)) return 'El formato de la fecha debe ser día/mes/año';
    const [day, month, year] = v.split('/').map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return 'La fecha debe contener solamente números';
    }
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return 'La fecha es inválida';
    }
    return true;
  }
];

const enrollmentCostRules = [
  v => !!v || 'El costo de matrícula es obligatorio',
  v => {
    if (!v) return true; // Si el valor está vacío, no aplica la siguiente regla
    const parsedValue = parseFloat(v);
    if (isNaN(parsedValue)) {
      return 'El costo de matrícula debe ser un número';
    }
    if (parsedValue < 0 || parsedValue > 9999.99) {
      return 'El costo de matrícula debe estar entre 0 y 9999.99';
    }
    const decimalCount = v.split('.')[1]?.length || 0;
    if (decimalCount > 2) {
      return 'El costo de la matrícula debe tener como máximo 2 decimales';
    }
    return true;
  }
];

</script>

<template>

<v-container>    
  <br>  
  <h1 class="text-center">Lista de Peridos Académicos</h1>
  <br> 

  <v-card>
    <v-data-table
      :headers="headers"
      :items="formattedAcademicPeriods"
      :sort-by="[{ key: 'year', order: 'asc' }]"
    >
    
      <template v-slot:top>
        <v-btn
            class="mb-2 ml-auto"
            prepend-icon="mdi-plus"
            color="primary"
            style="width: 200px; height: 50px;"
            @click="crearItem"
          >
            Crear Nuevo
        </v-btn>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-select v-model="editedItem.year" 
                                :items="years"
                                required
                                :error="showError && !editedItem.year"
                                label="Año *"
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.name" required
                                    :error="showError && !editedItem.name" 
                                    label="Nombre *"></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" >
                      <v-text-field  
                        v-model="editedItem.startDate"
                        label="Fecha Inicio *" 
                        required
                        prepend-inner-icon="mdi-calendar"
                        :error="showError && !editedItem.startDate"
                        :rules="startDateRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field  
                        v-model="editedItem.endDate"
                        label="Fecha Fin *" 
                        required
                        prepend-inner-icon="mdi-calendar"
                        :error="showError && !editedItem.endDate"
                        :rules="startDateRules"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field v-model="editedItem.enrollmentCost" required
                                    :error="showError && !editedItem.enrollmentCost"
                                    :rules="enrollmentCostRules"
                                    prefix="Bs."
                                    label="Costo Matricula *"></v-text-field>
                    </v-col>
                  
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">CANCELAR</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">GUARDAR</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
  
          <v-dialog v-model="dialogDelete" max-width="480px">
            <v-card>
              <v-card-title class="text-center text-h5 text-wrap">¿Está seguro de que deseas eliminar el periodo academico?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">CANCELAR</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn variant="text" class="botones-tabla-btn"  @click="editItem(item)">
          <v-icon size="small">mdi-pencil</v-icon>EDITAR
        </v-btn>
        <v-btn variant="text" class="botones-tabla-btn"  @click="deleteItem(item)">
          <v-icon size="small">mdi-delete</v-icon>ELIMINAR
        </v-btn>
      </template>
      <template v-slot:item.enrollmentCost="{ item }">
        Bs. {{ (item.enrollmentCost) }}
      </template>
    
    </v-data-table>
  </v-card>
</v-container>

</template>
<style scoped>

</style>  