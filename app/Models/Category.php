<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories'; // Confirm table name
    protected $fillable = ['cname'];

    public function requestForms()
    {
        return $this->hasMany(RequestForm::class);
    }
}
