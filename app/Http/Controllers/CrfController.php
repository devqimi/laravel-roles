<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Models\ApplicationStatus;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

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
        $validated['application_status_id'] = 1;
        
        Crf::create($validated);

        // Save to database
        //\App\Models\Crf::create($validated);

        return redirect()->route('dashboard')->with('success', 'CRF submitted successfully!');
    }

    public function destroy(Crf $crf)
    {
        // Delete the supporting file if it exists
        if ($crf->supporting_file) {
            Storage::disk('public')->delete($crf->supporting_file);
        }
        
        $crf->delete();

        return redirect()->route('dashboard')->with('success', 'CRF deleted successfully!');
    }

    public function approve(Crf $crf){
        
        $user = Auth::user();

        // Check if CRF is from the same department as HOU
        if($crf->department_id !== $user->department_id){
            abort(403, 'You can only approve CRFs from your department');
        }

        // Check if already approved
        if ($crf->application_status_id != 1) { // 1 is created
            return redirect()->route('dashboard')->with('error', 'CRF has already been processed');
        }

        // Update to "Approved by HOU" (id: 2)
        $crf->update([
            'application_status_id' => 2,
            'approved_by' => $user->id,
        ]);

        return redirect()->route('dashboard')->with('success', 'CRF approved successfully!');
    }

    public function acknowledge(Crf $crf)
    {
        // Check if CRF is in "Verified" status (id: 2)
        if ($crf->application_status_id != 2) {
            return redirect()->route('dashboard')->with('error', 'CRF must be verified before acknowledgment');
        }
        
        // Update to "ITD Acknowledged" (id: 3)
        $crf->update([
            'application_status_id' => 3,
        ]);
        
        return redirect()->route('dashboard')->with('success', 'CRF acknowledged successfully!');
    }

    public function assignToItd(Request $request, Crf $crf)
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        // Check if CRF is in "ITD Acknowledged" status
        if ($crf->application_status_id != 3) {
            return redirect()->route('dashboard')->with('error', 'CRF must be acknowledged before assignment');
        }

        // Verify the user has ITD PIC role
        $user = User::find($validated['assigned_to']);
        if (!$user->hasRole('ITD PIC')) {
            return redirect()->route('dashboard')->with('error', 'Selected user is not an ITD PIC');
        }

        // Update to "Assigned to ITD" (id: 4)
        $crf->update([
            'application_status_id' => 4,
            'assigned_to' => $validated['assigned_to'],
        ]);

        return redirect()->route('dashboard')->with('success', 'CRF assigned to ITD successfully!');
    }

    public function assignToVendor(Request $request, Crf $crf)
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        // Check if CRF is in "ITD Acknowledged" status
        if ($crf->application_status_id != 3) {
            return redirect()->route('dashboard')->with('error', 'CRF must be acknowledged before assignment');
        }

        // Verify the user has Vendor PIC role
        $user = User::find($validated['assigned_to']);
        if (!$user->hasRole('VENDOR PIC')) {
            return redirect()->route('dashboard')->with('error', 'Selected user is not a Vendor PIC');
        }

        // Update to "Assigned to Vendor" (id: 5)
        $crf->update([
            'application_status_id' => 5,
            'assigned_to' => $validated['assigned_to'],
        ]);

        return redirect()->route('dashboard')->with('success', 'CRF assigned to Vendor successfully!');
    }

    public function reassignToItd(Request $request, Crf $crf)
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        // Check if CRF is currently assigned to ITD (status 4 or 6 or 8)
        if (!in_array($crf->application_status_id, [4, 6, 8])) {
            return redirect()->back()->with('error', 'Can only reassign ITD CRFs');
        }

        // Verify the user has ITD PIC role
        $user = User::find($validated['assigned_to']);
        if (!$user->hasRole('ITD PIC')) {
            return redirect()->back()->with('error', 'Selected user is not an ITD PIC');
        }

        // Update to "Reassigned to ITD" (id: 6)
        $crf->update([
            'application_status_id' => 6,
            'assigned_to' => $validated['assigned_to'],
        ]);

        return redirect()->back()->with('success', 'CRF reassigned to ITD successfully!');
    }

    public function reassignToVendor(Request $request, Crf $crf)
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        // Check if CRF is currently assigned to Vendor (status 5 or 7 or 8)
        if (!in_array($crf->application_status_id, [5, 7, 8])) {
            return redirect()->back()->with('error', 'Can only reassign Vendor CRFs');
        }

        // Verify the user has Vendor PIC role
        $user = User::find($validated['assigned_to']);
        if (!$user->hasRole('VENDOR PIC')) {
            return redirect()->back()->with('error', 'Selected user is not a Vendor PIC');
        }

        // Update to "Reassigned to Vendor" (id: 7)
        $crf->update([
            'application_status_id' => 7,
            'assigned_to' => $validated['assigned_to'],
        ]);

        return redirect()->back()->with('success', 'CRF reassigned to Vendor successfully!');
    }

    public function show(Crf $crf)
    {
        $crf->load(['department', 'category', 'application_status', 'approver', 'assigned_user']);
        
        // Get ITD and Vendor PICs for reassignment
        $itdPics = User::role('ITD PIC')->select('id', 'name')->get();
        $vendorPics = User::role('VENDOR PIC')->select('id', 'name')->get();
        
        return Inertia::render('crfs/show', [
            'crf' => $crf,
            'can_update' => Gate::allows('Update CRF (own CRF)') && $crf->assigned_to === Auth::id(),
            'can_reassign_itd' => Gate::allows('Re Assign PIC ITD'),
            'can_reassign_vendor' => Gate::allows('Re Assign PIC Vendor'),
            'itd_pics' => $itdPics,
            'vendor_pics' => $vendorPics,
        ]);
    }

    public function update(Request $request, Crf $crf)
    {
        // Check if user is assigned to this CRF
        if ($crf->assigned_to !== Auth::id()) {
            abort(403, 'You can only update CRFs assigned to you');
        }

        $validated = $request->validate([
            'it_remark' => 'nullable|string',
        ]);

        $crf->update($validated);

        return redirect()->back()->with('success', 'Remark updated successfully');
    }

    public function markInProgress(Crf $crf)
    {
        if ($crf->assigned_to !== Auth::id()) {
            abort(403);
        }

        $crf->update(['application_status_id' => 8]); // Work in progress

        return redirect()->back()->with('success', 'CRF marked as in progress');
    }

    public function markCompleted(Crf $crf)
    {
        if ($crf->assigned_to !== Auth::id()) {
            abort(403);
        }

        $crf->update(['application_status_id' => 9]); // Closed

        return redirect()->back()->with('success', 'CRF marked as closed');
    }

    public function checkStatus(Request $request)
    {
        $searchResults = null;
        $searchValue = null;

        if ($request->has('search')) {
            $searchValue = $request->input('search');
            
            // Search across multiple fields
            $searchResults = Crf::with(['department', 'category', 'application_status', 'assigned_user', 'approver'])
                ->where(function($query) use ($searchValue) {
                    // Remove # if present for ID search
                    $cleanId = str_starts_with($searchValue, '#') ? substr($searchValue, 1) : $searchValue;
                    
                    // Search by ID
                    if (is_numeric($cleanId)) {
                        $query->orWhere('id', $cleanId);
                    }
                    
                    // Search by name (case insensitive)
                    $query->orWhere('fname', 'LIKE', '%' . $searchValue . '%');
                    
                    // Search by NRIC
                    $query->orWhere('nric', 'LIKE', '%' . $searchValue . '%');
                })
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('crfs/check-status', [
            'searchResults' => $searchResults,
            'searchValue' => $searchValue,
        ]);
    }
}