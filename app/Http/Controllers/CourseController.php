<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    /**
     * Display a listing of courses.
     *
     * @return Response
     */
    public function index(): Response
    {
        $courses = Course::all();
        
        return Inertia::render('Courses/Index', [
            'courses' => $courses,
        ]);
    }

    /**
     * Display the specified course.
     *
     * @param  Course  $course
     * @return Response
     */
    public function show(Course $course): Response
    {
        return Inertia::render('Courses/Show', [
            'course' => $course,
        ]);
    }
}