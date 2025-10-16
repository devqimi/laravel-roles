<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationStatus extends Model
{
    protected $fillable = ['status'];

    public function crfs(){
        return $this -> hasMany(Crf::class, 'application_status_id');
    }
}
