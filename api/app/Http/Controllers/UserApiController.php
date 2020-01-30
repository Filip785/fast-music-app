<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserApiController extends Controller
{
    public function create(Request $request)
    {
        // add validation
       $data = $request->all();

       $userData = [
           'username' => $data['username'],
           'email' => $data['email'],
           'password' => Hash::make($data['password']),
       ];

       $user = new User($userData);
       $user->api_token = Str::random(60);
       $user->save();

       return response()->json([
           'user' => $user
       ], 200);
    }

    public function login(Request $request)
    {
        $data = $request->all();

        if(!Auth::attempt(['username' => $data['username'], 'password' => $data['password']])) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'user' => Auth::user(),
            'success' => true
        ]);
    }

    public function details()
    {
        return response()->json([
            'user' =>  Auth::user()
        ], 200);
    }
}
