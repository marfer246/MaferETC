<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tarea extends Model
{
    use SoftDeletes;

    protected $fillable = ['titulo', 'descripcion', 'prioridad', 'fecha', 'completada', 'usuario_id', 'materia_id'];
    protected $dates = ['deleted_at'];
    protected $casts = [
        'completada' => 'boolean',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function materia()
    {
        return $this->belongsTo(Materia::class);
    }
}
