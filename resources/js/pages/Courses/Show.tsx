import { Head, Link } from '@inertiajs/react';
import { Course } from '@/types';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import axios from 'axios';

interface Props {
  course: Course;
}

export default function Show({ course }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [signedUrl, setSignedUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignedUrl = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/video/${course.id}/url`);
      setSignedUrl(response.data.url);
      setError(null);
    } catch (err) {
      console.error('Error fetching signed URL:', err);
      setError('Failed to load video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignedUrl();

    // Set up interval to refresh the signed URL every 90 seconds
    intervalRef.current = setInterval(() => {
      fetchSignedUrl();
    }, 90000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [course.bunny_video_id]);

  useEffect(() => {
    if (signedUrl && videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: signedUrl,
          type: 'video/mp4'
        }]
      });
    } else if (signedUrl && playerRef.current) {
      // Update existing player with new signed URL
      playerRef.current.src({ src: signedUrl, type: 'video/mp4' });
    }
  }, [signedUrl]);

  return (
    <>
      <Head title={course.title} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/courses"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg
              className="mr-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Courses
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Course Video</h2>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {loading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading video...</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-4">
                      <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-red-600 font-medium">{error}</p>
                      <button
                        onClick={fetchSignedUrl}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
                
                {!loading && !error && signedUrl && (
                  <video
                    ref={videoRef}
                    className="video-js vjs-default-skin vjs-big-play-centered"
                    controls
                    preload="auto"
                    data-setup="{}"
                  >
                    <source
                      src={signedUrl}
                      type="video/mp4"
                    />
                    <p className="vjs-no-js">
                      To view this video please enable JavaScript, and consider upgrading to a
                      web browser that
                      <a href="https://videojs.com/html5-video-support/" target="_blank">
                        supports HTML5 video
                      </a>
                    </p>
                  </video>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Course ID:</span>
                  <span className="ml-2 text-gray-600">{course.id}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Video ID:</span>
                  <span className="ml-2 text-gray-600">{course.bunny_video_id}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Created:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(course.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Last Updated:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(course.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}