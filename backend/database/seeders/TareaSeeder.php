<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TareaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Tarea::create([
            'titulo' => 'Resolver ejercicios de grafos',
            'descripcion' => '¡Qué padre! Hay que entregar el proyecto a tiempo, no vaya a ser que nos caiga el chahuistle.',
            'prioridad' => 'Alta',
            'fecha' => '2024-04-01',
            'completada' => false,
            'usuario_id' => 1,
            'materia_id' => 1,
        ]);
        \App\Models\Tarea::create([
            'titulo' => 'Implementar patrón Singleton',
            'descripcion' => 'No hay bronca, pero el código debe estar bien chido para la presentación.',
            'prioridad' => 'Media',
            'fecha' => '2024-04-02',
            'completada' => true,
            'usuario_id' => 2,
            'materia_id' => 2,
        ]);
    }
}
