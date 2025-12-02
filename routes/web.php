<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\ForfaitController;
use App\Http\Controllers\EducationalProgramController;
use App\Http\Controllers\Parent\ChildSessionController;
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
        Route::post('forfait-store/update-child-profile/{childProfile}', [ForfaitStoreController::class, 'updateChildProfile'])
            ->name('forfait-store.update-child-profile');
        Route::resource('forfait-store', ForfaitStoreController::class);
        ##################################### Child Profiles Routes #####################################
        Route::get('child-sessions/{child}/{subject}', [ChildSessionController::class, 'learnSubject'])->name('child-sessions.learn-subject');
        Route::get('child-sessions/{child}/{subject}/chapter/{chapter}', [ChildSessionController::class, 'viewChapter'])->name('child-sessions.view-chapter');
        Route::get('child-sessions/{child}/{subject}/chapter/{chapter}/quiz/{quiz}', [ChildSessionController::class, 'startQuiz'])->name('child-sessions.start-quiz');
        Route::post('child-sessions/{child}/{subject}/chapter/{chapter}/quiz/{quiz}', [ChildSessionController::class, 'submitQuiz'])->name('child-sessions.submit-quiz');
        Route::get('child-sessions/{child}/{subject}/chapter/{chapter}/quiz/{quiz}/results/{attempt}', [ChildSessionController::class, 'quizResults'])->name('child-sessions.quiz-results');
        Route::resource('child-sessions', ChildSessionController::class)->parameter('child-sessions', 'child');
    });

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('forfaits', ForfaitController::class);

        Route::resource('users', UserController::class);

        Route::get('orders', OrdersController::class)->name('orders');

        Route::controller(EducationalProgramController::class)
            ->prefix('educational-programs')
            ->name('educational-programs.')
            ->group(function () {
                Route::get('education-level-categories', 'getAllEducationLevelCategories')->name('level-categories');
                // ####################################### Levels Routes ########################################
                Route::get('education-level-categories/{category}/levels', 'getEducationLevelsByCategory')->name('levels');
                Route::post('education-level-categories/{category}/level', 'storeLevel')->name('store-level');
                Route::patch('education-level-categories/{category}/level/{level}', 'updateLevel')->name('update-level');
                Route::delete('education-level-categories/{category}/level/{level}', 'deleteLevel')->name('delete-level');
                // ####################################### Subject Routes ########################################
                Route::get('education-level-categories/{category}/{level}/subjects', 'getEducationSubjectsByLevel')->name('subjects');
                Route::post('education-level-categories/{category}/{level}/subject', 'storeSubject')->name('store-subject');
                Route::patch('education-level-categories/{category}/{level}/subject/{subject}', 'updateSubject')->name('update-subject');
                Route::delete('education-level-categories/{category}/{level}/subject/{subject}', 'deleteSubject')->name('delete-subject');
                // ####################################### Chapters Routes ########################################
                Route::get('education-level-categories/{category}/{level}/subjects/{subject}/chapters', 'getChaptersBySubject')->name('chapters');
                Route::get('education-level-categories/{category}/{level}/subjects/{subject}/chapter-write/{chapter?}', 'chapterWriter')->name('chapter-writer');
                Route::patch('education-level-categories/{category}/{level}/subjects/{subject}/chapter/{chapter?}', 'updateChapter')->name('update-chapter');
                Route::patch('education-level-categories/{category}/{level}/subjects/{subject}/chapter/{chapter}/status', 'updateChapterStatus')->name('update-chapter-status');
                Route::patch('education-level-categories/{category}/{level}/subjects/{subject}/chapter/{chapter}/video', 'updateChapterVideo')->name('update-chapter-video');
                Route::post('education-level-categories/{category}/{level}/subjects/{subject}/chapter/{chapter}/attachment', 'updateChapterAttachment')->name('update-chapter-attachment');
                Route::delete('education-level-categories/{category}/{level}/subjects/{subject}/chapter/{chapter}', 'deleteChapter')->name('delete-chapter');
                Route::post('education-level-categories/{category}/{level}/subjects/{subject}/chapter/{chapter}/move-up', 'moveChapterUp')->name('move-chapter-up');
                Route::post('education-level-categories/{category}/{level}/subjects/{subject}/chapter/{chapter}/move-down', 'moveChapterDown')->name('move-chapter-down');

                // Quiz routes
                Route::get('education-level-categories/{category}/{level}/subjects/{subject}/chapter/{chapter}/quiz', 'manageQuiz')->name('chapter.quiz');
                Route::post('education-level-categories/{category}/{level}/subjects/{subject}/chapter/{chapter}/quiz', 'storeQuiz')->name('chapter.quiz.store');
                Route::put('education-level-categories/{category}/{level}/subjects/{subject}/chapter/{chapter}/quiz/{quiz}', 'updateQuiz')->name('chapter.quiz.update');
                Route::delete('education-level-categories/{category}/{level}/subjects/{subject}/chapter/{chapter}/quiz/{quiz}', 'deleteQuiz')->name('chapter.quiz.delete');
            });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
