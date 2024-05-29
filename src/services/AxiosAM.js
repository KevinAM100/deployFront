import axios from 'axios';
const AxiosAM = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL
});
export default AxiosAM;