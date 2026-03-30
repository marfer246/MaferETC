import { apiClient } from '../api/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserController {
    async registro(nombre, correo, password) {
        try {
            const response = await apiClient.post('/registro', {
                nombre,
                correo,
                password,
            });

            return {
                success: true,
                message: response.data.message,
                usuario: response.data.usuario,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error en el registro',
            };
        }
    }

    async login(correo, password, recordar = false) {
        try {
            const response = await apiClient.post('/login', {
                correo,
                password,
            });

            // Guardar token y usuario
            const token = response.data.token;
            const usuario = response.data.usuario;

            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

            // Guardar persistencia si se selecciona "Recordarme"
            if (recordar) {
                await AsyncStorage.setItem('recordarLogin', 'true');
            }

            return {
                success: true,
                message: response.data.message,
                usuario,
                token,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error en el login',
            };
        }
    }

    async logout() {
        try {
            await apiClient.post('/logout');

            // Limpiar datos locales
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('usuario');
            await AsyncStorage.removeItem('recordarLogin');

            return { success: true };
        } catch (error) {
            // Aún si falla en servidor, limpiamos localmente
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('usuario');
            return { success: true };
        }
    }

    async getActiveSession() {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                return null;
            }

            // Verificar sesión en el servidor
            const response = await apiClient.get('/sesion-activa');
            return response.data.usuario;
        } catch (error) {
            // Token inválido o expirado
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('usuario');
            return null;
        }
    }
}

export default new UserController();