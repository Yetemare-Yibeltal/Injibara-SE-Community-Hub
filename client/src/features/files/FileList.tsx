import { useQuery } from '@tanstack/react-query';
import { fetchFiles } from './fileApi';
import FilePreview from './filePreview';
import FileUploader from './FileUploader';
import { FolderOpen } from 'lucide-react';

export default function FileList() {
  const { data: files, isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: () => fetchFiles(),
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Files</h1>

      <div className="mb-6">
        <FileUploader />
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading files...</p>
      ) : !files || files.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-12">
          <FolderOpen className="mx-auto mb-2 opacity-50" size={32} />
          No files uploaded yet.
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <FilePreview key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}