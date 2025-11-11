<?php
// app/Models/CrfStatusTimeline.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrfStatusTimeline extends Model
{
    protected $table = 'crf_status_timeline';

    protected $fillable = [
        'crf_id',
        'user_id',
        'status',
        'remark',
        'action_type',
    ];

    public function crf(): BelongsTo
    {
        return $this->belongsTo(Crf::class, 'crf_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}