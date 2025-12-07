<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExerciseScore extends Model
{
    protected $fillable = [
        'child_profile_id',
        'exercise_id',
        'score',
        'total',
        'percentage',
    ];

    protected $casts = [
        'score' => 'integer',
        'total' => 'integer',
        'percentage' => 'integer',
    ];

    public function childProfile(): BelongsTo
    {
        return $this->belongsTo(ChildProfile::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }
}
