import { useState, useEffect, useMemo, useCallback } from 'react';

export interface Part {
  id: number;
  inventoryId: number;
  title: string;
  category: string;
  quantity: number;
  imageUrl: string;
}

export const usePartsManager = () => {
  const [initialParts, setInitialParts] = useState<Part[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [pendingImageFiles, setPendingImageFiles] = useState<Map<number, File>>(new Map());
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
      setPendingImageFiles(new Map()); // データを再取得したら保留中のファイルはクリア
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

  const stageImageChange = useCallback((partId: number, newImageUrl: string, file: File) => {
    // プレビュー用のURLを更新
    setParts(currentParts =>
      currentParts.map(p => (p.id === partId ? { ...p, imageUrl: newImageUrl } : p))
    );
    // 更新ボタンが押されたときにアップロードするためにファイルを保持
    setPendingImageFiles(prev => new Map(prev).set(partId, file));
  }, []);

  const handleCancel = useCallback(() => {
    setParts(JSON.parse(JSON.stringify(initialParts)));
    setPendingImageFiles(new Map()); // 保留中の画像の変更もキャンセル
  }, [initialParts]);

  const handleUpdate = useCallback(async () => {
    setIsUpdating(true);
    setError(null);

    try {
      // ステップ1: 保留中の画像をアップロード
      if (pendingImageFiles.size > 0) {
        const uploadPromises = Array.from(pendingImageFiles.entries()).map(async ([partId, file]) => {
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch(`/api/parts/${partId}/image`, {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`ID ${partId} の画像アップロードに失敗しました: ${errorData.detail}`);
          }
        });
        await Promise.all(uploadPromises);
      }

      // ステップ2: 数量の変更を更新
      const changedParts = parts.filter(part => {
        const initialPart = initialParts.find(p => p.id === part.id);
        // 画像変更はアップロード済みなので、数量の変更のみをチェック
        return initialPart && initialPart.quantity !== part.quantity;
      });

      if (changedParts.length > 0) {
        const payload = changedParts.map(p => ({ id: p.inventoryId, quantity: p.quantity }));
        const response = await fetch('/api/inventory/batch', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`在庫の更新に失敗しました: ${errorData.detail}`);
        }
      }

      // ステップ3: 全ての更新が成功した後、サーバーから最新の状態を再取得
      await fetchParts();

    } catch (err) {
      setError(err instanceof Error ? err.message : '更新処理中に不明なエラーが発生しました。');
      // エラーが発生した場合も、サーバーとの状態を同期するためにデータを再取得
      await fetchParts();
    } finally {
      setIsUpdating(false);
    }
  }, [parts, initialParts, pendingImageFiles, fetchParts]);
  
  const handleDelete = useCallback(async (id: number) => {
    setError(null);
    try {
        const response = await fetch(`/api/parts/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('部品の削除に失敗しました。');
        }
        await fetchParts();
    } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
    }
  }, [fetchParts]);

  const handleSaveNewPart = useCallback(async (newPart: { title: string; categoryId: number; quantity: number; image?: File }) => {
    setError(null);
    try {
      const response = await fetch('/api/parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPart.title,
          category_id: newPart.categoryId,
          quantity: newPart.quantity,
        }),
      });
      if (!response.ok) {
        throw new Error('部品の作成に失敗しました。');
      }
      const createdPart = await response.json();

      if (newPart.image) {
        const formData = new FormData();
        formData.append("file", newPart.image);
        const imageResponse = await fetch(`/api/parts/${createdPart.id}/image`, {
          method: 'POST',
          body: formData,
        });
        if (!imageResponse.ok) {
          throw new Error('画像のアップロードに失敗しました。');
        }
      }
      await fetchParts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
    }
  }, [fetchParts]);


  const hasChanges = useMemo(() => {
    // 数量または画像の変更があったかどうかを判定
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
