<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // 1. POST /api/auth/login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // validation
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Kredensial yang Anda masukkan salah.'
            ], 401);
        }

        // create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 200);
    }

    // 2. GET /api/auth/me
    public function me(Request $request)
    {
        // return data user 
        return response()->json($request->user(), 200);
    }

    // 3. POST /api/auth/logout
    public function logout(Request $request)
    {
        // delete current access token
        $request->user()->currentAccessToken()->delete();

        return response()->json([   
            'message' => 'Berhasil logout, token telah dihapus.'
        ], 200);
    }
}