<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
    public function store(Request $request)
    {
        try {
            $solicitud = DB::transaction(function () use ($request){

            $nuevaSolicitud = Solicitud::create($request->all());
            if ($request->has('direcciones') && is_array($request->direcciones)) {
                $nuevaSolicitud->direcciones()->createMany($request->direcciones);
            }
            return  $nuevaSolicitud;
            });

            return response()->json([
                'mensaje' => 'Solicitud logistica creada con exito',
                'data' => $solicitud->load('direcciones'),
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
