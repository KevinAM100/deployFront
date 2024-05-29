<template>
  <v-dialog v-model="dialogVisible" @update:modelValue="$emit('update:crearCarrera', $event)">
    <v-card class="card-style">
      <v-card-title>Añadir Carrera</v-card-title>
      <v-card-text>
        <v-sheet width="500" class="mx-auto">
          <v-form ref="form"  @submit.prevent="validateAndSave">
            <v-text-field
              v-model="model.career.name"
              label="Nombre"
              :rules="nameRules"
              @input="$emit('update:name', $event.target.value)"
            ></v-text-field>
            <v-text-field
              v-model="model.career.initials"
              label="Sigla"
              :rules="siglaRules"
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
                      v-model="model.career.creationDate" label="Fecha de fundación" 
                      :rules="creationDateRules" 
                      prepend-inner-icon="mdi-calendar"
                      @input="$emit('update:creationDate', $event.target.valueAsDate)"
                       ></v-text-field>
            <v-container  width="500">
              <v-row justify="end">
                <v-btn
                  type="submit"
                  class="button-dialoge font-weight-bold"
                  variant="text"
                  color="blue"
                  dark
                  @click="closeDialog"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  type="submit"
                  class="button-dialoge font-weight-bold"
                  variant="text"
                  color="blue"
                  dark
                  @click.prevent="validateAndSave"
                >
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
import { useMainStore } from '@/stores/MainStore';
import { format} from 'date-fns';


const props = defineProps(['crearCarrera', 'model', 'onSaved']);
const dialogVisible = ref(props.crearCarrera);
const { emit } = getCurrentInstance();
const mainStore = useMainStore();
const form = ref(null);
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
    areaId: mainStore.area.areaId,
    name: props.model?.name || '',
    initials: props.model?.initials || '',
    description: props.model?.description || '',
    creationDate: props.model?.creationDate ? format(new Date(props.model.creationDate), 'dd/MM/yyyy') : '',
  },
});

watch(() => props.crearCarrera, (newValue) => {
  dialogVisible.value = newValue;
});

const closeDialog = () => {
  emit('update:crearCarrera', false); 
  emit('close-dialog'); 
  form.value.reset();
};


const validateAndSave = async () => {
  const { valid } = await form.value.validate();

  if (valid) {
    useCareerStore().saveCareer(model);
    props.onSaved();
    emit('saved');
    form.value.reset();
    emit('close-dialog');
  } else {
  }
};

</script>

<style scoped>
.card-style {
  width: 600px;
  height: 600px;
  align-self: center;
  text-align: center;
}

.button-dialoge {
  width: 180px;
  height: 60px;
  border-radius: 15px;
}

</style>