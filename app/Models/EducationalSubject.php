<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EducationalSubject extends Model
{
    protected $fillable = [
        'name',
        'education_level_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function educationLevel()
    {
        return $this->belongsTo(EducationLevel::class, 'education_level_id');
    }
}
