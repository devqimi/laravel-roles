<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CrfController extends Controller
{
    
    public function create(Request $request)
    {

        /** @var \App\Models\User|null $user */
        $user = $request->user();
            
        if (!$user) {
            abort(403, 'User not authenticated.');
        }
        
        $user->load('department');
        
        $departments = Department::select('id', 'dname')->get();
        $categories = Category::select('id', 'cname')->get();
        
        return Inertia::render('crfs/create', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'nric' => $user->nric,
                'email' => $user->email,
                'department_id' => $user->department_id,
                'department_name' => $user->department?->dname,
            ],
            'departments' => $departments,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nric' => 'required|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'designation' => 'required|string|max:255',
            'extno' => 'required|string|max:10',
            'category_id' => 'required|exists:categories,id',
            'issue' => 'required|string',
            'reason' => 'nullable|string',
            'supporting_file' => 'nullable|file|mimes:pdf,png,jpeg|max:2048',
        ]);

        // Handle file upload if present
        if ($request->hasFile('supporting_file')) {
            $validated['supporting_file'] = $request->file('supporting_file')->store('crf_files', 'public');
        }

        // Map 'name' to 'fname' for the database
        $validated['fname'] = $validated['name'];
        unset($validated['name']);

        // Add the current logged-in user ID
        $validated['user_id'] = Auth::id();
        Crf::create($validated);

        // Save to database
        //\App\Models\Crf::create($validated);

        return redirect()->route('dashboard')->with('success', 'CRF submitted successfully!');
    }
}
