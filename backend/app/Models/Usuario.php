<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = ['nombre', 'correo', 'password_hash'];
    protected $hidden = ['password_hash'];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function materias()
    {
        return $this->hasMany(Materia::class);
    }

    public function tareas()
    {
        return $this->hasMany(Tarea::class);
    }
}
