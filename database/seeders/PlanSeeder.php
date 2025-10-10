<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Plan Hebdomadaire',
                'description' => 'Accès complet à la plateforme pendant 7 jours',
                'price' => 9.99,
                'duration_days' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Plan Mensuel',
                'description' => 'Accès complet à la plateforme pendant 30 jours',
                'price' => 29.99,
                'duration_days' => 30,
                'is_active' => true,
            ],
            [
                'name' => 'Plan Trimestriel',
                'description' => 'Accès complet à la plateforme pendant 90 jours',
                'price' => 79.99,
                'duration_days' => 90,
                'is_active' => true,
            ],
            [
                'name' => 'Plan Annuel',
                'description' => 'Accès complet à la plateforme pendant 365 jours',
                'price' => 299.99,
                'duration_days' => 365,
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::create($plan);
        }
    }
}
