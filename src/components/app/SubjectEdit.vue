<script setup>
import {getCurrentInstance, reactive, ref, watch} from 'vue';
import {useSubjectStore} from '@/stores/admin/configgeneral/subjectStore';

const props = defineProps(['editSubject', 'model', 'editSubjectId', 'onSaved'])
const { emit } = getCurrentInstance()
const form = ref(null)
const editSubjectVisible = ref(props.editSubject)

const model = reactive({
  subject: {
    name: props.model?.name || '',
    initials: props.model?.initials || ''
  }
})



watch(() => props.editSubject, newValue => {
  editSubjectVisible.value = newValue
})

watch(() => props.editSubjectId, newId => {
  getSubjectById(newId)
})
const getSubjectById = async subjectId => {
  await useSubjectStore().getSubjectById(subjectId)
  model.subject = useSubjectStore().currentSubject
}
const closeEditDialog = () => {
  emit('close-dialogEdit', false)
}

const validateAndSaveEdit = async subjectId => {
  const { valid } = await form.value.validate()
  if (valid) {
    await saveSubjectEdit(subjectId)
    props.onSaved()
    emit('saved')
    emit('close-dialogEdit', false)
  }
}


const saveSubjectEdit = async subjectId => {
  await useSubjectStore().saveSubjectEdit(subjectId)
  const currentSubject= useSubjectStore().currentSubject
  model.subject = currentSubject
};

const nameRules = [
  (value) => {
    if (!value) {
      return 'The name is required.';
    }
    if (value?.length >= 3 && value?.length <= 100) {
      const specialCharacters = /[!@#$%^&*(),.?":{}|<>\/\\]/;
      if (!specialCharacters.test(value)) {
        return true;
      } else {
        return 'El nombre no puede tener caracteres especiales.';
      }
    } else {
      return 'El nombre solo debe tener minimo 3 caracteres y 100 caracteres como maximo.';
    }
  },
];

const initialsRules = [
  (value) => {
    if (!value) {
      return 'The initials are required.';
    }

    if (value?.length >= 3 && value?.length <= 10) {
      const specialCharacters = /[!@#$%^&*(),.?":{}|<>\/\\]/;
      if (!specialCharacters.test(value)) {
        return true;
      } else {
        return 'Las iniciales no pueden contener caracteres especiales.';
      }
    } else {
      return 'Las inicianes deben tener minimo 3 caracteres y 10 caracteres como maximo.';
    }
  },
];


</script>

<template>
  <v-row justify="end">
    <v-dialog v-model="editSubjectVisible"
              @update:modelValue="$emit('update:editSubject', $event)"
              persistent
              width="500"
    >
      <v-card>
        <v-card-title class="font-weight-bold pa-5">
          Editar Asignatura
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col>
                  <v-text-field
                      v-model="model.subject.name"
                      label="Nombre *"
                      hint="Ej.: Introduccion a la Programacion"
                      persistent-hint
                      :rules="nameRules"
                      @input="$emit('update:name', $event.target.value)">
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                      v-model="model.subject.initials"
                      label="Sigla"
                      hint="Ej.: Intr a Prog I"
                      persistent-hint
                      :rules="initialsRules"
                      @input="$emit('update:initials', $event.target.value)"
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
                 variant="tonal"
                 color="blue"
                 @click="closeEditDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
                 class="font-weight-bold"
                 variant="tonal"
                 color="blue"
                 @click.prevent="validateAndSaveEdit(props.editSubjectId)"
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