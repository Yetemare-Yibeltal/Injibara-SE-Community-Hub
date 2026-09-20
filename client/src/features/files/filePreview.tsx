import {
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  File as FileIcon,
} from 'lucide-react';
import type { FileDTO } from '@shared/types';

interface FilePreviewProps {
  file: FileDTO;
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return ImageIcon;
  if (fileType.startsWith('video/')) return Video;
  if (fileType.startsWith('audio/')) return Music;
  if (fileType.includes('zip') || fileType.includes('rar')) return Archive;
  if (fileType === 'application/pdf' || fileType.includes('document')) {
    return FileText;
  }

  return FileIcon;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilePreview({ file }: FilePreviewProps) {
  const Icon = getFileIcon(file.fileType);

  return (
    <a
      href={file.cloudinaryUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-lg p-3 transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-primary-500" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate">
          {file.fileName}
        </p>

        <p className="text-xs text-gray-500">
          {formatFileSize(file.fileSizeBytes)}
        </p>
      </div>
    </a>
  );
}