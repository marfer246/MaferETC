<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    protected $fillable = ['titulo', 'descripcion', 'prioridad', 'fecha', 'completada', 'usuario_id', 'materia_id'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function materia()
    {
        return $this->belongsTo(Materia::class);
    }
}
