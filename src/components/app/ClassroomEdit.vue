<script setup>
import {getCurrentInstance, reactive, ref, watch} from 'vue'
  import { useClassroomStore } from "@/stores/admin/configgeneral/classroomStore.js";

  const props=defineProps(['editClassroom', 'model', 'editClassroomId', 'onSaved'])
  const { emit } = getCurrentInstance()
  const form = ref(null)
  const editClassroomVisible=ref(props.editClassroom)

  const model = reactive({
    classroom: {
      name: props.model?.name || '',
      initials:props.model?.initials || '',
      type:props.model?.type || '',
      address:props.model?.address || ''
    }
  })

  watch(()=> props.editClassroom, newValue => {
    editClassroomVisible.value=newValue
  })

  watch(()=>props.editClassroomId, newId=>{
    getClassroomById(newId)
  })
  const getClassroomById = async (classroomId)=>{
    await useClassroomStore().getClassroomById(classroomId)
    //console.log('getClassroombyId: '+useClassroomStore().currentClassroom)
    model.classroom= useClassroomStore().currentClassroom
  }
  const closeEditDialog = () =>{
    emit('close-dialogEdit', false)
  }

  const ValidateSaveEdit = async (classroomId) => {
    const { valid }= await form.value.validate()
    if (valid){
      await saveClassroomEdit(classroomId)
      props.onSaved()
      emit('saved')
      emit('close-dialogEdit',false)
    }

  }

  const saveClassroomEdit= async (classroomId) =>{
    await useClassroomStore().saveClassroomEdit(classroomId)
    const currentClassroom= useClassroomStore().currentClassroom
    //console.log(currentClassroom)
    model.classroom=currentClassroom
  }

//Validaciones
const initialsRules = [
  value => {
    if (!value) {
      return 'The initials are required.'
    }
    if (value?.length >= 3 && value?.length <= 10) {
      const specialCharacters = /[!@#$%^&*(),.?":{}|<>\/\\]/
      if (!specialCharacters.test(value)) {
        return true;
      } else {
        return 'The initials cannot contain special characters.'
      }
    } else {
      return 'The initials must have at least 3 characters and at most 10 characters.'
    }
  },
]

const nameRules = [
  value => {
    if (!value) {
      return 'The name is required.'
    }
    if (value?.length >= 3 && value?.length <= 100) {
      const specialCharacters = /[!@#$%^&*(),.?":{}|<>\/\\]/

      if (!specialCharacters.test(value)) {
        return true;
      } else {
        return 'The name cannot special characters.'
      }
    } else {
      return 'The name must have at least 3 characters and at most 100 characters.'
    }
  },
]

const typeRules = [
  value => {
    if (!value) {
      return 'The Type is required.'
    } else {
      return true;
    }
  },
]

const addressRules = [
  value => {
    if (!value) {
      return 'The name is required.'
    }
    if (value?.length >= 3 && value?.length <= 100) {
      const specialCharacters = /[!@#$%^&*(),?":{}|<>\/\\]/;

      if (!specialCharacters.test(value)) {
        return true;
      } else {
        return 'The name cannot special characters.'
      }
    } else {
      return 'The name must have at least 3 characters and at most 100 characters.'
    }
  },
]

</script>

<template>
  <v-row justify="end" class="">
    <v-dialog
        v-model="editClassroomVisible"
        @update:modelValue="$emit('update:editClassroom',$event)"
        persistent
        width="500"
    >
      <v-card>
        <v-card-title>
          <span class="font-weight-bold">Editar Aula</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="model.classroom.name"
                    label="Nombre*"
                    :rules="nameRules"
                    @input="$emit('update:name', $event.target.value)"
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="6"
              >
                <v-text-field
                    v-model="model.classroom.initials"
                    label="Sigla*"
                    hint="Por ejemplo: 617, INFLAB o 692F"
                    persistent-hint
                    :rules="initialsRules"
                    @input="$emit('update:initials', $event.target.value)"
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="6"
              >
                <v-select
                    v-model="model.classroom.type"
                    :items="['Aula', 'Laboratorio', 'Auditorio']"
                    label="Tipo*"
                    :rules="typeRules"
                    @input="$emit('update:type', $event.target.value)"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                    v-model="model.classroom.address"
                    label="Dirección*"
                    :rules="addressRules"
                    @input="$emit('update:address', $event.target.value)"
                ></v-text-field>
              </v-col>

            </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              class="font-weight-bold"
              color="blue"
              variant="text"
              @click="closeEditDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
              class="font-weight-bold"
              color="blue"
              variant="text"
              @click="ValidateSaveEdit(props.editClassroomId)"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>

</style>