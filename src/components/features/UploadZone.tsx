import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  VideoCameraIcon 
} from '@heroicons/react/24/outline';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesSelected,
  acceptedTypes = ['image/*', 'video/*', 'text/*', 'application/pdf'],
  maxSize = 100 * 1024 * 1024, // 100MB
  multiple = true
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple
  });

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragActive && !isDragReject
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
          : isDragReject
          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700'
      }`}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <motion.div
          animate={{ y: isDragActive ? -5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <CloudArrowUpIcon className="w-16 h-16 text-slate-400 mx-auto" />
        </motion.div>
        
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            or click to browse your computer
          </p>
          <div className="flex justify-center space-x-4 text-slate-400">
            <DocumentTextIcon className="w-6 h-6" />
            <PhotoIcon className="w-6 h-6" />
            <VideoCameraIcon className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Supports: Images, Videos, Documents, PDFs (Max {Math.round(maxSize / 1024 / 1024)}MB each)
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadZone;