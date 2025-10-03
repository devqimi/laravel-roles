<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestForm extends Model
{
    protected $fillable = [
        'name',
        'nric',
        'department_id',
        'designation',
        'ext_hp_no',
        'category_id',
        'change_required',
        'reason',
    ];
    
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

}