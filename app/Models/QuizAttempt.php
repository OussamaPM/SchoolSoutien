<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizAttempt extends Model
{
    protected $fillable = [
        'child_profile_id',
        'quiz_id',
        'chapter_id',
        'answers',
        'score',
        'total_questions',
        'correct_answers',
        'time_spent',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'answers' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function childProfile(): BelongsTo
    {
        return $this->belongsTo(ChildProfile::class);
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function getPercentageAttribute(): float
    {
        if ($this->total_questions === 0) {
            return 0;
        }

        return round(($this->correct_answers / $this->total_questions) * 100, 2);
    }

    public function isPassed(): bool
    {
        return $this->percentage >= 70;
    }
}
