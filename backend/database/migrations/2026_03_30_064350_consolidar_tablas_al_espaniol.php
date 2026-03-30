<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrar datos de users (si existen) a usuarios
        if (Schema::hasTable('users')) {
            $users = DB::table('users')->get();
            foreach ($users as $user) {
                // Evitar duplicados con base en correo
                if (!DB::table('usuarios')->where('correo', $user->email)->exists()) {
                    DB::table('usuarios')->insert([
                        'nombre' => $user->name ?? 'Sin nombre',
                        'correo' => $user->email,
                        'password_hash' => $user->password,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ]);
                }
            }

            Schema::dropIfExists('users');
        }

        // Tabla default password_reset_tokens -> español opcional
        if (Schema::hasTable('password_reset_tokens') && !Schema::hasTable('tokens_reseteo')) {
            Schema::rename('password_reset_tokens', 'tokens_reseteo');
        }

        // Tabla sessions -> sesiones
        if (Schema::hasTable('sessions') && !Schema::hasTable('sesiones')) {
            Schema::rename('sessions', 'sesiones');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('usuarios') && !Schema::hasTable('users')) {
            // no revertimos datos, solo renombrado
            // Este down no restaura usuarios de users originales
        }

        if (Schema::hasTable('tokens_reseteo') && !Schema::hasTable('password_reset_tokens')) {
            Schema::rename('tokens_reseteo', 'password_reset_tokens');
        }

        if (Schema::hasTable('sesiones') && !Schema::hasTable('sessions')) {
            Schema::rename('sesiones', 'sessions');
        }
    }
};
