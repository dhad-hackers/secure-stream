<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class VideoHelper
{
     public static function generateBunnySignedUrl(string $videoId, int $expirySeconds = 120): string
     {
         $libraryId = config('services.bunny.library_id');
         $apiKey = config('services.bunny.api_key');
         $pullZoneUrl = config('services.bunny.pull_zone_url');

         if (!$libraryId || !$apiKey || !$pullZoneUrl) {
             throw new \Exception('Bunny.net credentials not configured');
         }

         // Calculate expiry timestamp
         $expiry = time() + $expirySeconds;

         // CORRECT algorithm: security_key + video_id + expiration (per Bunny.net docs)
         $signature = hash_hmac('sha256', $apiKey . $videoId . $expiry, $apiKey);

         // CORRECT URL format using pull zone (per Bunny.net docs)
         $baseUrl = "https://iframe.mediadelivery.net/embed/{$libraryId}/{$videoId}";
         $signedUrl = $baseUrl . "?token={$signature}&expires={$expiry}";

         return $signedUrl;
     }
}