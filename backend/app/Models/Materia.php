<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Materia extends Model
{
    use SoftDeletes;

    protected $fillable = ['nombre', 'profesor', 'color', 'usuario_id'];
    protected $dates = ['deleted_at'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function tareas()
    {
        return $this->hasMany(Tarea::class);
    }
}
