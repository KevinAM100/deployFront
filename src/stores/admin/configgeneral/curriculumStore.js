import { ref,  } from 'vue'
import { defineStore } from 'pinia'
import AxiosAM from '@/services/AxiosAM.js'
import { useMainStore } from '@/stores/MainStore'

const pathCareerResource = '/admin/areas';

export const useCurriculumStore = defineStore('classroomStore', () => {
    const curriculums = ref([]);
    const curriculumsByCareer = ref([]);
    const currentCurriculum = ref(null);
    const mainStore = useMainStore();

    async function getCurriculumsByCareer(areaId,careerId) {
        try {
            const { status, data } = await AxiosAM.get(`${pathCareerResource}/${areaId}/careers/${careerId}/curriculums`);
            if (status === 200) {
                curriculumsByCareer.value = data;
            }
        } catch (error) {
            console.error('Error getting curriculums: ', error);
        }
    }

    async function getCurriculumByIdDetailed(areaId,careerId,curriculumId) {
        try {
            const { status, data } = await AxiosAM.get(`${pathCareerResource}/${areaId}/careers/${careerId}/curriculums/${curriculumId}?detailed=true`);
            if (status === 200) {                  
                currentCurriculum.value = data;
            }
        } catch (error) {
            console.error('Error getting curriculum ', error);
        }
    }

    return {curriculums,curriculumsByCareer,currentCurriculum,getCurriculumsByCareer,getCurriculumByIdDetailed};
}
);