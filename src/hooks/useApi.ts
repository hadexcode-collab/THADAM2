import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, metadata: any) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await apiService.uploadContent(file, metadata);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, uploadProgress, error };
}

export function usePacks(filters?: { category?: string; difficulty?: string; search?: string }) {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCulturalPacks(filters);
        setPacks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch packs');
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, [filters?.category, filters?.difficulty, filters?.search]);

  return { packs, loading, error, refetch: () => fetchPacks() };
}

export function usePack(packId: string) {
  const [pack, setPack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPack = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPack(packId);
        setPack(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pack');
      } finally {
        setLoading(false);
      }
    };

    if (packId) {
      fetchPack();
    }
  }, [packId]);

  return { pack, loading, error };
}