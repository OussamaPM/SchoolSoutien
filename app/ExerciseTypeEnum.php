<?php

namespace App;

enum ExerciseTypeEnum: string
{
    case CHOOSE_WHEN_HEAR = 'choose_when_hear';

    public function label(): string
    {
        return match ($this) {
            self::CHOOSE_WHEN_HEAR => 'Je choisis quand j\'entends',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::CHOOSE_WHEN_HEAR => 'L\'enfant sélectionne les images correspondant au son entendu',
        };
    }
}
