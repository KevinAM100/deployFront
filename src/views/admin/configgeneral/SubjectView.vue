<script setup>
import {onMounted, ref, watch} from "vue";
import { useMainStore } from '@/stores/MainStore';
import { useSubjectStore } from '@/stores/admin/configgeneral/subjectStore';
import { useAreaStore } from '@/stores/admin/configgeneral/areaStore';
import SubjectForm from '@/components/app/SubjectForm.vue';
import SubjectEdit from '@/components/app/SubjectEdit.vue';
import SubjectDelete from '@/components/app/SubjectDelete.vue';

const mainStore = useMainStore()
const subjectStore = useSubjectStore()
const areaStore = useAreaStore()

const createSubject = ref(false)
const editSubject = ref(false)
const deleteSubject = ref(false)
const editSubjectId = ref(0)
const deleteSubjectId = ref(0)
const subjects = ref([])
const subjectsReady = ref(false)

const setEditSubjectSetId = (areaID) => {
  editSubjectId.value = areaID
  editSubject.value = true
}

const setDeleteSubjectId = (id) => {
  deleteSubjectId.value = id
  deleteSubject.value = true
}

const updateEditSubject = (value) => {
  if (value === false) {
  }
  editSubject.value = value
}

const updateDeleteSubject = (value) => {
  if (value === false) {
  }
  deleteSubject.value = value
}

const reloadTable = async () => {
  await subjectStore.getSubjects(mainStore.area.areaId)
  subjectsReady.value = true
}

const headers = [
  { title: 'Id', align: 'start', key: 'id' , style: 'font-weight: bold;' },
  { title: 'Nombre', align: 'start', key: 'name',  style: 'font-weight: bold;'  },
  { title: 'Sigla', align: 'start', key: 'initials' ,style: 'font-weight: bold;'},
  { title: 'Acción', align: 'center', sortable: false, key: 'actions' },
];

watch(
  () => mainStore.area.areaId,
  async (newAreaId) => {
    if (newAreaId !== null) {
      await subjectStore.getSubjects(newAreaId);
      subjects.value = subjectStore.subjects;
      subjectsReady.value = true;
    }
  }
);

onMounted(async () => {
  const initialAreaId = mainStore.area.areaId;
  if (initialAreaId !== null) {
    await subjectStore.getSubjects(initialAreaId);
    subjects.value = subjectStore.subjects;
    subjectsReady.value = true;
  }
});

</script>

<template>
  <v-container>
    <v-card class="pa-4 mx-auto">
      <v-card-title class="font-weight-bold text-center text-h6 text-md-h5 text-lg-h4 border-0">
        Lista de Asignaturas
      </v-card-title>
      <v-row>
        <v-col align="end">
          <v-btn
              v-if="subjectsReady"
              prepend-icon="mdi-plus"
              color="primary"
              style="width: 200px; height: 50px;"
              @click="createSubject = true"
              class="text-h9 text-md-h7 text-lg-h6"
          >
            <template v-slot:prepend>
              <v-icon color="white">mdi-plus</v-icon>
            </template>
            Crear Nuevo
          </v-btn>
          <subject-form
              v-model:createSubject="createSubject"
              @update:name="value=>name=value"
              @update:initials="value=>initials=value"
              @update:area="value=>area=value"
              :onSaved="reloadTable"
              @close-dialog="createSubject = false"
          ></subject-form>

          <subject-delete
              v-model:deleteSubject="deleteSubject"
              :deleteSubjectId="deleteSubjectId"
              @close-deleteDialog="updateDeleteSubject"
          ></subject-delete>

          <subject-edit
              v-model:editSubject="editSubject"
              :editSubjectId="editSubjectId"
              @close-dialogEdit="updateEditSubject"
              :onSaved="reloadTable"
          ></subject-edit>

        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
              v-if="subjectsReady"
              :headers="headers"
              :items="subjectStore.subjects.map((item, index) => ({...item, index:index + 1}))"
              density="compact"
              :sort-by="[{ key: 'id', order: 'asc' }]"
              class="pa-2 ma-2 v-card--border text-h9 text-md-h7 text-lg-h6"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-row justify="space-around">
                <v-btn variant="text" class="botones-tabla-btn text-md-h7 text-lg-h6"  @click="setEditSubjectSetId(item.id)">
                  <v-icon icon="mdi-pencil"></v-icon>
                  Editar
                </v-btn>
                <v-btn variant="text" class="botones-tabla-btn text-md-h7 text-lg-h6"  @click="setDeleteSubjectId(item.id)">
                  <v-icon icon="mdi-delete"></v-icon>
                  Eliminar
                </v-btn>
              </v-row>
            </template>
          </v-data-table>
          <v-alert-title v-else>
            <p>No Seleccionaste ningun Area aun, No tenemos Asignaturas que mostrarte.</p>
          </v-alert-title>
        </v-col>
      </v-row>
    </v-card>
  </v-container>

</template>

<style scoped>

</style>