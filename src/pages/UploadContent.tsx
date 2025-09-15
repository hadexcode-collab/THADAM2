import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface UploadFormData {
  title: string;
  category: string;
  description: string;
  tags: string[];
  attribution: string;
  consent: boolean;
  medicalDisclaimer: boolean;
}

const UploadContent = () => {
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    category: '',
    description: '',
    tags: [],
    attribution: '',
    consent: false,
    medicalDisclaimer: false
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = [
    'Tamil Classical Dance',
    'Traditional Medicine',
    'Religious Rituals',
    'Folk Arts',
    'Culinary Traditions',
    'Musical Heritage',
    'Architectural Styles',
    'Literary Works',
    'Martial Arts',
    'Textile Arts'
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'text/*': ['.txt', '.md'],
      'application/pdf': ['.pdf']
    },
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return PhotoIcon;
    if (file.type.startsWith('video/')) return VideoCameraIcon;
    return DocumentTextIcon;
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setCurrentStep(4);
    setIsUploading(false);
  };

  const steps = [
    { id: 1, name: 'Upload Files', description: 'Add your cultural content' },
    { id: 2, name: 'Add Details', description: 'Provide context and information' },
    { id: 3, name: 'Review & Submit', description: 'Confirm your submission' },
    { id: 4, name: 'Verification', description: 'AI processing in progress' }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Share Cultural Knowledge
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Upload authentic Tamil cultural content for AI verification and community learning
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="text-center flex-1">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {step.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Upload Your Files
              </h2>
              
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <input {...getInputProps()} />
                <CloudArrowUpIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  or click to browse your computer
                </p>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Supports: Images, Videos, Documents, PDFs (Max 100MB each)
                </div>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => {
                      const FileIcon = getFileIcon(file);
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileIcon className="w-8 h-8 text-indigo-600" />
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {file.name}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={uploadedFiles.length === 0}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Add Content Details
              </h2>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Bharatanatyam Basic Positions"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Provide detailed information about the cultural practice, its significance, and traditional methods..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Attribution/Source *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.attribution}
                    onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Learned from Guru Rajesh Kumar, Kalakshetra Foundation"
                  />
                </div>

                {formData.category === 'Traditional Medicine' && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div className="space-y-3">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                          <strong>Medical Content Notice:</strong> Traditional medicine content requires additional verification and disclaimers.
                        </p>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.medicalDisclaimer}
                            onChange={(e) => setFormData({ ...formData, medicalDisclaimer: e.target.checked })}
                            className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                          />
                          <span className="text-sm text-yellow-800 dark:text-yellow-200">
                            I acknowledge this content is for educational purposes only and should not replace professional medical advice.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Review & Submit
              </h2>

              {/* Review Content */}
              <div className="space-y-6 mb-8">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Content Summary</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Title:</span>
                      <div className="font-medium text-slate-900 dark:text-white">{formData.title}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Category:</span>
                      <div className="font-medium text-slate-900 dark:text-white">{formData.category}</div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-slate-500 dark:text-slate-400">Files:</span>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {uploadedFiles.length} file(s) uploaded
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <InformationCircleIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div className="space-y-4">
                      <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">
                        Content Submission Agreement
                      </h3>
                      <div className="text-sm text-indigo-800 dark:text-indigo-200 space-y-2">
                        <p>By submitting this content, you agree that:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>The content is authentic and accurately represents Tamil cultural practices</li>
                          <li>You have the right to share this knowledge publicly</li>
                          <li>The content will undergo AI-powered authenticity verification</li>
                          <li>Verified content may be transformed into structured learning packs</li>
                          <li>Proper attribution will be maintained for your contribution</li>
                        </ul>
                      </div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          required
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-indigo-900 dark:text-indigo-100 font-medium">
                          I provide my consent and agree to the terms above *
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.consent || isUploading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isUploading ? 'Submitting...' : 'Submit for Verification'}
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Submission Successful!
              </h2>
              
              <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
                Your cultural content has been submitted and is now being processed by our AI verification system. 
                You'll receive updates on the verification status.
              </p>

              {/* Progress Animation */}
              <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-4 max-w-md mx-auto">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                />
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                AI Verification in Progress...
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setUploadedFiles([]);
                    setFormData({
                      title: '',
                      category: '',
                      description: '',
                      tags: [],
                      attribution: '',
                      consent: false,
                      medicalDisclaimer: false
                    });
                  }}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Upload More Content
                </button>
                <button className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                  View My Submissions
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadContent;