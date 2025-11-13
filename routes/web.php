<?php

use App\Models\Crf;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CrfController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\CrfAttachmentController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/api/departments', function () {
    return response()->json(Department::all());
});

Route::get('/api/categories', function () {
    return response()->json(Category::all());
});

Route::get('/api/crforms', function () {
    return response()->json(Crf::all());
});

Route::middleware(['auth:sanctum'])->get('/api/user', function (Request $request) {
    $user = $request->user()->load('department'); // if user has relation
    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'nric' => $user->nric,
        'department_id' => $user->department_id,
        'department_name' => $user->department?->dname,
        'email' => $user->email,
    ]);
});

Route::get('crfs/check-status', [CrfController::class, 'checkStatus'])->name('crfs.checkStatus');

Route::middleware(['auth', 'verified'])->group(function () {

    //dashboard routes
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

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

    //crf routes
    Route::get('crfs', [CrfController::class, 'index'])->name('crfs.index')->middleware('can:View Personal CRF');
    Route::post('crfs', [CrfController::class, 'store'])->name('crfs.store')->can('Create CRF');
    Route::get('crfs/create', [CrfController::class, 'create'])->name('crfs.create')->can('Create CRF');
    Route::delete('crfs/{crf}', [CrfController::class, 'destroy'])->name('crfs.destroy')->can('Close Assigned CRF');
    Route::post('crfs/{crf}/approve', [CrfController::class, 'approve'])->name('crfs.approve')->can('verified CRF');
    Route::post('crfs/{crf}/acknowledge', [CrfController::class, 'acknowledge'])->name('crfs.acknowledge')->can('Acknowledge CRF by ITD');
    Route::post('crfs/{crf}/assign-to-itd', [CrfController::class, 'assignToItd'])->name('crfs.assignToItd')->can('Assign CRF To ITD');
    Route::post('crfs/{crf}/assign-to-vendor', [CrfController::class, 'assignToVendor'])->name('crfs.assignToVendor')->can('Assign CRF to Vendor');
    Route::get('crfs/{crf}', [CrfController::class, 'show'])->name('crfs.show');
    Route::put('crfs/{crf}', [CrfController::class, 'update'])->name('crfs.update')->can('Update CRF (own CRF)');
    Route::put('crfs/{crf}/mark-in-progress', [CrfController::class, 'markInProgress'])->name('crfs.markInProgress')->can('Update CRF (own CRF)');
    Route::put('crfs/{crf}/mark-completed', [CrfController::class, 'markCompleted'])->name('crfs.markCompleted')->can('Update CRF (own CRF)');
    Route::post('crfs/{crf}/reassign-to-itd', [CrfController::class, 'reassignToItd'])->name('crfs.reassignToItd')->can('Re Assign PIC ITD');
    Route::post('crfs/{crf}/reassign-to-vendor', [CrfController::class, 'reassignToVendor'])->name('crfs.reassignToVendor')->can('Re Assign PIC Vendor');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
});

Route::get('/crfs/attachments/{attachment}/download', [CrfAttachmentController::class, 'download'])->name('crfs.attachments.download');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
