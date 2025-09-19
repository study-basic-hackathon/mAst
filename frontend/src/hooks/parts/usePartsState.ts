import { useState, useEffect, useMemo, useCallback } from 'react';
import { Part } from '@/api/partsApi';

// 変更差分のみを保持するための型
type PartChanges = Partial<Pick<Part, 'quantity' | 'imageUrl'>>;

export const usePartsState = (initialParts: Part[]) => {
  const [parts, setParts] = useState<Part[]>([]);
  // ユーザーによる変更を永続的に記録する「変更ログ」
  const [changesMap, setChangesMap] = useState<Map<number, PartChanges>>(new Map());
  const [pendingImageFiles, setPendingImageFiles] = useState<Map<number, File>>(new Map());

  useEffect(() => {
    // initialParts が更新されたら、それに基づいて表示用の parts を再構築する
    // その際、すでにある変更ログを適用する
    const newParts = initialParts.map(part => {
      const changes = changesMap.get(part.id);
      return changes ? { ...part, ...changes } : part;
    });
    setParts(newParts);
  }, [initialParts, changesMap]);

  const handleQuantityChange = useCallback((partId: number, newQuantity: number) => {
    setChangesMap(prev => {
      const newChanges = new Map(prev);
      const currentChanges = newChanges.get(partId) || {};
      // initialParts から元の値を取得して比較する
      const originalPart = initialParts.find(p => p.id === partId);
      // 変更後の値が元の値と同じであれば、変更ログから削除する
      if (originalPart && originalPart.quantity === newQuantity) {
        delete currentChanges.quantity;
        if (Object.keys(currentChanges).length === 0) {
          newChanges.delete(partId);
        } else {
          newChanges.set(partId, currentChanges);
        }
      } else {
        newChanges.set(partId, { ...currentChanges, quantity: newQuantity });
      }
      return newChanges;
    });
  }, [initialParts]);

  const stageImageChange = useCallback((partId: number, newImageUrl: string, file: File) => {
    setChangesMap(prev => {
      const newChanges = new Map(prev);
      const currentChanges = newChanges.get(partId) || {};
      newChanges.set(partId, { ...currentChanges, imageUrl: newImageUrl });
      return newChanges;
    });
    setPendingImageFiles(prev => new Map(prev).set(partId, file));
  }, []);

  const handleCancel = useCallback(() => {
    setChangesMap(new Map());
    setPendingImageFiles(new Map());
  }, []);

  const hasChanges = useMemo(() => changesMap.size > 0, [changesMap]);

  return {
    parts,
    pendingImageFiles,
    hasChanges,
    handleQuantityChange,
    stageImageChange,
    handleCancel,
  };
};
