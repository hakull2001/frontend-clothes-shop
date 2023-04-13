import axios from 'axios';
import store from '../store/index';


const axiosClient = (() => {
    const instance = axios.create({
      baseURL: 'http://localhost:8080/api/v1/'
    });
  
    instance.interceptors.request.use((config) => {
      const  {jwt}  = store.getState().auth.data;
      console.log(jwt);
      console.log(store.getState().auth.data);
      if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`;
      }
      return config;
    });
    instance.interceptors.response.use(
      (res) => {
        return res;
      },
      async (err) => {
        const originalConfig = err.config;  
        if (err.response) {
          // Access Token was expired
          if (err.response.status === 401 && !originalConfig.retry) {
            originalConfig.retry = true;
          }
  
          if (err.response.status === 403 && err.response.data) {
            return Promise.reject(err.response.data);
          }
        }
  
        if (err.response && err.response.data) {
          return Promise.reject(new Error(err.response.data));
        }
  
        switch (err.message) {
          case 'Network Error':
            return Promise.reject(new Error("Loi mang"));
          default:
            return Promise.reject(err);
        }
      }
    );
  
    return instance;
  })();

export default axiosClient;

