<?php

namespace App\Http\Controllers;

use App\Models\CrfAttachment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CrfAttachmentController extends Controller
{
    public function download(CrfAttachment $attachment): BinaryFileResponse
    {
        $crf = $attachment->crf;
        
        // Authorization: User must be able to view the CRF
        $user = Auth::user();

        // Check if user can access this CRF
        $canAccess = 
        $crf->user_id === $user->id || // Creator
        $crf->approved_by === $user->id || // Approver
        $crf->assigned_to === $user->id ;// Assigned PIC
        // $user->hasRole(['ITD ADMIN', 'HOU']); // Admins
        
        if (!$canAccess) {
            abort(403, 'You do not have permission to download this file');
        }
        
        // Check if file exists
        if (!Storage::disk('public')->exists($attachment->path)) {
            abort(404, 'File not found');
        }
        
        // Log::info('Download attempt - User ID: ' . $user->id . ', CRF User ID: ' . $crf->user_id . ', Approved By: ' . $crf->approved_by . ', Assigned To: ' . $crf->assigned_to);
        // Log::info('Can Access: ' . ($canAccess ? 'Yes' : 'No'));
        
        // Download the file
        return response()->download(
            Storage::disk('public')->path($attachment->path),
            $attachment->filename,
            ['Content-Type' => $attachment->mime]  // e.g., 'application/pdf'
        );


        // Optional: authorize user can access $attachment->crf
        // $this->authorize('view', $attachment->crf);

        // If stored on public disk and you want redirect to URL:
        // return redirect(Storage::disk('public')->url($attachment->path));

        // Otherwise force download:
        // $filePath = Storage::disk('public')->path($attachment->path);
        // return response()->download($filePath, $attachment->filename);
    }
}
