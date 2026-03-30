import { apiClient } from '../api/apiConfig';

class TareaController {
    async listar() {
        try {
            const response = await apiClient.get('/tareas');
            return {
                success: true,
                tareas: response.data.tareas,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al obtener tareas',
                tareas: [],
            };
        }
    }

    async crear(titulo, descripcion, prioridad, fecha, materiaId) {
        try {
            const response = await apiClient.post('/tareas', {
                titulo,
                descripcion,
                prioridad,
                fecha,
                materia_id: materiaId,
            });

            return {
                success: true,
                message: response.data.message,
                tarea: response.data.tarea,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al crear tarea',
            };
        }
    }

    async actualizar(id, titulo, descripcion, prioridad, fecha, completada) {
        try {
            const response = await apiClient.put(`/tareas/${id}`, {
                titulo,
                descripcion,
                prioridad,
                fecha,
                completada,
            });

            return {
                success: true,
                message: response.data.message,
                tarea: response.data.tarea,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al actualizar tarea',
            };
        }
    }

    async marcarCompletada(id, completada) {
        try {
            const response = await apiClient.put(`/tareas/${id}`, {
                completada,
            });

            return {
                success: true,
                message: response.data.message,
                tarea: response.data.tarea,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al actualizar tarea',
            };
        }
    }

    async eliminar(id) {
        try {
            const response = await apiClient.delete(`/tareas/${id}`);

            return {
                success: true,
                message: response.data.message,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al eliminar tarea',
            };
        }
    }
}

export default new TareaController();
