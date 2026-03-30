<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\MateriaController;
use App\Http\Controllers\Api\TareaController;

// Rutas públicas
Route::post('/registro', [AuthController::class, 'registro']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas (requieren token)
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/sesion-activa', [AuthController::class, 'getActiveSession']);

    // Materias
    Route::apiResource('materias', MateriaController::class);

    // Tareas
    Route::apiResource('tareas', TareaController::class);
});
