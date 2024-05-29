<template>
  <v-dialog v-model="editCareerVisible" @update:modelValue="$emit('update:editCareer', $event)">
        <v-card class="card-edit-style">
          <v-card-title>Editar Carrera</v-card-title>
          <v-card-text>
                  <v-sheet width="500" class="mx-auto">
                    <v-form ref="form" @submit.prevent="validateAndSaveEdit">
                      <v-text-field   
                      v-model="model.career.name" label="Nombre"  :rules="nameRules"
                      @input="$emit('update:name', $event.target.value)"></v-text-field>
                      <v-text-field 
                      v-model="model.career.initials" label="Sigla" :rules="siglaRules"
                      @input="$emit('update:initials', $event.target.value)"
                      ></v-text-field>
                      <v-textarea 
                      v-model="model.career.description" 
                      label="Descripción" 
                      :rules="descriptionRules"
                      auto-grow
                       @input="$emit('update:description', $event.target.value)"
                       ></v-textarea>
                      <v-text-field  
                      v-model="model.career.formattedCreationDate" label="Fecha de fundación" 
                      :rules="creationDateRules" 
                      prepend-inner-icon="mdi-calendar"
                      @input="$emit('update:creationDate', $event.target.valueAsDate)"
                       ></v-text-field>
                        <v-container  width="500" >
                          <v-row justify="end">
                            <v-btn type="button" 
                              class=" button-edit-dialoge font-weight-bold" 
                              variant="text"
                              color="blue" 
                              dark 
                              @click="closeEditDialog">Cancelar
                            </v-btn>
                            <v-btn type="submit" 
                            class="button-edit-dialoge font-weight-bold"
                            variant="text"  
                            color="blue" 
                            dark 
                            @click.prevent="validateAndSaveEdit(props.editCareerId)">
                              Guardar
                            </v-btn>
                        </v-row>
                        </v-container>
                      </v-form>
                    </v-sheet>
          </v-card-text>
        </v-card>
      </v-dialog>
    
    </template>
    
    <script setup>
import { ref, reactive, watch, getCurrentInstance} from 'vue';
import { useCareerStore } from '@/stores/admin/configgeneral/careerStore';
import { format} from 'date-fns';

const props = defineProps(['editCareer', 'model', 'editCareerId', 'onSaved']);
const { emit } = getCurrentInstance()
const form = ref(null)
const editCareerVisible = ref(props.editCareer);

const nameRules = [
(value) => {
    if (!value) {
      return 'The name is required.';
    }
    if (value?.length >= 3 && value?.length <= 90) {
      const alphabeticRegex = /^[a-zA-Z\s.ñÑáéíóúÁÉÍÓÚ]+$/;  
      if (alphabeticRegex.test(value)) {
        return true;
      } else {
        return 'The name can only contain alphabetic characters.';
      }
    } else {
      return 'The name must have at least 3 characters and at most 90 characters.';
    }
  },
];

const siglaRules = [
  (value) => {
    if (!value) {
      return 'The initials are required.';
    }

    if (value?.length >= 3 && value?.length <= 10) {
      const alphabeticRegex = /^[a-zA-Z\s.ñÑáéíóúÁÉÍÓÚ]+$/;  
      if (alphabeticRegex.test(value)) {
        return true;
      } else {
        return 'The initials can only contain alphabetic characters.';
      }
    } else {
      return 'The initials must have at least 3 characters and at most 10 characters.';
    }
  },
];

const descriptionRules = [
  (value) => {
    if (!value) {
      return 'The description is required.';
    }
    const alphanumericRegex = /^[a-zA-Z0-9\sñÑáéíóúÁÉÍÓÚ."]+$/;
    if (!alphanumericRegex.test(value)) {
      return 'The description can only contain alphanumeric characters.';
    }
    if (value.length > 500) {
      return 'The description must not exceed 500 characters.';
    }
    return true;
  },
];

const creationDateRules = [
  value => {
    if (!value) {
      return 'The creation date is required.';
    }

    const specialCharacters = /[!@#$%^&*(),.?":{}|<>\\a-zA-Z]/;
    if (specialCharacters.test(value)) {
      return 'The creation date cannot contain special or alphabetical characters.';
    }

    const currentDate = new Date();
    if (isNaN(currentDate.getTime())) {
      return 'Error getting current date.';
    }

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const [day, month, year] = value.split('/').map(Number);

    if (month < 1 || month > 12) {
      return 'Invalid month. Please enter a valid month between 1 and 12.';
    }

    const lastDayOfMonth = new Date(year, month, 0).getDate();

    if (day < 1 || day > lastDayOfMonth) {
      return `Invalid day. Please enter a valid day between 1 and ${lastDayOfMonth} for the selected month.`;
    }

    if (year > currentYear || (year === currentYear && (month > currentMonth || (month === currentMonth && day > currentDay)))) {
      return 'The creation date cannot be later than the current date.';
    }

    return true;
  },
];
const model = reactive({
  career: {
    name: props.model?.name || '',
    initials: props.model?.initials || '',
    description: props.model?.description || '',
    creationDate: props.model?.creationDate || '',
  },
});

watch(() => props.editCareer, newValue => {
  editCareerVisible.value = newValue;
});

watch(() => props.editCareerId, newId => {
  getCareerById(newId);
});
const closeEditDialog = () => {
  emit('close-dialogEdit', false);
};

const validateAndSaveEdit = async careerId => {
  const { valid } = await form.value.validate()

  if (valid) {
    await saveCareerEdit(careerId);
    props.onSaved();
    emit('saved');
    emit('close-dialogEdit', false);
  } else {
  }
};

const getCareerById = async careerId => {
  await useCareerStore().getCareerById(careerId);
  console.log(useCareerStore().currentCareer);
  model.career = useCareerStore().currentCareer;
  model.career.creationDate = new Date(model.career.creationDate);
  model.career.creationDate = format(model.career.creationDate, 'dd-MM-yyyy', { timezone: 'GMT-4' });
};

const saveCareerEdit = async careerId => {
  await useCareerStore().saveCareerEdit(careerId);
  const currentCareer = useCareerStore().currentCareer;
  model.career = currentCareer
};

</script>
  
  <style scoped>
  
  .card-edit-style {
      width: 600px;
      height: 600px;
      align-self: center;
      text-align: center;
    }
    
    .button-edit-dialoge {
      width: 180px;
      height: 60px;
      border-radius: 15px;
    }
    .eliminar-letra {
  font-family: sans-serif;
  font-weight: bold; 
  font-size: 24px;
   }
  
  </style>