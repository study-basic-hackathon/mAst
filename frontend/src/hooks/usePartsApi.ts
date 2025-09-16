import { useState, useEffect, useCallback } from 'react';
import * as partsApi from '@/api/partsApi';
import * as inventoryApi from '@/api/inventoryApi';
import { Part, NewPart } from '@/api/partsApi';

export const usePartsApi = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);

  const loadParts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await partsApi.fetchParts();
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

  const deletePart = useCallback(async (id: number) => {
    setError(null);
    try {
      await partsApi.deletePart(id);
      await loadParts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while deleting the part.');
    }
  }, [loadParts]);

  const createPart = useCallback(async (newPart: NewPart) => {
    setError(null);
    try {
      await partsApi.createPart(newPart);
      await loadParts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while saving the new part.');
    }
  }, [loadParts]);

  const updateParts = useCallback(async (changedParts: Part[], pendingImageFiles: Map<number, File>) => {
    setIsUpdating(true);
    setError(null);
    try {
      if (pendingImageFiles.size > 0) {
        const uploadPromises = Array.from(pendingImageFiles.entries()).map(([partId, file]) =>
          partsApi.uploadPartImage(partId, file)
        );
        await Promise.all(uploadPromises);
      }

      const inventoryUpdates = changedParts.map(p => ({ id: p.inventoryId, quantity: p.quantity }));
      if (inventoryUpdates.length > 0) {
        await inventoryApi.batchUpdateInventory(inventoryUpdates);
      }

      await loadParts();
      setIsUpdateSuccessful(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during the update process.');
      await loadParts(); // Reload to reset state on error
    } finally {
      setIsUpdating(false);
    }
  }, [loadParts]);

  const resetUpdateStatus = useCallback(() => {
    setIsUpdateSuccessful(false);
  }, []);

  return {
    parts,
    isLoading,
    isUpdating,
    error,
    reload: loadParts,
    deletePart,
    createPart,
    updateParts,
    isUpdateSuccessful,
    resetUpdateStatus,
  };
};
