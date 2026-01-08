<?php

namespace App;

use App\Http\Controllers\DashboardController;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case PARENT = 'parent';
    case TEACHER = 'teacher';
    case AFFILIATE = 'affiliate';

    public static function allRoles(): array
    {
        return array_map(fn ($role) => $role->value, self::cases());
    }

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrateur',
            self::PARENT => 'Parent',
            self::TEACHER => 'Enseignant',
            self::AFFILIATE => 'Affilié',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ADMIN => 'red',
            self::PARENT => 'blue',
            self::TEACHER => 'green',
            self::AFFILIATE => 'purple',
        };
    }

    public static function default(): self
    {
        return self::PARENT;
    }

    public function getCorrespondingFunction(): callable
    {
        return match ($this) {
            self::ADMIN => fn (DashboardController $controller) => $controller->getAdminData(),
            self::PARENT => fn (DashboardController $controller) => $controller->getParentData(),
            self::TEACHER => fn (DashboardController $controller) => $controller->getTeacherData(),
            self::AFFILIATE => fn (DashboardController $controller) => $controller->getAffiliateData(),
        };
    }
}
