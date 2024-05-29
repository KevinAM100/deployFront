import { defineStore } from 'pinia'
import AxiosAM from '@/services/AxiosAM.js'
import {ref} from "vue";

const PDF_ENDPOINT = '/files/uploadPdf';

export const useUserDataStore =defineStore('userDataStore',()=>{
  const codeStudent = ref(null);
  const dayBirth = ref(null);

  // User data state and actions
  async function saveUserData(userData) {
    try {
      codeStudent.value = userData.idNumber;
      dayBirth.value = userData.dateOfBirth;
      const { status, data } = await AxiosAM.post('/admissions/candidates',userData);
      if(status===201){
        console.log('save user data');
      }
    } catch (error) {
      console.log('error save user data');
    }
  }

  // PDF state and actions
  const pdf1 = ref(null);
  const pdf2 = ref(null);

  async function uploadPdfsToBackend(){
    const formData = new FormData();
    if (pdf1.value) {
      formData.append('files', pdf1.value, 'carnet.pdf');
    }
    if (pdf2.value) {
      formData.append('files', pdf2.value, 'diploma.pdf');
    }
    try{
      const response = await AxiosAM.post(`${PDF_ENDPOINT}/${codeStudent.value}/${dayBirth.value}`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from backend', response.data);
    } catch(error){
      console.error('Error sending PDFs to backend', error);
      throw error;
    }
  }
  function setPdf1(file){
    pdf1.value = file;
  }
  function setPdf2(file){
    pdf2.value = file;
  }
  return {
    saveUserData,
    codeStudent,
    dayBirth,
    uploadPdfsToBackend,
    setPdf1,
    setPdf2,
  };
});