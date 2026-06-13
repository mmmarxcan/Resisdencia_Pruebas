<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DireccionLogistica extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'direcciones_logisticas';

    protected $fillable = [
        'solicitud_id',
        'tipo',
        'direccion',
        'direcciones_logisticas',
    ];

    public function solicitud(){
        return $this->belongsTo(Solicitud::class, 'solicitud_id');
    }
}
