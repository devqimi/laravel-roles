<?php

namespace App\Http\Controllers;

use App\Models\CrfAttachment;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CrfAttachmentController extends Controller
{
    public function download(CrfAttachment $attachment)
    {
        // Optional: authorize user can access $attachment->crf
        // $this->authorize('view', $attachment->crf);

        // If stored on public disk and you want redirect to URL:
        // return redirect(Storage::disk('public')->url($attachment->path));

        // Otherwise force download:
        $filePath = Storage::disk('public')->path($attachment->path);
        return response()->download($filePath, $attachment->filename);
    }
}
