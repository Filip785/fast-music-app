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
        $request->validate([
            'name' => 'required',
            'email' => 'required|unique:users|email',
            'password' => 'required|min:6'
        ]);

        // add validation
       $data = $request->all();

       $user = new User([
           'name' => $data['name'],
           'email' => $data['email'],
           'password' => Hash::make($data['password']),
       ]);
       $user->api_token = Str::random(60);
       $user->save();

       return response()->json([
           'user' => $user
       ], 200);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $data = $request->all();

        if(!Auth::attempt(['email' => $data['email'], 'password' => $data['password']])) {
            return response()->json(['error' => true], 401);
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
