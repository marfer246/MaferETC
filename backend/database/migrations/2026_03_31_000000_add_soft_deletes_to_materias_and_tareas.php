<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Agregar soft delete a materias
        if (Schema::hasTable('materias') && !Schema::hasColumn('materias', 'deleted_at')) {
            Schema::table('materias', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        // Agregar soft delete a tareas
        if (Schema::hasTable('tareas') && !Schema::hasColumn('tareas', 'deleted_at')) {
            Schema::table('tareas', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('materias', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('tareas', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
