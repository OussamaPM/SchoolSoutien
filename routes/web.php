<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\ForfaitController;

Route::get('/', function () {
    return view('welcome');
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('forfaits', ForfaitController::class);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
