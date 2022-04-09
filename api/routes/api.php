<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::get('/unauthorized', function () {
    return response()->json(["message" => "Usuário não autenticado"], 400);
})->name('unauthorized');

Route::group(['prefix' => 'auth'], function () {
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('me', [AuthController::class, 'me']);
});

Route::resource('users', UserController::class);
Route::resource('products', ProductController::class);
Route::resource('opportunities', OpportunityController::class);
Route::put('opportunities/stauts/{id}', [OpportunityController::class, 'stauts'])->where('id', '[0-9]+');