<script setup>

import {useAreaStore} from '@/stores/admin/configgeneral/areaStore.js';
import { ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  areaObj: {
    type: Object,
    required: false
  }
});

const emit = defineEmits(['submit', 'close']);

const areaStore = useAreaStore();
const areaForm = ref({
  id: null,
  name: '',
  initials: '',
  description: ''
});

function onSave() {
  const areaTemp = Object.assign({}, areaForm.value);
  emit('submit', areaTemp);
}

function onClose() {
  emit('close');
}

watch(() => props.areaObj, (obj) => {
  if (obj.id) {
    areaForm.value = Object.assign({}, props.areaObj);
  } else {
    areaForm.value = {
      id: null,
      name: '',
      initials: '',
      description: ''
    };
  }
});
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="areaStore.dialog" persistent width="700">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{props.title}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-show="false" v-model="areaForm.id"/>
                <v-text-field
                  label="Nombre*"
                  v-model="areaForm.name"
                  required/>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Sigla*"
                  v-model="areaForm.initials"
                  hint="M&aacute;ximo 150 caracteres"
                  persistent-hint
                  required/>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Descripci&oacute;n"
                  v-model="areaForm.description"
                  hint="M&aacute;ximo 100 caracteres"
                  clearable
                  persistent-hint/>
              </v-col>
            </v-row>
          </v-container>
          <small>(*) Indica campo requerido</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="onClose">Close</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="onSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>

</style>