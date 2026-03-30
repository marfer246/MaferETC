<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materia;
use Illuminate\Http\Request;

class MateriaController extends Controller
{
    public function index(Request $request)
    {
        $materias = $request->user()->materias()->with('tareas')->get();
        return response()->json(['success' => true, 'materias' => $materias], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'profesor' => 'required|string',
            'color' => 'required|string',
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
    }

    public function show(Request $request, $id)
    {
        $materia = Materia::findOrFail($id);
        
        if ($materia->usuario_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'No tienes permisos para esta acción.'], 403);
        }

        return response()->json(['success' => true, 'materia' => $materia->load('tareas')], 200);
    }

    public function update(Request $request, $id)
    {
        $materia = Materia::findOrFail($id);

        if ($materia->usuario_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'No tienes permisos para esta acción.'], 403);
        }

        $request->validate([
            'nombre' => 'sometimes|string',
            'profesor' => 'sometimes|string',
            'color' => 'sometimes|string',
        ]);

        $materia->update($request->only(['nombre', 'profesor', 'color']));

        return response()->json([
            'success' => true,
            'message' => 'Materia actualizada correctamente.',
            'materia' => $materia,
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $materia = Materia::findOrFail($id);

        if ($materia->usuario_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'No tienes permisos para esta acción.'], 403);
        }

        $materia->delete();

        return response()->json([
            'success' => true,
            'message' => 'Materia eliminada correctamente.',
        ], 200);
    }
}
