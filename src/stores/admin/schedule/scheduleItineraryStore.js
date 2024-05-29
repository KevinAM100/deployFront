import { ref } from 'vue'
import {defineStore} from "pinia";
import AxiosAM from "@/services/AxiosAM.js";


let path= `/admin/group/-1/scheduleItinerary`
export const useItineraryScheduleStore= defineStore('itineraryScheduleStore',()=>{
    const itinerarySchedules=ref([])
    async function createItinerarySchedule(groupId,itinerarySchedule){
        try{
            const {status, data }= await AxiosAM.post(`/admin/group/${groupId}/scheduleItinerary`,itinerarySchedule)
            if(status===201){
                itinerarySchedules.value.splice(0,0,data)
                return{ success:true, data:data }
            }
        }catch (e) {
            console.error('error save ItinerarySchedule',e)
            return { error:true, success:false, data:null}
        }
    }

    async function deleteItinerarySchedule(scheduleItineraryId){
        try {
            const {status, data} = await AxiosAM.delete(path+"/"+scheduleItineraryId)
            if (status===204) {
                return{ success:true, data:data}
            }
        }catch (e) {
            console.log('error delete idItinerarGroup',e)
            return {  error:true, success:false, data:null}
        }
    }



    return{createItinerarySchedule, deleteItinerarySchedule}
})