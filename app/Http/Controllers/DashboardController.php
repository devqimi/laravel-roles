<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // if user can view all CRFs
        if (Gate::allows('View ALL CRF')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
            ->latest()
            ->paginate(10);

            $departmentCrfs = null;
        }
        
        // ITD ADMIN can view both "assigned to ITD" and "assigned to Vendor" CRFs
        elseif (Gate::allows('View ITD CRF') && Gate::allows('View Vendor CRF')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('application_status_id', '>=', 2)
            ->latest()
            ->paginate(10);

            $departmentCrfs = null;
        }

        // TP approve
        elseif (Gate::allows('approved by TP')) {
            // TP can view CRFs that need their approval (status 10)
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
                ->where('application_status_id', 10) // Verified by HOU, awaiting TP
                ->latest()
                ->paginate(10);
            
            $departmentCrfs = null;
        }

        // HOU can verify CRFs from their department
        elseif (Gate::allows('verified CRF') && Gate::allows('View Department CRF')) {

                $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver' , 'assigned_user'])
                ->where('department_id', $user->department_id)
                ->where('application_status_id', 1)
                ->latest()
                ->paginate(10);
                
                $departmentCrfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
                ->where('department_id', $user->department_id)
                ->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
                ->orderBy('created_at', 'desc')
                ->latest()
                ->get();
        }
        
        // ITD PIC can only view ITD CRFs assigned
        elseif (Gate::allows('View ITD CRF')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('assigned_to', $user->id) // Only CRFs assigned to this user
            ->whereIn('application_status_id', [4, 6, 8, 9]) // Assigned to ITD, Reassigned to ITD, Work in progress, Closed
            ->latest()
            ->paginate(10);

            $departmentCrfs = null;
        }
        
        // if user can view Vendor CRFs
        elseif (Gate::allows('View Vendor CRF')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('assigned_to', $user->id) // Only CRFs assigned to this user
            ->whereIn('application_status_id', [5, 7, 8, 9]) // Assigned to Vendor, Reassigned to Vendor, Work in progress, Closed
            ->latest()
            ->paginate(10);

            $departmentCrfs = null;
        }
        
        // user can only view their own CRFs
        elseif (Gate::allows('View Personal CRF')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

            $departmentCrfs = null;
        }

        // No permission at all
        else {
            abort(403, 'Unauthorized to view CRFs');
        }
        
        $itdPics = User::role('ITD PIC')->select('id', 'name')->get();
        $vendorPics = User::role('VENDOR PIC')->select('id', 'name')->get();

        return Inertia::render('dashboard', [
            'crfs' => $crfs,
            'department_crfs' => $departmentCrfs,
            'can_view' =>Gate::allows('View Personal CRF'),
            'can_view_department' => Gate::allows('View Department CRF'),
            'can_delete' =>Gate::allows('Close Assigned CRF'),
            'can_create' => Gate::allows('Create CRF'),
            'can_approve' => Gate::allows('verified CRF'),
            'can_acknowledge' => Gate::allows('Acknowledge CRF by ITD'),
            'can_assign_itd' => Gate::allows('Assign CRF To ITD') || Gate::allows('Re Assign PIC ITD'),
            'can_assign_vendor' => Gate::allows('Assign CRF to Vendor') || Gate::allows('Re Assign PIC Vendor'),
            'can_update_own_crf' => Gate::allows('Update CRF (own CRF)'),
            'itd_pics' => $itdPics,
            'vendor_pics' => $vendorPics,
            'can_approve_tp' => Gate::allows('approved by TP'),
        ]);
    }
}