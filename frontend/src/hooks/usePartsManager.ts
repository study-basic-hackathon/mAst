import { useCallback } from 'react';
import { Part } from '../api/partsApi';
import { usePartsApi } from './usePartsApi';
import { usePartsState } from './usePartsState';

export type { Part };

export const usePartsManager = () => {
  const {
    parts: initialParts,
    isLoading,
    isUpdating,
    error,
    deletePart,
    createPart,
    updateParts,
  } = usePartsApi();

  const {
    parts,
    pendingImageFiles,
    hasChanges,
    handleQuantityChange,
    stageImageChange,
    handleCancel,
  } = usePartsState(initialParts);

  const handleUpdate = useCallback(async () => {
    const changedParts = parts.filter(part => {
      const initialPart = initialParts.find(p => p.id === part.id);
      if (!initialPart) return false;
      // 数量または画像URLが変更されたものを対象とする
      return initialPart.quantity !== part.quantity || initialPart.imageUrl !== part.imageUrl;
    });

    // 数量が変更された部品のみを在庫更新APIに渡す
    const inventoryChangedParts = changedParts.filter(part => {
        const initialPart = initialParts.find(p => p.id === part.id);
        return initialPart && initialPart.quantity !== part.quantity;
    });

    await updateParts(inventoryChangedParts, pendingImageFiles);
  }, [parts, initialParts, pendingImageFiles, updateParts]);

  return {
    parts,
    initialParts,
    isLoading,
    isUpdating,
    error,
    hasChanges,
    handleQuantityChange,
    stageImageChange,
    handleCancel,
    handleUpdate,
    handleDelete: deletePart,
    handleSaveNewPart: createPart,
  };
};
