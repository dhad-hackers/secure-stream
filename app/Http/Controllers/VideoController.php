<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\VideoLog;
use App\Helpers\VideoHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class VideoController extends Controller
{
    /**
     * Get a signed URL for a course video
     *
     * @param Course $course
     * @return JsonResponse
     */
    public function getSignedUrl(Course $course): JsonResponse
    {
        // Log video access
        try {
            VideoLog::create([
                'course_id' => $course->id,
                'user_id' => Auth::id(),
                'accessed_at' => now()
            ]);
        } catch (\Exception $e) {
            // Log the error but don't prevent the video from being served
            Log::error('Failed to log video access', [
                'course_id' => $course->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
        }
         
        $signedUrl = VideoHelper::generateBunnySignedUrl($course->video_id);
         
        return response()->json([
            'url' => $signedUrl
        ]);
    }
}