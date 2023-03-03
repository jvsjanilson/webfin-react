import axios from 'axios'


const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,//'https://webfin.plugsystem.natal.br',
    
    headers: {
      'X-Requested-Width': 'XMLHttpRequest', 
      'Accept': '*/*',
      //'Content-Type': 'application/json'
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