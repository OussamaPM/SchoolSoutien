<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    protected $fillable = [
        'title',
        'content',
        'created_by',
        'educational_subject_id',
        'last_updated_by',
        'is_active',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function educationalSubject()
    {
        return $this->belongsTo(EducationalSubject::class, 'educational_subject_id');
    }

    public function lastUpdater()
    {
        return $this->belongsTo(User::class, 'last_updated_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
