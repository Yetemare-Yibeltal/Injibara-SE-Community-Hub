import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from './courseApi';
import { BookOpen } from 'lucide-react';

export default function CourseList() {
  const navigate = useNavigate();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Courses</h1>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading courses...</p>
      ) : !courses || courses.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-12">
          <BookOpen className="mx-auto mb-2 opacity-50" size={32} />
          No courses available for your batch yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="text-left bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-colors"
            >
              <p className="text-xs text-primary-500 font-medium mb-1">{course.code}</p>
              <h3 className="text-white font-semibold mb-1">{course.name}</h3>
              <p className="text-xs text-gray-500">
                {course.batch} &middot; {course.semester}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}