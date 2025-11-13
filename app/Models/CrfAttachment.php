<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CrfAttachment extends Model
{
    protected $fillable = ['crf_id', 'filename', 'path', 'mime', 'size'];

    public function crf()
    {
        return $this->belongsTo(Crf::class);
    }

    // Get public URL (if stored on public disk)
    public function url()
    {
        return asset('storage/' . $this->path);
    }
}