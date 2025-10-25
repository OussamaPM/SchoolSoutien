<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EducationLevel extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the category this education level belongs to.
     */
    public function category()
    {
        return $this->belongsTo(EducationLevelCategory::class, 'category_id');
    }

    /**
     * Get the educational subjects for this level.
     */
    public function educationSubjects()
    {
        return $this->hasMany(EducationalSubject::class, 'education_level_id');
    }
}
