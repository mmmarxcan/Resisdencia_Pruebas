<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SolicitudController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/solicitudes', [SolicitudController::class , 'store']);
Route::get('/solicitudes', [SolicitudController::class , 'index']);