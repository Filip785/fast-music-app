<?php

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('user/create', 'UserApiController@create');
Route::post('user/login', 'UserApiController@login');
Route::middleware('auth:api')->get('user/specific/{exceptUserId}', 'UserApiController@specific');
Route::middleware('auth:api')->post('user/details', 'UserApiController@details');

Route::middleware('auth:api')->get('artist', 'ArtistApiController@index');
Route::middleware('auth:api')->post('artist/create', 'ArtistApiController@create');

Route::middleware('auth:api')->get('audio', 'AudioItemApiController@index');
Route::middleware('auth:api')->get('audio/details/{audioItemId}', 'AudioItemApiController@details');
Route::middleware('auth:api')->post('audio/add', 'AudioItemApiController@add');
Route::middleware('auth:api')->put('audio/edit/{audioItemId}', 'AudioItemApiController@edit');
Route::middleware('auth:api')->post('audio/like', 'AudioItemApiController@like');