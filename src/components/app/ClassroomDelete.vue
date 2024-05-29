<script setup>
import {getCurrentInstance, ref, watch} from 'vue'
  import {useClassroomStore} from "@/stores/admin/configgeneral/classroomStore.js";
  import {useMainStore} from "@/stores/MainStore.js";

  const props=defineProps(['deleteClassroom', 'deleteClassroomId'])
  const mainStore= useMainStore()
  const classroomStore=useClassroomStore()
  const deleteClassroom = ref(props.deleteClassroom)
  const {emit}=getCurrentInstance()
  // const dialog=ref(false)
  const deleteClassroomVisible=ref(props.deleteClassroom)

  watch(()=> props.deleteClassroom, (newValue)=>{
    deleteClassroomVisible.value=newValue
  })

  const closeDeleteDialog = () =>{
    emit('close-deleteDialog', false)
  }

const deleteClassroomById = async (classroomId) => {
  try {
    // Validar classroomId aquí, si es necesario
    await classroomStore.deleteClassroomById(classroomId);
    //console.log(`Classroom with ID ${classroomId} deleted successfully`);
    useClassroomStore().getClassrooms(mainStore.area.areaId)
    emit( 'close-deleteDialog', false )
  } catch (error) {
    console.error(`Error deleting classroom: ${error.message}`);
    // Manejar el error de manera adecuada, como informar al usuario o revertir la operación
  }
}
</script>

<template>
    <v-dialog
        v-model="deleteClassroomVisible"
        @update:modelValue="$emit('update:deleteClassroom', $event)"
        width="500"
    >
      <v-card min-height="150">
        <v-card-title class="font-weight-bold mx-auto my-auto " >
          ¿Está seguro de que desea elimina el aula?
        </v-card-title>
        <v-card-actions class="mx-auto">
          <v-btn
              class="font-weight-bold"
              color="blue"
              variant="text"
              @click="closeDeleteDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
              class="font-weight-bold"
              color="blue"
              variant="text"
              @click="deleteClassroomById(deleteClassroomId)"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<style scoped>

</style>