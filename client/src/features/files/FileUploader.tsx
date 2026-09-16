import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Loader2 } from 'lucide-react';
import { uploadFile } from './fileApi';

interface FileUploaderProps {
  courseId?: string;
  chatId?: string;
  batchScope?: string;
}

export default function FileUploader({ courseId, chatId, batchScope }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => uploadFile(file, { courseId, chatId, batchScope }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setError(null);
      if (inputRef.current) inputRef.current.value = '';
    },
    onError: () => {
      setError('Upload failed. Please check the file type and size.');
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    mutation.mutate(file);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload-input"
      />
      <label
        htmlFor="file-upload-input"
        className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 hover:border-primary-600 rounded-xl p-6 cursor-pointer transition-colors text-gray-400 hover:text-white"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={20} />
            Click to upload a file
          </>
        )}
      </label>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}