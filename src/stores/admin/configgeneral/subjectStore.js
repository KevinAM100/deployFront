import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import AxiosAM from '@/services/AxiosAM.js'
import { useMainStore } from '@/stores/MainStore.js';

const pathCareerResource = '/admin/areas';

export const useSubjectStore = defineStore('subjectStore', ()=>{
    const subjects=ref([]);
    const currentSubject = ref(null);
    const mainStore = useMainStore();
    async function getSubjects(areaId){
        try {
            const {status, data} = await AxiosAM.get(`${pathCareerResource}/${areaId}/subjects`);
            if (status===200){
                subjects.value=data;
            }
        }catch (error){
            console.error('Error getting subject: ', error);
        }
    }

    async function saveSubject(model){
        try {
            const {areaId} = mainStore.area;
            model.subject.areaID = areaId;

            const {status, data} = await AxiosAM.post(`${pathCareerResource}/${areaId}/subjects`, model.subject);
            if (status===200){
                model.subject={
                    name:'',
                    initials:'',
                };
            }
        }catch (error){
            console.error('Error saving subject: ', error);
        }
    }

    async function getSubjectById(subjectId){
        try {
            const { status, data } = await AxiosAM.get(`${pathCareerResource}/2/subjects/${subjectId}`);
            if (status === 200) {
                const subjectData=data ;
                if(subjectData){
                    currentSubject.value=subjectData
                }else{
                    console.error('Invalid data received:', data);
                }
            }
        } catch (error) {
            console.error('Error getting career by id:', error);
        }
    }
    async function saveSubjectEdit(subjectId) {

        try {
            const { status, data } = await AxiosAM.put(`${pathCareerResource}/2/subjects/${subjectId}`, currentSubject.value);
            if (status === 200) {
            }
        } catch (error) {
            console.error('Error saving subject:', error);
        }
    }

    async function deleteSubjectById(subjectId){
        try {
            const {status, data}=await AxiosAM.delete(`${pathCareerResource}/2/subjects/${subjectId}`)
            if (status === 200) {
            }
        }catch (error){
            console.error('Error deleting subject:', error)
        }
    }

    return { subjects, getSubjects, saveSubject, getSubjectById, saveSubjectEdit,deleteSubjectById, currentSubject };
});
