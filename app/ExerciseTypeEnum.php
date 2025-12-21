<?php

namespace App;

enum ExerciseTypeEnum: string
{
    case CHOOSE_WHEN_HEAR = 'choose_when_hear';
    case CHOOSE_WHEN_READ = 'choose_when_read';
    case SELECT_IMAGE = 'select_image';
    case CHOOSE_LETTER = 'choose_letter';
    case CIRCLE_IDENTICAL = 'circle_identical';
    case CONNECT_WORDS = 'connect_words';

    public function label(): string
    {
        return match ($this) {
            self::CHOOSE_WHEN_HEAR => 'Je choisis quand j\'entends',
            self::CHOOSE_WHEN_READ => 'Je choisis quand je lis',
            self::SELECT_IMAGE => 'Je vois et je sélectionne',
            self::CHOOSE_LETTER => 'Je choisi la bonne lettre',
            self::CIRCLE_IDENTICAL => 'J\'entoure les mots identiques',
            self::CONNECT_WORDS => 'Je relie deux textes',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::CHOOSE_WHEN_HEAR => 'L\'enfant sélectionne les images correspondant au son entendu',
            self::CHOOSE_WHEN_READ => 'L\'enfant écoute et répète les mots pour s\'entraîner à la lecture',
            self::SELECT_IMAGE => 'L\'enfant sélectionne les images selon un critère (ex: contient la lettre "i")',
            self::CHOOSE_LETTER => 'L\'enfant complète les mots en choisissant la bonne lettre manquante',
            self::CIRCLE_IDENTICAL => 'L\'enfant sélectionne tous les mots identiques au mot modèle',
            self::CONNECT_WORDS => 'L\'enfant relie les mots de gauche avec leurs correspondances à droite',
        };
    }
}
