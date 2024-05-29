<template>
    <v-dialog v-model="deleteCareerVisible"  @update:modelValue="$emit('update:eliminarCarrera', $event)">
      <v-card class="card-delete-style">
          <v-card-text>
            <v-sheet  width="500" class="mx-auto ">
              <h5 class="eliminar-letra mt-7">
                ¿Estas Seguro de Eliminar la carrera?
              </h5>
                <v-container width="500" class="d-flex justify-center">    
                            <v-btn type="submit" 
                            class=" button-delete-dialoge font-weight-bold "
                            variant="text"   
                            color="blue" dark
                            @click="deleteCareerById(deleteCareerId)">Aceptar</v-btn>
                            <v-btn type="submit" 
                            class=" button-delete-dialoge font-weight-bold  " 
                            variant="text" 
                            color="blue" 
                            dark @click="closeDeleteDialog">Cancelar</v-btn>
                          </v-container>
            </v-sheet>
          </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script setup>
import axios from 'axios';
import { ref, watch, getCurrentInstance} from 'vue';
import { useCareerStore } from '@/stores/admin/configgeneral/careerStore';
import { useMainStore } from '@/stores/MainStore';
import { useDate } from 'vuetify'

const props = defineProps(['eliminarCarrera', 'deleteCareerId']);
const { emit } = getCurrentInstance();
const mainStore = useMainStore();
const deleteCareerVisible = ref(props.eliminarCarrera);
const date = useDate()



watch(() => props.eliminarCarrera, (newValue) => {
  deleteCareerVisible.value = newValue;
});

const closeDeleteDialog = () => {
  emit('close-deleteDialog', false);

};

const deleteCareerById = (careerId) => {
  axios.delete(`http://localhost:8080/admin/areas/2/careers/${careerId}`)
    .then((res) => {
      useCareerStore().getCareers(mainStore.area.areaId);
      emit('close-deleteDialog', false);
      const formatted = date.format('2010-04-13', 'fullDateWithWeekday')
       console.log(formatted)
    })
    .catch((error) => {
      console.error(error);
    });
};
</script>

<style scoped>
 .button-delete-dialoge {
    width: 150px;
    height: 40px;
    border-radius: 15px;
  }

  .card-delete-style {
    width: 600px;
    height: 200px;
    align-self: center;
    text-align: left;
  }
  .eliminar-letra {
    font-family: sans-serif;
    font-weight: bold; 
    font-size: 24px;

  }
  


</style>