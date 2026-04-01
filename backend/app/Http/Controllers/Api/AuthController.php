<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function registro(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'correo' => 'required|string|email|unique:usuarios',
            'password' => 'required|string|min:6',
        ]);

        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'correo' => $request->correo,
            'password_hash' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registro exitoso. Ya puedes iniciar sesión.',
            'usuario' => $usuario,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'correo' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $usuario = Usuario::where('correo', $request->correo)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password_hash)) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario o contraseña incorrectos. Verifica tus datos y vuelve a intentarlo.',
            ], 401);
        }

        $token = $usuario->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Sesión iniciada correctamente.',
            'usuario' => $usuario,
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada con éxito.',
        ], 200);
    }

    public function getActiveSession(Request $request)
    {
        return response()->json([
            'success' => true,
            'usuario' => $request->user(),
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'correo' => 'required|string|email',
            'password' => 'required|string|min:6',
        ]);

        $usuario = Usuario::where('correo', $request->correo)->first();

        if (!$usuario) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró usuario con ese correo.',
            ], 404);
        }

        $usuario->password_hash = Hash::make($request->password);
        $usuario->save();

        return response()->json([
            'success' => true,
            'message' => 'Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.',
        ], 200);
    }
}
