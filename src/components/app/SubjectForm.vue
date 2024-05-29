<script setup>
import { getCurrentInstance, reactive, ref, watch,} from 'vue'
import { useSubjectStore } from '@/stores/admin/configgeneral/subjectStore'
import { useMainStore } from '@/stores/MainStore'





const props = defineProps(['createSubject', 'model', 'onSaved'])
const dialogVisible = ref(props.createSubject)
const { emit } = getCurrentInstance()
const mainStore = useMainStore()
const form = ref(null)

const closeDialog = () => {
  form.value.reset()
  emit('close-dialog')
};

const model = reactive({
  subject: {
    areaID: mainStore.area.areaId,
    name: props.model?.name || '',
    initials: props.model?.initials || ''
  }
})



watch(() => props.createSubject, (newValue) => {
  dialogVisible.value = newValue
})

const validateSave = async () => {
  const { valid } = await form.value.validate()
  if (valid) {
    await useSubjectStore().saveSubject(model)
    props.onSaved()
    emit('saved')
    form.value.reset()
    emit('close-dialog')
  }
}


//Validaciones
const nameRules = [
  (value) => {
    if (!value) {
      return 'El nombre es requerido';
    }
    if (value?.length >= 3 && value?.length <= 50) {
      const specialCharacters = /[!@#$%^&*(),.?":{}|<>\/\\]/
      if (!specialCharacters.test(value)) {
        return true;
      } else {
        return 'El nombre no puede contener caracteres especiales';
      }
    } else {
      return 'El nombre debe tener minimo 3 caracteres y 10 caracteres como maximo.';
    }
  },
];

const initialsRules = [
  (value) => {
    if (!value) {
      return 'Las iniciales son requeridas.';
    }

    if (value?.length >= 3 && value?.length <= 15) {
      const specialCharacters = /[!@#$%^&*(),.?":{}|<>\/\\]/
      if (!specialCharacters.test(value)) {
        return true;
      } else {
        return 'Las iniciales no pueden contener caracteres especiales.';
      }
    } else {
      return 'Las iniciales deben tener minimo 3 caracteres y 10 caracteres como maximo.';
    }
  },
];

</script>

<template>
  <v-dialog v-model="dialogVisible"
            @update:modelValue="$emit('update:crearAsignatura', $event)"
            persistent
            width="500"
  >
    <v-card>
      <v-card-title class="font-weight-bold ">
        Crear Asignatura
      </v-card-title>
      <v-card-text >
        <v-container>
          <v-form ref="form">
            <v-row>
              <v-col>
                <v-text-field
                    v-model="model.subject.name"
                    label="Nombre *"
                    :rules="nameRules"
                    @input="$emit('update:name', $event.target.value)"
                    hint="Ej.: Introduccion a la Programacion"
                    persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                    v-model="model.subject.initials"
                    label="Sigla *"
                    :rules="initialsRules"
                    @input="$emit('update:initials', $event.target.value)"
                    hint="Ej.: Intr a Prog I"
                    persistent-hint
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
            @click="closeDialog"
        >
          Cancelar
        </v-btn>
        <v-btn
            class="font-weight-bold "
            variant="tonal"
            color="blue"
            @click.prevent="validateSave"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>