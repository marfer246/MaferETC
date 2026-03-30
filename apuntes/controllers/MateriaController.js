import { apiClient } from '../api/apiConfig';

class MateriaController {
    async listar() {
        try {
            const response = await apiClient.get('/materias');
            return {
                success: true,
                materias: response.data.materias,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al obtener materias',
                materias: [],
            };
        }
    }

    async crear(nombre, profesor, color) {
        try {
            const response = await apiClient.post('/materias', {
                nombre,
                profesor,
                color,
            });

            return {
                success: true,
                message: response.data.message,
                materia: response.data.materia,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al crear materia',
            };
        }
    }

    async actualizar(id, nombre, profesor, color) {
        try {
            const response = await apiClient.put(`/materias/${id}`, {
                nombre,
                profesor,
                color,
            });

            return {
                success: true,
                message: response.data.message,
                materia: response.data.materia,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al actualizar materia',
            };
        }
    }

    async eliminar(id) {
        try {
            const response = await apiClient.delete(`/materias/${id}`);

            return {
                success: true,
                message: response.data.message,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al eliminar materia',
            };
        }
    }
}

export default new MateriaController();
