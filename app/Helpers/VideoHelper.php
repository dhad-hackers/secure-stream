<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class VideoHelper
{
    /**
     * Generate a signed URL for Bunny.net video
     *
     * @param string $videoId
     * @param int $expirySeconds
     * @return string
     */
    public static function generateBunnySignedUrl(string $videoId, int $expirySeconds = 120): string
    {
        $libraryId = config('services.bunny.library_id');
        $apiKey = config('services.bunny.api_key');
        
        if (!$libraryId || !$apiKey) {
            throw new \Exception('Bunny.net credentials not configured');
        }

        // Calculate expiry timestamp
        $expiry = time() + $expirySeconds;
        
        // Generate the signature
        $signature = hash_hmac('sha256', $videoId . $expiry, $apiKey);
        
        // Construct the signed URL
        $baseUrl = "https://video.bunnycdn.com/library/{$libraryId}/videos/{$videoId}";
        $signedUrl = $baseUrl . "?token={$signature}&expires={$expiry}";
        
        return $signedUrl;
    }
}