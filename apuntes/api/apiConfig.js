import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL del API de Laravel (ajusta el puerto si es necesario)
// const API_BASE_URL = 'http://10.124.69.181:8000/api';
// const API_BASE_URL = 'http://192.168.1.75:8000/api';
//const API_BASE_URL = 'http://192.168.100.24:8081/api';
const API_BASE_URL = 'http://192.168.100.24:8000/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token de autenticación (React Native usa AsyncStorage)
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error leyendo token de AsyncStorage', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;