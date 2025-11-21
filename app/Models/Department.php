<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departments'; // Confirm table name
    protected $fillable = ['dname'];

    public function requestForms()
    {
        return $this->hasMany(RequestForm::class);
    }
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function crfs()
    {
        return $this->hasMany(Crf::class, 'department_id');
    }
}
