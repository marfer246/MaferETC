<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Vista para usuarios con soft deletes
        DB::statement("
            CREATE VIEW usuarios_view AS
            SELECT * FROM usuarios
        ");

        // Vista para materias con soft deletes
        DB::statement("
            CREATE VIEW materias_view AS
            SELECT * FROM materias
        ");

        // Vista para tareas con soft deletes
        DB::statement("
            CREATE VIEW tareas_view AS
            SELECT * FROM tareas
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS usuarios_view");
        DB::statement("DROP VIEW IF EXISTS materias_view");
        DB::statement("DROP VIEW IF EXISTS tareas_view");
    }
};
