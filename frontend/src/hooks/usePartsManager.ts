import { useState, useEffect, useMemo, useCallback } from 'react';

export interface Part {
  id: number;
  inventoryId: number;
  title: string;
  category: string;
  quantity: number;
}

export const usePartsManager = () => {
  const [initialParts, setInitialParts] = useState<Part[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/parts');
      if (!response.ok) {
        throw new Error('部品データの取得に失敗しました。');
      }
      const data = await response.json();
      setInitialParts(JSON.parse(JSON.stringify(data)));
      setParts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
    }
  }, []);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  const handleQuantityChange = useCallback((partId: number, newQuantity: number) => {
    setParts(currentParts =>
      currentParts.map(p => (p.id === partId ? { ...p, quantity: newQuantity } : p))
    );
  }, []);

  const handleCancel = useCallback(() => {
    setParts(JSON.parse(JSON.stringify(initialParts)));
  }, [initialParts]);

  const handleUpdate = useCallback(async () => {
    const changedParts = parts.filter(part => {
      const initialPart = initialParts.find(p => p.id === part.id);
      return initialPart && initialPart.quantity !== part.quantity;
    });

    if (changedParts.length === 0) return;

    const payload = changedParts.map(p => ({ id: p.inventoryId, quantity: p.quantity }));

    setIsUpdating(true);
    setError(null);
    try {
      const response = await fetch('/api/inventory/batch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('在庫の更新に失敗しました。');
      }
      await fetchParts(); // 更新成功後にデータを再取得
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
      handleCancel(); // エラー時は変更を元に戻す
    } finally {
      setIsUpdating(false);
    }
  }, [parts, initialParts, fetchParts, handleCancel]);
  
  const handleDelete = useCallback(async (id: number) => {
    setError(null);
    try {
        const response = await fetch(`/api/parts/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('部品の削除に失敗しました。');
        }
        await fetchParts(); // 削除成功後にデータを再取得
    } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
    }
  }, [fetchParts]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(initialParts) !== JSON.stringify(parts);
  }, [initialParts, parts]);

  return {
    parts,
    initialParts,
    isUpdating,
    error,
    hasChanges,
    handleQuantityChange,
    handleCancel,
    handleUpdate,
    handleDelete,
  };
};
