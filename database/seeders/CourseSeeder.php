<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            [
                'title' => 'Math 101',
                'description' => 'Introduction to Mathematics',
                'video_id' => 'd5459916-1629-4425-a60b-7879fafbf9d0',
            ],
            [
                'title' => 'Physics Intro',
                'description' => 'Basic Physics Concepts',
                'video_id' => '8010e31f-f614-4f17-a910-134e83c87cef',
            ],
            [
                'title' => 'Chemistry Basics',
                'description' => 'Fundamental Chemistry Principles',
                'video_id' => 'd5459916-1629-4425-a60b-7879fafbf9d0',
            ],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}