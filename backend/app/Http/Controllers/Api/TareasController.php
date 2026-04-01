<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tarea;
use Illuminate\Http\Request;

class TareasController extends Controller
{
    /**
     * Listar todas las tareas del usuario autenticado con filtros opcionales
     */
    public function index(Request $request)
    {
        try {
            $query = $request->user()->tareas();

            // Filtrar por materia si se proporciona
            if ($request->has('materia_id')) {
                $query->where('materia_id', $request->materia_id);
            }

            // Filtrar por estado (completada/pendiente)
            if ($request->has('estado')) {
                $estado = $request->estado;
                if ($estado === 'completada') {
                    $query->where('completada', true);
                } elseif ($estado === 'pendiente') {
                    $query->where('completada', false);
                }
            }

            // Filtrar por prioridad
            if ($request->has('prioridad')) {
                $query->where('prioridad', $request->prioridad);
            }

            $tareas = $query->with('materia')->get();

            return response()->json([
                'success' => true,
                'message' => 'Tareas obtenidas correctamente.',
                'tareas' => $tareas,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tareas: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Crear una nueva tarea
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'titulo' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'prioridad' => 'required|in:Alta,Media,Baja',
                'fecha' => 'required|date',
                'materia_id' => 'required|integer|exists:materias,id',
            ]);

            // Verificar que la materia pertenezca al usuario autenticado
            $materia = $request->user()->materias()->find($request->materia_id);
            if (!$materia) {
                return response()->json([
                    'success' => false,
                    'message' => 'La materia especificada no existe o no te pertenece.',
                ], 404);
            }

            $tarea = $request->user()->tareas()->create([
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'prioridad' => $request->prioridad,
                'fecha' => $request->fecha,
                'materia_id' => $request->materia_id,
                'completada' => false,
            ]);

            $tarea->load('materia');

            return response()->json([
                'success' => true,
                'message' => 'Tarea creada correctamente.',
                'tarea' => $tarea,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear tarea: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener una tarea específica
     */
    public function show(Request $request, Tarea $tarea)
    {
        try {
            // Verificar que la tarea pertenezca al usuario autenticado
            if ($tarea->usuario_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autorizado.',
                ], 403);
            }

            $tarea->load('materia');

            return response()->json([
                'success' => true,
                'tarea' => $tarea,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tarea: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar una tarea
     */
    public function update(Request $request, Tarea $tarea)
    {
        try {
            // Verificar que la tarea pertenezca al usuario autenticado
            if ($tarea->usuario_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autorizado.',
                ], 403);
            }

            $request->validate([
                'titulo' => 'sometimes|string|max:255',
                'descripcion' => 'nullable|string',
                'prioridad' => 'sometimes|in:Alta,Media,Baja',
                'fecha' => 'sometimes|date',
                'completada' => 'sometimes|boolean',
                'materia_id' => 'sometimes|integer|exists:materias,id',
            ]);

            // Si se proporciona materia_id, verificar que pertenezca al usuario
            if ($request->has('materia_id')) {
                $materia = $request->user()->materias()->find($request->materia_id);
                if (!$materia) {
                    return response()->json([
                        'success' => false,
                        'message' => 'La materia especificada no existe o no te pertenece.',
                    ], 404);
                }
            }

            $tarea->update($request->only(['titulo', 'descripcion', 'prioridad', 'fecha', 'completada', 'materia_id']));
            $tarea->load('materia');

            return response()->json([
                'success' => true,
                'message' => 'Tarea actualizada correctamente.',
                'tarea' => $tarea,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar tarea: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar una tarea (soft delete)
     */
    public function destroy(Request $request, Tarea $tarea)
    {
        try {
            // Verificar que la tarea pertenezca al usuario autenticado
            if ($tarea->usuario_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autorizado.',
                ], 403);
            }

            $tarea->delete(); // Soft delete

            return response()->json([
                'success' => true,
                'message' => 'Tarea eliminada correctamente.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar tarea: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener tareas de una materia específica
     */
    public function porMateria(Request $request, $materiaId)
    {
        try {
            // Verificar que la materia pertenezca al usuario autenticado
            $materia = $request->user()->materias()->find($materiaId);
            if (!$materia) {
                return response()->json([
                    'success' => false,
                    'message' => 'La materia especificada no existe o no te pertenece.',
                ], 404);
            }

            $tareas = $materia->tareas()->get();

            return response()->json([
                'success' => true,
                'message' => 'Tareas obtenidas correctamente.',
                'tareas' => $tareas,
                'materia' => $materia,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tareas: ' . $e->getMessage(),
            ], 500);
        }
    }
}
