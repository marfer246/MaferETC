<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materia;
use Illuminate\Http\Request;

class MateriasController extends Controller
{
    /**
     * Listar todas las materias del usuario autenticado
     */
    public function index(Request $request)
    {
        try {
            $materias = $request->user()->materias()->get();

            return response()->json([
                'success' => true,
                'message' => 'Materias obtenidas correctamente.',
                'materias' => $materias,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener materias: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Crear una nueva materia
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:255',
                'profesor' => 'required|string|max:255',
                'color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
            ]);

            $materia = $request->user()->materias()->create([
                'nombre' => $request->nombre,
                'profesor' => $request->profesor,
                'color' => $request->color,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Materia creada correctamente.',
                'materia' => $materia,
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
                'message' => 'Error al crear materia: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener una materia específica
     */
    public function show(Request $request, Materia $materia)
    {
        try {
            // Verificar que la materia pertenezca al usuario autenticado
            if ($materia->usuario_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autorizado.',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'materia' => $materia,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener materia: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar una materia
     */
    public function update(Request $request, Materia $materia)
    {
        try {
            // Verificar que la materia pertenezca al usuario autenticado
            if ($materia->usuario_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autorizado.',
                ], 403);
            }

            $request->validate([
                'nombre' => 'sometimes|string|max:255',
                'profesor' => 'sometimes|string|max:255',
                'color' => 'sometimes|string|regex:/^#[0-9A-F]{6}$/i',
            ]);

            $materia->update($request->only(['nombre', 'profesor', 'color']));

            return response()->json([
                'success' => true,
                'message' => 'Materia actualizada correctamente.',
                'materia' => $materia,
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
                'message' => 'Error al actualizar materia: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar una materia (soft delete)
     */
    public function destroy(Request $request, Materia $materia)
    {
        try {
            // Verificar que la materia pertenezca al usuario autenticado
            if ($materia->usuario_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autorizado.',
                ], 403);
            }

            $materia->delete(); // Soft delete

            return response()->json([
                'success' => true,
                'message' => 'Materia eliminada correctamente.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar materia: ' . $e->getMessage(),
            ], 500);
        }
    }
}
