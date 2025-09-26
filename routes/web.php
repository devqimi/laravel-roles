<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    //permissions routes
    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index')->can('view any permissions');
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store')->can('create permissions');
    Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update')->can('update permission');
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy')->can('delete permission');

    //roles routes
    Route::get('roles', [RoleController::class, 'index'])->name('roles.index')->can('view any roles');
    Route::post('roles', [RoleController::class, 'store'])->name('roles.store')->can('create roles');
    Route::get('roles/create', [RoleController::class, 'create'])->name('roles.create')->can('create roles');
    Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit')->can('update roles');
    Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update')->can('update roles');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy')->can('delete role');

    //users routes
    Route::get('users', [UserController::class, 'index'])->name('users.index')->can('view any users');
    Route::post('users', [UserController::class, 'store'])->name('users.store')->can('create user');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create')->can('create user');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit')->can('update users');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update')->can('update users');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy')->can('delete user');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
