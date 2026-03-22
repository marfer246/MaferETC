import axios from 'axios'; // usas para comunicarte

// Reemplaza con la IP IPv4 de tu computadora local y el puerto de tu API
const API_BASE_URL = 'http://192.168.1.65:3000/api'; 

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
}); // datos que te voy a enviar en formato JSON.