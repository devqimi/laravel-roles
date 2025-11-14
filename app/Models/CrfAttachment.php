<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class CrfAttachment extends Model
{
    protected $fillable = ['crf_id', 'filename', 'path', 'mime', 'size'];

    public function crf()
    {
        return $this->belongsTo(Crf::class, 'crf_id');
    }

    // Get public URL (if stored on public disk)
    public function url()
    {
        return Storage::url($this->path);
    }

    // Get formatted file size
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->size;
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }
}