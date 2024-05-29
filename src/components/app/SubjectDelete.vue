<script setup>
import { getCurrentInstance, ref, watch, } from 'vue'
import { useSubjectStore } from '@/stores/admin/configgeneral/subjectStore'
import { useMainStore } from '@/stores/MainStore.js'

const props = defineProps(['deleteSubject', 'deleteSubjectId'])
const mainStore = useMainStore()
const subjectStore = useSubjectStore()
const deleteSubject = ref(props.deleteSubject)
const { emit } = getCurrentInstance()
const deleteSubjectVisible = ref(props.deleteSubject)

watch(() => props.deleteSubject, (newValue) => {
  deleteSubjectVisible.value = newValue
})

const closeDeleteDialog = () => {
  emit('close-deleteDialog', false);
};

const deleteSubjectById = async (subjectId) => {
  try {
    // Validar subjectId aquí, si es necesario
    await subjectStore.deleteSubjectById(subjectId);
    useSubjectStore().getSubjects(mainStore.area.areaId)
    emit( 'close-deleteDialog', false)
  } catch (error){
    console.error(`Error deleting classroom: ${error.message}`);
    // Manejar el error de manera adecuada, como informar al usuario o revertir la operación
  }
}

const getSubjectName = (subjectId) => {
  const subject = subjectStore.subjects.find(subject => subject.id === subjectId);
  return subject ? subject.name : '';
};

</script>

<template>
  <v-dialog v-model="deleteSubjectVisible"
            @update:modelValue="$emit('update:eliminarAsignatura', $event)"
            width="500"
  >
    <v-card class="card-delete-style align-content-center mx-auto"
            min-height="150"
    >
      <v-alert-title class="font-weight-bold text-center mx-auto my-auto pa-3 ma-3">
        ¿Está seguro de que desea eliminar la asignatura ?
      </v-alert-title>
      <v-alert-title class="font-weight-bold mx-auto my-auto pa-3 ma-3" >
        {{ getSubjectName(deleteSubjectId) }}
      </v-alert-title>

      <v-card-actions class="mx-auto">
        <v-btn
               class=" font-weight-bold "
               variant="tonal"
               color="blue"
               dark @click="closeDeleteDialog"
        >
          Cancelar
        </v-btn>
        <v-btn type="submit"
               class=" font-weight-bold "
               variant="tonal"
               color="blue"
               @click="deleteSubjectById(deleteSubjectId)"
        >
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>