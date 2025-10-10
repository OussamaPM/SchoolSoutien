<?php

namespace Database\Seeders;

use App\Models\User;
use App\RoleEnum;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@schoolsoutien.com'],
            [
                'name' => 'Admin User',
                'role' => RoleEnum::ADMIN,
                'password' => Hash::make('admin'),
                'email_verified_at' => now(),
            ]
        );

        // Seed plans
        $this->call([
            PlanSeeder::class,
        ]);
    }
}
