<?php
// app/Models/CrfRemark.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrfRemark extends Model
{
    protected $fillable = [
        'crf_id',
        'user_id',
        'remark',
        'status',
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