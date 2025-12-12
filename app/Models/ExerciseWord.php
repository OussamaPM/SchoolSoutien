<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExerciseWord extends Model
{
    protected $fillable = [
        'exercise_id',
        'text',
        'audio_path',
        'position',
    ];

    protected $casts = [
        'position' => 'integer',
    ];

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }
}
