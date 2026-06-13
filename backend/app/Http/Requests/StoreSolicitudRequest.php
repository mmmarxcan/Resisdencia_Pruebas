<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSolicitudRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'incoterm'             => 'required|string|max:10',
            'tipo_servicio'        => 'required|string',
            'descripcion_material' => 'required|string',
            'valor_factura'        => 'required|numeric|min:0',
            'divisa'               => 'required|string|size:3',
            'peso_total'           => 'required|numeric|min:0',
            'unidad_peso'          => 'required|string',
            'numero_bultos'        => 'required|numeric',
            'mercancia_adicionales'=> 'required|boolean',
            'direcciones'          => 'required|array|min:1',
            'direcciones.*.tipo'   => 'required|string',
            'direcciones.*.direccion_origen' => 'required|string',
            'direcciones.*.direccion_destino' => 'required|string'
        ];
    }
}
