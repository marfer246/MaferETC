<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tarea;
use Illuminate\Http\Request;

class TareaController extends Controller
{
    public function index(Request $request)
    {
        $tareas = $request->user()->tareas()->with('materia')->get();
        return response()->json(['success' => true, 'tareas' => $tareas], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string',
            'descripcion' => 'sometimes|string',
            'prioridad' => 'required|in:Alta,Media,Baja',
            'fecha' => 'required|date',
            'materia_id' => 'required|exists:materias,id',
        ]);

        $tarea = $request->user()->tareas()->create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion ?? '',
            'prioridad' => $request->prioridad,
            'fecha' => $request->fecha,
            'materia_id' => $request->materia_id,
            'completada' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tarea creada con éxito.',
            'tarea' => $tarea->load('materia'),
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $tarea = Tarea::findOrFail($id);

        if ($tarea->usuario_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'No tienes permisos para esta acción.'], 403);
        }

        return response()->json(['success' => true, 'tarea' => $tarea->load('materia')], 200);
    }

    public function update(Request $request, $id)
    {
        $tarea = Tarea::findOrFail($id);

        if ($tarea->usuario_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'No tienes permisos para esta acción.'], 403);
        }

        $request->validate([
            'titulo' => 'sometimes|string',
            'descripcion' => 'sometimes|string',
            'prioridad' => 'sometimes|in:Alta,Media,Baja',
            'fecha' => 'sometimes|date',
            'completada' => 'sometimes|boolean',
        ]);

        $tarea->update($request->only(['titulo', 'descripcion', 'prioridad', 'fecha', 'completada']));

        return response()->json([
            'success' => true,
            'message' => 'Tarea guardada.',
            'tarea' => $tarea->load('materia'),
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $tarea = Tarea::findOrFail($id);

        if ($tarea->usuario_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'No tienes permisos para esta acción.'], 403);
        }

        $tarea->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tarea eliminada.',
        ], 200);
    }
}
