import React, { useState } from 'react';
import { Upload, FileText, Image, Video, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface UploadFormData {
  title: string;
  category: string;
  description: string;
  consent: boolean;
  attribution: string;
  medicalDisclaimer: boolean;
}

const UploadPage: React.FC = () => {
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    category: '',
    description: '',
    consent: false,
    attribution: '',
    medicalDisclaimer: false
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'Tamil Classical Dance',
    'Traditional Medicine',
    'Religious Rituals',
    'Folk Arts',
    'Culinary Traditions',
    'Musical Heritage',
    'Architectural Styles',
    'Literary Works'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !formData.consent) {
      return;
    }

    setUploadStatus('uploading');

    try {
      const formDataObj = new FormData();
      formDataObj.append('file', selectedFile);
      formDataObj.append('metadata', JSON.stringify(formData));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });

      if (response.ok) {
        setUploadStatus('success');
        // Reset form after successful upload
        setTimeout(() => {
          setFormData({
            title: '',
            category: '',
            description: '',
            consent: false,
            attribution: '',
            medicalDisclaimer: false
          });
          setSelectedFile(null);
          setUploadStatus('idle');
        }, 3000);
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      setUploadStatus('error');
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    return FileText;
  };

  const isMedicalCategory = formData.category === 'Traditional Medicine';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Upload Cultural Content</h1>
        <p className="text-gray-400 text-lg">
          Share authentic Tamil cultural knowledge for AI-powered verification
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
            dragActive
              ? 'border-orange-400 bg-orange-400/5'
              : selectedFile
              ? 'border-green-400 bg-green-400/5'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".txt,.pdf,.jpg,.jpeg,.png,.mp4,.mov,.avi"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="text-center space-y-4">
            {selectedFile ? (
              <>
                {React.createElement(getFileIcon(selectedFile), {
                  className: "h-16 w-16 text-green-400 mx-auto"
                })}
                <div>
                  <p className="text-lg font-medium text-white">{selectedFile.name}</p>
                  <p className="text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="h-16 w-16 text-gray-500 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-white">Drop your file here, or click to browse</p>
                  <p className="text-gray-400">Support for text, images, and videos up to 100MB</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="e.g., Bharatanatyam Basic Hand Gestures"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Attribution/Source *
              </label>
              <input
                type="text"
                required
                value={formData.attribution}
                onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="e.g., Learned from Guru Rajesh Kumar, Kalakshetra"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Detailed Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={8}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              placeholder="Provide detailed information about the cultural practice, its significance, traditional methods, and any important context..."
            />
          </div>
        </div>

        {/* Medical Disclaimer */}
        {isMedicalCategory && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="space-y-3">
                <p className="text-yellow-100 text-sm">
                  <strong>Medical Content Notice:</strong> Traditional medicine content requires additional verification and disclaimers.
                </p>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.medicalDisclaimer}
                    onChange={(e) => setFormData({ ...formData, medicalDisclaimer: e.target.checked })}
                    className="rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-yellow-100">
                    I acknowledge this content is for educational purposes only and should not replace professional medical advice.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Consent & Terms */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-white">Content Submission Agreement</h3>
          
          <div className="space-y-3 text-sm text-gray-300">
            <p>By uploading content to Thadam, you agree that:</p>
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
              className="rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-white">
              I provide my consent and agree to the terms above *
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!selectedFile || !formData.consent || uploadStatus === 'uploading'}
            className={`px-8 py-4 rounded-lg font-medium text-white transition-all duration-200 ${
              !selectedFile || !formData.consent || uploadStatus === 'uploading'
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-500 shadow-lg hover:shadow-orange-500/25'
            }`}
          >
            {uploadStatus === 'uploading' && (
              <Clock className="h-5 w-5 inline mr-2 animate-spin" />
            )}
            {uploadStatus === 'uploading' ? 'Uploading & Verifying...' : 'Submit for Verification'}
          </button>
        </div>

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-100 font-medium">Content uploaded successfully!</p>
            <p className="text-green-200 text-sm">Your submission is now being processed for authenticity verification.</p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-100 font-medium">Upload failed</p>
            <p className="text-red-200 text-sm">Please try again or contact support if the issue persists.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadPage;