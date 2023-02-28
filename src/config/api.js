import axios from 'axios'
// import { useAuth } from '../hooks/auth';

// const { sigOut } = useAuth()
const api = axios.create({
    baseURL: 'https://webfin.plugsystem.natal.br',
    // baseURL: 'http://webfin.test',
    headers: {
      'X-Requested-Width': 'XMLHttpRequest', 
      // 'Referer': 'webfin-react.vercel.app',
    },
    withCredentials: true,
        
  });
api.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response.status == 401 || error.response.status == 419)
    // sigOut()
    localStorage.removeItem('webfin:isLogado')
  return Promise.reject(error);
})  

export default api