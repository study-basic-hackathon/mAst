import { useState, useEffect, useMemo, useCallback } from 'react';
import * as partsApi from '../api/partsApi';
import * as inventoryApi from '../api/inventoryApi';
import { Part, NewPart } from '../api/partsApi';

export type { Part };

export const usePartsManager = () => {
  const [initialParts, setInitialParts] = useState<Part[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [pendingImageFiles, setPendingImageFiles] = useState<Map<number, File>>(new Map());
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadParts = useCallback(async () => {
    try {
      setError(null);
      const data = await partsApi.fetchParts();
      const deepClonedData = JSON.parse(JSON.stringify(data));
      setInitialParts(deepClonedData);
      setParts(data);
      setPendingImageFiles(new Map());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching parts.');
    }
  }, []);

  useEffect(() => {
    loadParts();
  }, [loadParts]);

  const handleQuantityChange = useCallback((partId: number, newQuantity: number) => {
    setParts(currentParts =>
      currentParts.map(p => (p.id === partId ? { ...p, quantity: newQuantity } : p))
    );
  }, []);

  const stageImageChange = useCallback((partId: number, newImageUrl: string, file: File) => {
    setParts(currentParts =>
      currentParts.map(p => (p.id === partId ? { ...p, imageUrl: newImageUrl } : p))
    );
    setPendingImageFiles(prev => new Map(prev).set(partId, file));
  }, []);

  const handleCancel = useCallback(() => {
    setParts(JSON.parse(JSON.stringify(initialParts)));
    setPendingImageFiles(new Map());
  }, [initialParts]);

  const handleUpdate = useCallback(async () => {
    setIsUpdating(true);
    setError(null);

    try {
      if (pendingImageFiles.size > 0) {
        const uploadPromises = Array.from(pendingImageFiles.entries()).map(([partId, file]) =>
          partsApi.uploadPartImage(partId, file)
        );
        await Promise.all(uploadPromises);
      }

      const changedParts = parts.filter(part => {
        const initialPart = initialParts.find(p => p.id === part.id);
        return initialPart && initialPart.quantity !== part.quantity;
      });

      if (changedParts.length > 0) {
        const payload = changedParts.map(p => ({ id: p.inventoryId, quantity: p.quantity }));
        await inventoryApi.batchUpdateInventory(payload);
      }

      await loadParts();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during the update process.');
      await loadParts();
    } finally {
      setIsUpdating(false);
    }
  }, [parts, initialParts, pendingImageFiles, loadParts]);
  
  const handleDelete = useCallback(async (id: number) => {
    setError(null);
    try {
        await partsApi.deletePart(id);
        await loadParts();
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while deleting the part.');
    }
  }, [loadParts]);

  const handleSaveNewPart = useCallback(async (newPart: NewPart) => {
    setError(null);
    try {
      await partsApi.createPart(newPart);
      await loadParts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while saving the new part.');
    }
  }, [loadParts]);

  const hasChanges = useMemo(() => {
    const quantityChanged = JSON.stringify(initialParts.map(p => ({id: p.id, quantity: p.quantity}))) !== JSON.stringify(parts.map(p => ({id: p.id, quantity: p.quantity})));
    const imageChanged = pendingImageFiles.size > 0;
    return quantityChanged || imageChanged;
  }, [initialParts, parts, pendingImageFiles]);

  return {
    parts,
    initialParts,
    isUpdating,
    error,
    hasChanges,
    handleQuantityChange,
    stageImageChange,
    handleCancel,
    handleUpdate,
    handleDelete,
    handleSaveNewPart,
  };
};
