<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MateriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Materia::create([
            'nombre' => 'Matemáticas Discretas',
            'profesor' => 'Dr. Carlos Ramírez',
            'color' => '#FF5733',
            'usuario_id' => 1,
        ]);
        \App\Models\Materia::create([
            'nombre' => 'Programación Orientada a Objetos',
            'profesor' => 'Dra. Ana López',
            'color' => '#33FF57',
            'usuario_id' => 2,
        ]);
    }
}
