<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

class Crf extends Model
{
    use HasFactory;
    // ✅ Tell Laravel to use the correct table name
    protected $table = 'crforms';

    // (Optional) If your table has timestamps (created_at / updated_at)
    public $timestamps = true;

    // (Optional) List columns that can be mass assigned
    protected $fillable = [
        'user_id',
        'fname',
        'nric',
        'department_id',
        'designation',
        'extno',
        'category_id',
        'issue',
        'reason',
        'supporting_file',
        'user_id',
        'application_status_id',
        'approved_by',
        'assigned_to',
        'it_remark',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function approver(){
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function department(){
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function category(){
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function application_status(){
        return $this->belongsTo(ApplicationStatus::class, 'application_status_id');
    }

    public function role(){
        return $this->belongsTo(Role::class);
    }

    public function assigned_user(){
        return $this->belongsTo(User::class, 'assigned_to');
    }
}