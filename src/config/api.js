import axios from 'axios'

const api = axios.create({
    baseURL: 'http://webfin.test',
    headers: {
      'X-Requested-Width': 'XMLHttpRequest',
    },
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