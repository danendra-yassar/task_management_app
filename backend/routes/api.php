<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\UserController;

// enpoint public 
Route::post('/auth/login', [AuthController::class, 'login']);

// protected endpoint, only accessible with valid token
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    //endpoint for task management
    Route::apiResource('tasks', TaskController::class);
    // Route::get('/tasks/task_user/{task_id}', [TaskController::class, 'show']);
    Route::post('/tasks/{id}/toggle-progress', [TaskController::class, 'toggleProgress']);

    // Route File Upload & Handling
    Route::post('/tasks/{id}/attachments', [AttachmentController::class, 'upload']);
    Route::get('/attachments/{id}/download', [AttachmentController::class, 'download']);
    Route::delete('/attachments/{id}', [AttachmentController::class, 'destroy']);

    //user
    Route::apiResource('users', UserController::class);
});