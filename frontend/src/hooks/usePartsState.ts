import { useState, useEffect, useMemo, useCallback } from 'react';
import { Part } from '@/api/partsApi';

export const usePartsState = (initialParts: Part[]) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [pendingImageFiles, setPendingImageFiles] = useState<Map<number, File>>(new Map());

  useEffect(() => {
    setParts(JSON.parse(JSON.stringify(initialParts)));
    setPendingImageFiles(new Map());
  }, [initialParts]);

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

  const hasChanges = useMemo(() => {
    const quantityChanged = JSON.stringify(initialParts.map(p => ({id: p.id, quantity: p.quantity}))) !== JSON.stringify(parts.map(p => ({id: p.id, quantity: p.quantity})));
    const imageChanged = pendingImageFiles.size > 0;
    return quantityChanged || imageChanged;
  }, [initialParts, parts, pendingImageFiles]);

  return {
    parts,
    pendingImageFiles,
    hasChanges,
    handleQuantityChange,
    stageImageChange,
    handleCancel,
  };
};
