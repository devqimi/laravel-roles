<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log; // ✅ Add this line

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        
        // if user can view all CRFs
        if (Gate::allows('View ALL CRF')) {
            $crfs = Crf::with(['department', 'category', 'user', 'application_status', 'approver', 'assigned_user'])
            ->latest()
            ->paginate(10);
        }
        
        // ITD ADMIN can view both "assigned to ITD" and "assigned to Vendor" CRFs
        elseif (Gate::allows('View ITD CRF') && Gate::allows('View Vendor CRF')) {
            $crfs = Crf::with(['department', 'category', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('application_status_id', '>=', 2)
            ->latest()
            ->paginate(10);
        }
        // HOU can verify CRFs from their department
        elseif (Gate::allows('verified CRF')) {
            $crfs = Crf::with(['department', 'category', 'user', 'application_status', 'approver' , 'assigned_user'])
            ->where('department_id', $user->department_id)
            ->where('application_status_id', 1)
            ->latest()
            ->paginate(10);
        }
        
        
        // ITD PIC can only view ITD CRFs assigned
        elseif (Gate::allows('View ITD CRF')) {
            $crfs = Crf::with(['department', 'category', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('assigned_to', $user->id) // ✅ Only CRFs assigned to this user
            ->whereIn('application_status_id', [4, 6, 8, 9]) // Assigned to ITD, Reassigned to ITD, Work in progress, Closed
            ->latest()
            ->paginate(10);
        }
        
        // if user can view Vendor CRFs
        elseif (Gate::allows('View Vendor CRF')) {
            $crfs = Crf::with(['department', 'category', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('assigned_to', $user->id) // ✅ Only CRFs assigned to this user
            ->whereIn('application_status_id', [5, 7, 8, 9]) // Assigned to Vendor, Reassigned to Vendor, Work in progress, Closed
            ->latest()
            ->paginate(10);
        }
        
        
        // for HOU to view their department's CRFs
        elseif (Gate::allows('View Department CRF')) {
            $crfs = Crf::with(['department', 'category', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('department_id', $user->department_id) // ✅ match by ID
            ->latest()
            ->paginate(10);
        } 
        
        // user can only view their own CRFs
        elseif (Gate::allows('View Personal CRF')) {
            $crfs = Crf::with(['department', 'category', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);
        }
        // No permission at all
        else {
            abort(403, 'Unauthorized to view CRFs');
        }
        
        $itdPics = User::role('ITD PIC')->select('id', 'name')->get();
        $vendorPics = User::role('VENDOR PIC')->select('id', 'name')->get();

        return Inertia::render('dashboard', [
            'crfs' => $crfs,
            'can_view' =>Gate::allows('View Personal CRF'),
            'can_delete' =>Gate::allows('Close Assigned CRF'),
            'can_create' => Gate::allows('Create CRF'),
            'can_approve' => Gate::allows('verified CRF'),
            'can_acknowledge' => Gate::allows('Acknowledge CRF by ITD'),
            'can_assign_itd' => Gate::allows('Assign CRF To ITD') || Gate::allows('Re Assign PIC ITD'),
            'can_assign_vendor' => Gate::allows('Assign CRF to Vendor') || Gate::allows('Re Assign PIC Vendor'),
            'can_update_own_crf' => Gate::allows('Update CRF (own CRF)'),
            'itd_pics' => $itdPics,
            'vendor_pics' => $vendorPics,
        ]);
    }
}