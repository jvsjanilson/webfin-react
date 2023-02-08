import axios from 'axios'

const api = axios.create({
    baseURL: 'http://webfin.test/api/',
    headers: {'Accept': 'application/json'}
    
  });

export default api