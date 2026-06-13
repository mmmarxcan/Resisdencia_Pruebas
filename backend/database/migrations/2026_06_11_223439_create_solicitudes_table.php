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
        Schema::create('solicitudes', function (Blueprint $table) {
            $table->id();
            $table->string('incoterm');
            $table->string('tipo_servicio');
            $table->text('descripcion_material');
            $table->decimal('valor_factura',15,2);
            $table->string('divisa', 3);
            $table->decimal('peso_total', 10,2);
            $table->string('unidad_peso', 2);
            $table->integer('numero_bultos');
            $table->boolean('mercancia_adicionales')->nullable(false);
            $table->json('servicios_adicionales')->nullable();
            $table->string('estatus')->default('pendiente');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes');
    }
};
