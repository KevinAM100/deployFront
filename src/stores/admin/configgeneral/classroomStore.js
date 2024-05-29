import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import AxiosAM from '@/services/AxiosAM.js'
import { useMainStore } from '@/stores/MainStore'

const pathCareerResource = '/admin/areas';

export const useClassroomStore = defineStore('classroomStore', ()=>{
    const classrooms=ref([]);
    const currentClassroom = ref(null);
    const mainStore = useMainStore();
    async function getClassrooms(areaId){
        try {
            const {status, data} = await AxiosAM.get(`${pathCareerResource}/${areaId}/classrooms`);
            if (status===200){
                classrooms.value=data;
            }
        }catch (error){
            console.error('Error getting classroom: ', error);
        }
    }

    async function saveClassroom(model) {
        try {
          const { areaId } = mainStore.area;
          model.classroom.areaId = areaId;
          const { status, data } = await AxiosAM.post(`${pathCareerResource}/${areaId}/classrooms`, model.classroom);
          if (status === 201) {
            classrooms.value.push(data);
            model.classroom = { name: '', initials: '', type: '', address: '' };
            return { success: true, data: data };
          }
        } catch (error) {
          console.error('Error saving classroom: ', error);
          return { error: true, success: false, data: null };
        }
      }

    async function getClassroomById(classroomId){
        try {
            const { status, data } = await AxiosAM.get(`${pathCareerResource}/2/classrooms/${classroomId}`);
            if (status === 200) {
                currentClassroom.value=data
                return{ success:true, data:data}
            }
        } catch (error) {
            console.error('Error getting career by id:', error);
        }
    }
    async function saveClassroomEdit(classroomId) {

        try {
            const { status, data } = await AxiosAM.put(`${pathCareerResource}/2/classrooms/${classroomId}`, currentClassroom.value);
            if (status === 200) {
                return{ success:true, data: data}
            }
        } catch (error) {
            console.error('Error saving classroom:', error);
            return { error:true, success:false, data:null}
        }
    }

    async function deleteClassroomById(classroomId){
        try {
            const {status, data}=await AxiosAM.delete(`${pathCareerResource}/2/classrooms/${classroomId}`)
            if (status === 200) {
                return{ success:true, data: data}
            }
        }catch (error){
            console.error('Error deleting classroom:', error)
            return { error:true, success:false, data:null}
        }
    }

    return { classrooms, getClassrooms, saveClassroom, getClassroomById, saveClassroomEdit,deleteClassroomById, currentClassroom };
});