import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://webfin.test/api/',
    headers: {'Accept': 'application/json'},
    withCredentials: true,
        
  });
api.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response.status == 401)
    localStorage.setItem('logged', false)
  return Promise.reject(error);
})  

export default api