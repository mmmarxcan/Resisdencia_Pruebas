<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Solicitud extends Model
{
    use HasFactory , SoftDeletes ;

    protected $table = 'Solicitudes';

    protected $fillable = [
        'incoterm',
        'tipo_servicio',
        'descripcion_material',
        'valor_factura',
        'divisa',
        'peso_total',
        'unidad_peso',
        'numero_bultos',
        'mercancia_adicionales',
        'servicios_adicionales'    
    ];

    protected $attributes = [
        'estatus' => 'pendiente'
    ];
    protected $casts = [
        'servicios_adicionales'=> 'array',
        'mercancia_adicionales'=> 'boolean'
    ];
    public function direcciones(){
        return $this->hasMany(DireccionLogistica::class, 'solicitud_id');
    }
}
