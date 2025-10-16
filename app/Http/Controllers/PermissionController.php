<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    // index method
    public function index()
    {
        $permissions = Permission::latest()->paginate(10);
        $permissions->getcollection()->transform(function($permission){
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'created_at' => $permission->created_at->format('d-m-Y')
            ];
        });
        
        return inertia::render('permissions/index', [
            'permissions' => $permissions
        ]);
    }

    //store method
    public function store(Request $request)
    {
        Permission::create($request ->validate([
            'name' => 'required|string|unique:permissions,name|max:255',
        ]));

        return to_route('permissions.index')->with('message', 'Permission Created Successfully!');
    }

    //store method
    public function update(Request $request, Permission $permission)
    {
        $permission->update($request ->validate([
            'name' => 'required|string|unique:permissions,name|max:255'.$permission->id,
        ]));

        return to_route('permissions.index')->with('message', 'Permission Updated Successfully!');
    }

    //destroy method
    public function destroy(Permission $permission)
    {
        $permission->delete();
        return to_route('permissions.index')->with('message', 'Permission Deleted Successfully!');
    }
}
