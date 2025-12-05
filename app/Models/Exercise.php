<?php

namespace App\Models;

use App\ExerciseTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exercise extends Model
{
    protected $fillable = [
        'chapter_id',
        'type',
        'title',
        'description',
        'is_active',
        'position',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'type' => ExerciseTypeEnum::class,
    ];

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ExerciseImage::class)->orderBy('position');
    }
}
