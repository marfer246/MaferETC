<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MateriasController;
use App\Http\Controllers\Api\TareasController;

// Rutas públicas (sin autenticación)
Route::post('/registro', [AuthController::class, 'registro']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/recuperar-contrasena', [AuthController::class, 'resetPassword']);

// Rutas protegidas (requieren token Sanctum) 
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getActiveSession']);

    // Materias
    Route::apiResource('materias', MateriasController::class);

    // Tareas
    Route::apiResource('tareas', TareasController::class);
    Route::get('/materias/{materiaId}/tareas', [TareasController::class, 'porMateria']);
});


