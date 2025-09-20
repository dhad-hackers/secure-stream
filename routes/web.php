<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\VideoController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/home', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::get('/dashboard', function () {
    return inertia('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Course routes
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');
    
    // Video routes
    Route::get('/video/{course}/url', [VideoController::class, 'getSignedUrl'])->name('video.signed-url');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
