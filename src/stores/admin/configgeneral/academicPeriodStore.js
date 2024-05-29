import { ref } from 'vue'
import { defineStore } from 'pinia'
import AxiosAM from '@/services/AxiosAM.js'


const pathAcademicPeriodResource = '/admin/areas'
export const useAcademicPeriodStore = defineStore('academicPeriodStore', () => {
  const academicPeriods = ref([]);
  let areaId= -1;
  const academicPeriod= ref([]);

  async function listAcademicPeriodByArea(areaID) {
    try {

        const { status, data } = await AxiosAM.get(`${pathAcademicPeriodResource}/${areaID}/academic-periods`);
        areaId=areaID;
      if (status === 200) {
        academicPeriods.value = data.map((period, index) => ({
          ...period,
          index: index + 1,
          startDate: formatDate(period.startDate, true),
          endDate: formatDate(period.endDate, true),
        }));
        return { success: true, data: data };
      }
    } catch (error) {
      console.log('error getting academic Period');
    }
  }

  async function getAcademicPeriodById(id) {
    try {
      const { status, data } = await AxiosAM.get(`${pathAcademicPeriodResource}/${areaId}/academic-periods/${id}`);
      if (status === 200) {
        academicPeriod.value = data;
      }
    } catch (error) {
      console.log('error getting academic Period by id:');
    }
  }

  async function createAcademicPeriod(model) {
    try {
      model.areaId = areaId;
      model.startDate = formatDate(model.startDate, false);
      model.endDate = formatDate(model.endDate, false);
      const { status, data } = await AxiosAM.post(`${pathAcademicPeriodResource}/${areaId}/academic-periods`, model, areaId);
      if (status === 201) {
        academicPeriods.value.push({
          ...data,
          index: academicPeriods.value.length + 1,
          startDate: formatDate(data.startDate, true),
          endDate: formatDate(data.endDate, true),
        });
        return { success: true, data: data };
      }
    } catch (error) {
      console.error('Error en create Academic Period:');
      return { error: true, success: false, data: null }
    }
  }

  async function editAcademicPeriod(AcademicPeriodDto, id) {
    try {
      AcademicPeriodDto.startDate=formatDate(AcademicPeriodDto.startDate, false);
      AcademicPeriodDto.endDate=formatDate(AcademicPeriodDto.endDate, false);
      const { status, data } = await AxiosAM.put(`${pathAcademicPeriodResource}/${areaId}/academic-periods/${id}`, AcademicPeriodDto, areaId);
  
      if (status === 200) {
        return { success: true, data: data };
      }
    } 
    catch (error) {
      console.error('Error edit academic period:');
      return { error: true, success: false, data: null }
    }
  }

  async function deleteAcademicPeriod(academicPeriodId) {
    try {
      const { status, data } = await AxiosAM.delete(`${pathAcademicPeriodResource}/${areaId}/academic-periods/${academicPeriodId}`);
      if (status === 204) {
        return { success: true, data: null };
      }
    } 
    catch (error) {
      console.error('Error delete academic Period:');
      return { error: true, success: false, data: null }
    }
  }

  const formatDate = (dateString, band) => {
    if (!band) {
      const [day, month, year] = dateString.split('/').map(num => parseInt(num));
      return [year, month, day];
    } else {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${day}/${month}/${year}`;
    }
  };
  

  return { academicPeriods, academicPeriod , listAcademicPeriodByArea, getAcademicPeriodById, createAcademicPeriod, editAcademicPeriod, deleteAcademicPeriod}
})