import axios from 'axios'; // Para hacer peticiones HTTP (comunicarse con servidores).
import AsyncStorage from '@react-native-async-storage/async-storage'; // guardar datos que no se borran al cerrar la app

// URL del API de Laravel
//const API_BASE_URL = 'http://192.168.100.24:8081/api';
const API_BASE_URL = 'http://192.168.100.24:8000/api';

// instancia, asistente
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json', // mandar al json
    },
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
    async (config) => {
        try { // llave de acceso
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) { // para errores
            console.error('Error leyendo token de AsyncStorage', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;