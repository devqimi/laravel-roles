<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // ✅ If user can view all CRFs
        if (Gate::allows('View ALL CRF')) {
            $crfs = Crf::with(['department', 'category', 'user'])
                ->latest()
                ->paginate(10);
        }
        // ✅ If user can view both ITD and Vendor CRFs (like ITD ADMIN)
        elseif (Gate::allows('View ITD CRF') && Gate::allows('View Vendor CRF')) {
            $crfs = Crf::with(['department', 'category', 'user'])
                ->whereHas('department', function($query) {
                    $query->whereIn('dname', ['Unit Teknologi Maklumat', 'Vendor']); // Show both
                })
                ->latest()
                ->paginate(10);
        }
        // ✅ If user can view ITD CRFs
        elseif (Gate::allows('View ITD CRF')) {
            $crfs = Crf::with(['department', 'category', 'user'])
                ->whereHas('department', function($query) {
                    $query->where('dname', 'Unit Teknologi Maklumat'); // Adjust based on your category name
                })
                ->latest()
                ->paginate(10);
        }
        // ✅ If user can view Vendor CRFs
        elseif (Gate::allows('View Vendor CRF')) {
            $crfs = Crf::with(['department', 'category', 'user'])
                ->whereHas('department', function($query) {
                    $query->where('dname', 'Vendor'); // Adjust based on your category name
                })
                ->latest()
                ->paginate(10);
        }
        // ✅ If user can only view their own CRFs
        elseif (Gate::allows('View Personal CRF')) {
            $crfs = Crf::with(['department', 'category', 'user'])
                ->where('user_id', $user->id)
                ->latest()
                ->paginate(10);
        } 
        elseif (Gate::allows('View Department CRF')) {
            $crfs = Crf::with(['department', 'category', 'user'])
                ->where('department_id', $user->department_id) // ✅ match by ID
                ->latest()
                ->paginate(10);
        } 
        // ✅ No permission at all
        else {
            abort(403, 'Unauthorized to view CRFs');
        }

        return Inertia::render('dashboard', [
            'crfs' => $crfs,
        ]);
    }
}