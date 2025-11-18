<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Nevadskiy\Position\HasPosition;

class Chapter extends Model
{
    use HasPosition;

    protected $fillable = [
        'title',
        'content',
        'created_by',
        'educational_subject_id',
        'last_updated_by',
        'video_url',
        'attachment_url',
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

    public function moveUp()
    {
        $this->move($this->position - 1);
    }

    public function moveDown()
    {
        $this->move($this->position + 1);
    }
}
