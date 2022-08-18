/** Import des modules nécessaires */
import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://localhost:5000',
});

/**
 * Interceptor pour injection token
 */
Axios.interceptors.request.use((request) => {
  // Si connecté on ajoute le token dans l'entête
  if (localStorage.getItem('access_token')) {
    request.headers.Authorization =
      'Bearer ' + localStorage.getItem('access_token');
  }

  return request;
});

export default Axios;
