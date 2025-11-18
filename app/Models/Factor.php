<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Factor extends Model
{
    protected $fillable = ['name'];

    public function crforms(): HasMany
    {
        return $this->hasMany(Crf::class, 'factor_id');
    }
}