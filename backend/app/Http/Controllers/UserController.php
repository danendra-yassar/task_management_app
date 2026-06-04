<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET /api/users - Mengambil semua user
    public function index(Request $request)
    {
        try {
            $users = User::orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 8));
                
            return response()->json($users, 200);
        }catch (\Exception $e) {
            // Jika crash, kirim pesan eror aslinya ke postman/console agar mudah dibaca
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // POST /api/users - Menambah user baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:1,2,3',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json([
            'message' => 'User baru berhasil dibuat.',
            'user' => $user
        ], 201);
    }

    // PUT /api/users/{id} - Mengedit data & Privilege/Role User
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|required|string|in:1,2,3',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']); // Jangan update password jika kosong
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User berhasil diperbarui.',
            'user' => $user
        ], 200);
    }

    // DELETE /api/users/{id} - Menghapus User
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan.'], 404);
        }

        // Mencegah user menghapus akunnya sendiri secara tidak sengaja via manajemen menu
        if ($request->user()->id == $user->id) {
             return response()->json(['message' => 'Tidak dapat menghapus akun Anda sendiri.'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus.'], 200);
    }
}
