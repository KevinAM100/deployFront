import { defineStore } from 'pinia';
import { ref } from 'vue'
import AxiosAM from '@/services/AxiosAM';

const pathCareerResource = '/admin/areas';

export const useItineraryReadStore = defineStore('itinearyReadStore', () => {
  const itineraries = ref([]);
  async function getItineraries(areaId) {
    try {
      const { status, data } = await AxiosAM.get(`${pathCareerResource}/${areaId}/itineraries`);
      if (status === 200) {
        itineraries.value = data;
      }
    } catch (error) {
      console.error('Error getting careers:', error);
    }
  }

  return { itineraries, getItineraries };

});