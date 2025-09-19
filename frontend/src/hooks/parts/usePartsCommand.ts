import { useState, useCallback } from 'react';
import * as partsApi from '@/api/partsApi';
import * as inventoryApi from '@/api/inventoryApi';
import { Part, NewPart } from '@/api/partsApi';

type ReloadFunction = () => Promise<void>;

export const usePartsCommand = (reload: ReloadFunction) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);

  const deletePart = useCallback(async (id: number) => {
    setError(null);
    try {
      await partsApi.deletePart(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while deleting the part.');
    } finally {
      await reload();
    }
  }, [reload]);

  const createPart = useCallback(async (newPart: NewPart) => {
    setError(null);
    try {
      await partsApi.createPart(newPart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while saving the new part.');
    } finally {
      await reload();
    }
  }, [reload]);

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

      setIsUpdateSuccessful(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during the update process.');
    } finally {
      await reload();
      setIsUpdating(false);
    }
  }, [reload]);

  const resetUpdateStatus = useCallback(() => {
    setIsUpdateSuccessful(false);
  }, []);

  return {
    isUpdating,
    error,
    deletePart,
    createPart,
    updateParts,
    isUpdateSuccessful,
    resetUpdateStatus,
  };
};
