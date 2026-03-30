<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Usuario::create([
            'nombre' => 'José Luis García',
            'correo' => 'joseluis@unam.mx',
            'password_hash' => \Illuminate\Support\Facades\Hash::make('password123'),
        ]);
        \App\Models\Usuario::create([
            'nombre' => 'María Guadalupe Hernández',
            'correo' => 'mariag@unam.mx',
            'password_hash' => \Illuminate\Support\Facades\Hash::make('password456'),
        ]);
    }
}
