import { ref } from 'vue'
import { defineStore } from 'pinia'
import AxiosAM from '@/services/AxiosAM.js'

const pathAreaResource = '/admin/areas';
export const useAreaStore = defineStore('areaStore', () => {
  const areas = ref([]);
  const dialog = ref(false);

  async function getAreas() {
    try {
      const { status, data } = await AxiosAM.get(pathAreaResource);
      if (status === 200) {
        areas.value = data;
        return { success: true, data: data };
      }
    } catch (error) {
      // handle error
      console.log('error getting areas');
    }
  }

  async function createArea(area) {
    try {
      const { status, data } = await AxiosAM.post(pathAreaResource, area);
      if (status === 201) {
        areas.value.splice(0, 0, data);
        return { success: true, data: data };
      }
    } catch (error) {
      console.log('error creating area');
      return { error: true, success: false, data: null }
    }
  }

  async function editArea(area) {
    try {
      const {status, data} = await AxiosAM.put(`${pathAreaResource}/${area.id}`, area);
      if (status === 200) {
        const index = areas.value.findIndex((obj) => obj.id === area.id);
        areas.value.splice(index, 1, area);
        return { success: true, data: data };
      }
    } catch (error) {
      console.log('error editing area');
      return { error: true, success: false, data: null }
    }
  }

  async function deleteArea(area) {
    try {
      const {status} = await AxiosAM.delete(`${pathAreaResource}/${area.id}`);
      if (status === 204) {
        const index = areas.value.findIndex((obj) => obj.id === area.id);
        areas.value.splice(index, 1);
        return { success: true, data: null };
      }
    } catch (error) {
      console.log('error deleting area');
      return { error: true, success: false, data: null }
    }
  }

  return { areas, dialog, getAreas, createArea, editArea, deleteArea }
})
