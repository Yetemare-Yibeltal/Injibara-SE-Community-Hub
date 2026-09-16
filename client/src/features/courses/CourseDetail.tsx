import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourseById } from './courseApi';
import { fetchFiles } from '../files/fileApi';
import FilePreview from '../files/filePreview';
import FileUploader from '../files/FileUploader';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();

  const { data: course, isLoading } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => fetchCourseById(courseId as string),
    enabled: !!courseId,
  });

  const { data: files } = useQuery({
    queryKey: ['files', { courseId }],
    queryFn: () => fetchFiles({ courseId }),
    enabled: !!courseId,
  });

  if (isLoading) {
    return <p className="p-6 text-gray-500 text-sm">Loading course...</p>;
  }

  if (!course) {
    return <p className="p-6 text-gray-500 text-sm">Course not found.</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-xs text-primary-500 font-medium mb-1">{course.code}</p>
      <h1 className="text-2xl font-bold text-white mb-1">{course.name}</h1>
      <p className="text-gray-500 text-sm mb-8">
        {course.batch} &middot; {course.semester}
      </p>

      <h2 className="text-white font-semibold mb-3">Materials</h2>
      <div className="mb-4">
        <FileUploader courseId={courseId} batchScope={course.batch} />
      </div>

      {files && files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file) => (
            <FilePreview key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No materials uploaded yet.</p>
      )}
    </div>
  );
}