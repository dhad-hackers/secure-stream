import { Head, Link } from '@inertiajs/react';
import { Course } from '@/types';

interface Props {
  courses: Course[];
}

export default function Index({ courses }: Props) {
  return (
    <>
      <Head title="Courses" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-2">Browse all available courses</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
                <Link
                  href={`/courses/${course.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Course
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </>
  );
}