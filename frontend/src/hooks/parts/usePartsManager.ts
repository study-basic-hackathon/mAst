import { useCallback } from 'react';
import { Part } from '@/api/partsApi';
import { usePartsState } from '@/hooks/parts/usePartsState';
import { usePartsQuery } from './usePartsQuery';
import { usePartsCommand } from './usePartsCommand';

export type { Part };

export const usePartsManager = () => {
  const {
    parts: initialParts,
    isLoading,
    error: queryError,
    reload,
  } = usePartsQuery();
  const {
    isUpdating,
    error: commandError,
    deletePart,
    createPart,
    updateParts,
    isUpdateSuccessful,
    resetUpdateStatus,
  } = usePartsCommand(reload);

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
    error: queryError || commandError,
    hasChanges,
    handleQuantityChange,
    stageImageChange,
    handleCancel,
    handleUpdate,
    handleDelete: deletePart,
    handleSaveNewPart: createPart,
    isUpdateSuccessful,
    resetUpdateStatus,
  };
};
