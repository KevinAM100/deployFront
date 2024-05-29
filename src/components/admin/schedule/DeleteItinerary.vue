<script setup>
import { useItineraryStore } from '@/stores/admin/schedule/itineraryStore'

const itineraryStore = useItineraryStore()
const props = defineProps(['dialog', 'idItinerary'])
const emit = defineEmits(['close-dialog-delete'])

const deleteItinerary = async () => {
  await itineraryStore.deleteItinerary(props.idItinerary)
  emit('close-dialog-delete')
}
</script>

<template>
  <v-dialog v-model="props.dialog" persistent width="auto">
    <v-card>
      <v-card-title class="text-h6">
        ¿Está seguro de que desea eliminar el itinerario?
      </v-card-title>
      <v-card-actions>
        <v-row justify="center">
          <v-btn color="primary" variant="text" @click="$emit('close-dialog-delete')">
            Cancelar
          </v-btn>
          <v-btn color="primary" variant="text" @click="deleteItinerary"> Eliminar </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>