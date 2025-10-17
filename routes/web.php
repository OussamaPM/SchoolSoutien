<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\ForfaitController;
use App\Http\Controllers\EducationalProgramController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\Parent\ForfaitStoreController;

Route::get('/', function () {
    return view('welcome');
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::prefix('parent')->name('parent.')->group(function () {
        Route::post('forfait-store/assign-child-profile', [ForfaitStoreController::class, 'storeChildProfilePlan'])
            ->name('forfait-store.assign-child-profile');
        Route::resource('forfait-store', ForfaitStoreController::class);
    });

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('forfaits', ForfaitController::class);

        Route::get('orders', OrdersController::class)->name('orders');

        Route::controller(EducationalProgramController::class)
            ->prefix('educational-programs')
            ->name('educational-programs.')
            ->group(function () {
                Route::get('education-level-categories', 'getAllEducationLevelCategories')->name('level-categories');
                Route::get('education-level-categories/{category}/levels', 'getEducationLevelsByCategory')->name('levels');
                Route::post('education-level-categories/{category}/level', 'storeLevel')->name('store-level');
                Route::patch('education-level-categories/{category}/level/{level}', 'updateLevel')->name('update-level');
                Route::delete('education-level-categories/{category}/level/{level}', 'deleteLevel')->name('delete-level');
            });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
