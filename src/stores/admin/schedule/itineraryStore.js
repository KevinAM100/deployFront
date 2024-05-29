import { ref ,watch } from 'vue'
import { defineStore } from 'pinia'
import AxiosAM from '@/services/AxiosAM.js'
import { useMainStore } from '@/stores/MainStore';

const mainStore = useMainStore();
let pathItineraryResource=`/admin/areas/-1/itineraries`;
export const useItineraryStore =defineStore('itineraryStore',()=>{
  
  watch(() => mainStore.area.areaId, async (newAreaId) => {
    if (newAreaId !== null) {
      pathItineraryResource=`/admin/areas/${newAreaId}/itineraries`;
    }
  });

  const itineraries = ref([]);
  const currentItinerary = ref(null);
  
  async function getItineraries() {
    try {
      const { status, data } = await AxiosAM.get(pathItineraryResource);
      if (status === 200) {
        itineraries.value = data;
      }
    } catch (error) {
      console.log('error getting itineraries');
    }
  }

  async function saveItinerary(itinerary) {
    try {
      const { status, data } = await AxiosAM.post(pathItineraryResource,itinerary);
      if(status===201){
        itineraries.value.push(data);
      }
    } catch (error) {
      console.log('error save itinerary');
    }
  }

  async function getItineraryById(idItinerary) {
    try {
      const { status, data } = await AxiosAM.get(pathItineraryResource+"/"+idItinerary);
      if(status===200){
        currentItinerary.value=data;
      }
    } catch (error) {
      console.log('error get itinerary');
    }
  }

  async function putItinerary(editItinerary) {
    try {
      const { status, data } = await AxiosAM.put(pathItineraryResource+"/"+currentItinerary.value.id,editItinerary);
      if(status===200){
        this.getItineraries();
      }
    } catch (error) {
      console.log('error save itinerary');
    }
  }

  async function deleteItinerary(idItinerary) {
    try {
      const { status, data } = await AxiosAM.delete(pathItineraryResource+"/"+idItinerary);
      if(status===204){
        this.getItineraries();
      }
    } catch (error) {
      console.log('error delete itinerary');
    }
  }

  return { itineraries,currentItinerary, getItineraries,saveItinerary,getItineraryById,putItinerary,deleteItinerary}
})