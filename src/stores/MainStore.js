import { defineStore } from 'pinia';
import { ref } from 'vue';

export const sharedReload = ref(false);
export const useMainStore = defineStore('main', () => {
  const area = {
    areaId: ref(null),
    name: ref(null),
    initials: ref(null),
    active: ref(null),
  };

  function setAreaId(id) {
    area.areaId.value = id;
  }

  const itinerary = {
    itineraryId: ref(1),
    name: ref(null),
    active: ref(null),
  };

  function setItineraryId(id) {
    itinerary.itineraryId.value = id;
  }

  const userRole = ref('');

  function setUserRole(role) {
    userRole.value = role; // Mutación para actualizar el rol de usuario
  }

  return {
    area,
    setAreaId,
    itinerary,
    setItineraryId,
    userRole,
    setUserRole,
  };
});
