<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EducationLevelCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get all education levels under this category.
     */
    public function educationLevels()
    {
        return $this->hasMany(EducationLevel::class);
    }
}
