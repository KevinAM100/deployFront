<script setup>
  import {getCurrentInstance, reactive, ref, watch} from 'vue'
  import { useClassroomStore} from "@/stores/admin/configgeneral/classroomStore.js";
  import {useMainStore} from '@/stores/MainStore';
  import { useField } from "vee-validate";
  import * as yup from 'yup';

  //const {value:name, errorMessage:nameError} =useField('classroom.name', yup.string().email().required()) //solo pruebo

  const props = defineProps(['createClassroom','model','onSaved'])
  const dialogVisible=ref(props.createClassroom)
  const { emit } = getCurrentInstance()
  const mainStore=useMainStore()
  const form =ref(null)

  const closeDialog = () => {
    form.value.reset()
    emit('close-dialog')
  }

  const model = reactive({
    classroom:{
      areaId: mainStore.area.areaId,
      name: props.model?.name || '',
      initials: props.model?.initials || '',
      type: props.model?.type || '',
      address: props.model?.address || '',
    }
  })

  watch(()=>props.createClassroom,(newValue)=>{
    dialogVisible.value=newValue
  })

const validateSave = async ()=>{
    const { valid } = await form.value.validate()
  if(valid){
    useClassroomStore().saveClassroom(model);
    props.onSaved()
    emit('saved')
    form.value.reset()
    emit('close-dialog')
  }

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
    if (value?.length >= 3 && value?.length <= 50) {
      const specialCharacters = /[!@#$%^&*(),.?":{}|<>\/\\]/

      if (!specialCharacters.test(value)) {
        return true;
      } else {
        return 'The name cannot special characters.'
      }
    } else {
      return 'The name must have at least 3 characters and at most 50 characters.'
    }
  },
]

const typeRules = [
  value => {
    if (!value) {
      return 'The Type is required.'
    } else {
      return true
    }
  },
]

const addressRules = [
  value => {
    if (!value) {
      return 'The name is required.'
    }
    if (value?.length >= 3 && value?.length <= 50) {
      const specialCharacters = /[!@#$%^&*(),.?":{}|<>\/\\]/

      if (!specialCharacters.test(value)) {
        return true
      } else {
        return 'The name cannot contain numbers or special characters.'
      }
    } else {
      return 'The name must have at least 3 characters and at most 50 characters.'
    }
  },
]

</script>

<template>
    <v-dialog
        v-model="dialogVisible"
        width="500"
        @update:modelValue="$emit('update:createClasroom',$event)"
        persistent>
      <v-card>
        <v-card-title>
          <span class="font-weight-bold">Crear Aula</span>
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
                    :rules="initialsRules"
                    @input="$emit('update:initials', $event.target.value)"
                    hint="Por ejemplo: 617, INFLAB o 692F"
                    persistent-hint
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
              @click="closeDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
              class="font-weight-bold"
              color="blue"
              variant="text"
              @click="validateSave"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<style scoped>

</style>