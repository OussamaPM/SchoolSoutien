<?php

namespace App;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case PARENT = 'parent';
    case TEACHER = 'teacher';


    public static function allRoles(): array
    {
        return array_map(fn($role) => $role->value, self::cases());
    }

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrateur',
            self::PARENT => 'Parent',
            self::TEACHER => 'Enseignant',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ADMIN => 'red',
            self::PARENT => 'blue',
            self::TEACHER => 'green',
        };
    }

    public static function default(): self
    {
        return self::PARENT;
    }
}
