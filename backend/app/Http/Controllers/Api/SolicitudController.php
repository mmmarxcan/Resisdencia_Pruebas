<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSolicitudRequest;
//use Illuminate\Container\Attributes\DB;
use Illuminate\Http\Request;
use App\Models\Solicitud;
use Illuminate\Support\Facades\DB;

class SolicitudController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSolicitudRequest $request)
    {
        $datosValidos = $request->validated();

        try {
            $solicitudCreada = DB::transaction( function() use ($datosValidos){
                $solicitud = Solicitud::create($datosValidos);
                if(isset($datosValidos['direcciones'])){
                    $solicitud->direcciones()->createMany($datosValidos['direcciones']);
                }
                return $solicitud;
            });
            return response()->json([
                'mensaje' => 'Solicitud Creada con exito',
                'data' => $solicitudCreada->load('direcciones')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'mensaje' => 'Error al crear la solicitud',
            'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
