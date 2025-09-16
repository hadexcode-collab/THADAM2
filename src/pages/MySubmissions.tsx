import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, Download } from 'lucide-react';

interface Submission {
  id: string;
  title: string;
  category: string;
  status: 'processing' | 'verified' | 'rejected' | 'review';
  authenticity_score: number | null;
  uploaded_at: string;
  verified_at: string | null;
  pack_id: string | null;
}

const MySubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-400 animate-spin" />;
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'review':
        return <AlertCircle className="h-5 w-5 text-orange-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'verified':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'review':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">My Submissions</h1>
        <p className="text-gray-400 text-lg">
          Track the verification status of your cultural content submissions
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Submissions', value: submissions.length, color: 'text-blue-400' },
          { label: 'Verified', value: submissions.filter(s => s.status === 'verified').length, color: 'text-green-400' },
          { label: 'Under Review', value: submissions.filter(s => s.status === 'review').length, color: 'text-orange-400' },
          { label: 'Processing', value: submissions.filter(s => s.status === 'processing').length, color: 'text-yellow-400' }
        ].map((stat, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No submissions yet</h3>
            <p className="text-gray-500">Upload your first cultural content to get started</p>
          </div>
        ) : (
          submissions.map((submission) => (
            <div key={submission.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-medium text-white">{submission.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      <span className="ml-2 capitalize">{submission.status}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <span>{submission.category}</span>
                    <span>Uploaded: {new Date(submission.uploaded_at).toLocaleDateString()}</span>
                    {submission.verified_at && (
                      <span>Verified: {new Date(submission.verified_at).toLocaleDateString()}</span>
                    )}
                  </div>

                  {submission.authenticity_score !== null && (
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400">Authenticity Score:</span>
                      <div className={`text-xl font-bold ${getScoreColor(submission.authenticity_score)}`}>
                        {submission.authenticity_score}%
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-40">
                        <div
                          className={`h-2 rounded-full ${
                            submission.authenticity_score >= 80 ? 'bg-green-400' :
                            submission.authenticity_score >= 70 ? 'bg-orange-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${submission.authenticity_score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  
                  {submission.pack_id && (
                    <button
                      className="p-2 text-green-400 hover:text-green-300 hover:bg-gray-700 rounded-lg transition-colors"
                      title="View Generated Pack"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedSubmission.title}</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Status:</span>
                  <div className={`flex items-center space-x-2 mt-1 ${getStatusColor(selectedSubmission.status)}`}>
                    {getStatusIcon(selectedSubmission.status)}
                    <span className="capitalize font-medium">{selectedSubmission.status}</span>
                  </div>
                </div>
                
                {selectedSubmission.authenticity_score !== null && (
                  <div>
                    <span className="text-gray-400 text-sm">Authenticity:</span>
                    <div className={`text-2xl font-bold mt-1 ${getScoreColor(selectedSubmission.authenticity_score)}`}>
                      {selectedSubmission.authenticity_score}%
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <span className="text-gray-400 text-sm">Category:</span>
                <div className="text-white mt-1">{selectedSubmission.category}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Uploaded:</span>
                  <div className="text-white">{new Date(selectedSubmission.uploaded_at).toLocaleString()}</div>
                </div>
                {selectedSubmission.verified_at && (
                  <div>
                    <span className="text-gray-400">Verified:</span>
                    <div className="text-white">{new Date(selectedSubmission.verified_at).toLocaleString()}</div>
                  </div>
                )}
              </div>

              {selectedSubmission.status === 'verified' && selectedSubmission.pack_id && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-100">
                    ✅ Your content has been verified and transformed into a learning pack!
                  </p>
                </div>
              )}
              
              {selectedSubmission.status === 'rejected' && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-100">
                    ❌ Content did not meet authenticity requirements (&lt;70% score)
                  </p>
                </div>
              )}
              
              {selectedSubmission.status === 'review' && (
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <p className="text-orange-100">
                    ⏳ Content scored 70-79% and is under manual review by cultural experts
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;