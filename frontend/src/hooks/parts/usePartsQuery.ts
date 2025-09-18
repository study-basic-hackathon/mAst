import { useState, useEffect, useCallback } from 'react';
import * as partsApi from '@/api/partsApi';
import { Part, SearchCriteria } from '@/api/partsApi';

export const usePartsQuery = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadParts = useCallback(async (criteria?: SearchCriteria) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await partsApi.fetchParts(criteria);
      setParts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching parts.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParts();
  }, [loadParts]);

  return {
    parts,
    isLoading,
    error,
    reload: () => loadParts(),
    search: loadParts,
  };
};
