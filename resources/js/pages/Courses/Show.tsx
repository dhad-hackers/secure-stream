import { Course } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

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
        }, 900000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (playerRef.current) {
                playerRef.current.dispose();
            }
        };
    }, [course.video_id]);

    useEffect(() => {
        if (signedUrl && videoRef.current && !playerRef.current) {
            playerRef.current = videojs(videoRef.current, {
                controls: true,
                responsive: true,
                fluid: true,
                sources: [
                    {
                        src: signedUrl,
                        type: 'video/mp4',
                    },
                ],
            });
        } else if (signedUrl && playerRef.current) {
            // Update existing player with new signed URL
            playerRef.current.src({ src: signedUrl, type: 'video/mp4' });
        }
    }, [signedUrl]);
    console.log(signedUrl);

    return (
        <>
            <Head title={course.title} />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link href="/courses" className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Courses
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                    <div className="p-6">
                        <h1 className="mb-4 text-3xl font-bold text-gray-900">{course.title}</h1>
                        <p className="mb-6 text-gray-600">{course.description}</p>

                        <div className="mb-6">
                            <h2 className="mb-3 text-xl font-semibold text-gray-900">Course Video</h2>
                            <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                                {loading && (
                                    <div className="flex h-full items-center justify-center">
                                        <div className="text-center">
                                            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                            <p className="text-gray-600">Loading video...</p>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex h-full items-center justify-center">
                                        <div className="p-4 text-center">
                                            <svg
                                                className="mx-auto mb-4 h-12 w-12 text-red-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                />
                                            </svg>
                                            <p className="font-medium text-red-600">{error}</p>
                                            <button
                                                onClick={fetchSignedUrl}
                                                className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {!loading && !error && signedUrl && (
                                    <iframe
                                        src={signedUrl}
                                        className="h-full w-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                <div>
                                    <span className="font-semibold text-gray-700">Course ID:</span>
                                    <span className="ml-2 text-gray-600">{course.id}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Video ID:</span>
                                    <span className="ml-2 text-gray-600">{course.video_id}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Created:</span>
                                    <span className="ml-2 text-gray-600">{new Date(course.created_at).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Last Updated:</span>
                                    <span className="ml-2 text-gray-600">{new Date(course.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
