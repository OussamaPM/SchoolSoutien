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
        'required_repetitions',
        'letter_options',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'type' => ExerciseTypeEnum::class,
        'letter_options' => 'array',
    ];

    protected $appends = [
        'type_label',
        'type_description',
    ];

    public function getTypeLabelAttribute(): ?string
    {
        return $this->type?->label();
    }

    public function getTypeDescriptionAttribute(): ?string
    {
        return $this->type?->description();
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ExerciseImage::class)->orderBy('position');
    }

    public function words(): HasMany
    {
        return $this->hasMany(ExerciseWord::class)->orderBy('position');
    }

    public function scores(): HasMany
    {
        return $this->hasMany(ExerciseScore::class);
    }
}
