import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePartsManager } from './usePartsManager';
import { usePartsApi } from './usePartsApi';
import { Part, NewPart } from '../api/partsApi';

vi.mock('./usePartsApi');

const mockInitialParts: Part[] = [
  { id: 1, title: 'Part 1', quantity: 10, imageUrl: 'url1', inventoryId: 101, category: 'Category A' },
];

describe('usePartsManager', () => {
  const mockCreatePart = vi.fn();
  const mockDeletePart = vi.fn();
  const mockUpdateParts = vi.fn();
  const mockReload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePartsApi).mockReturnValue({
      parts: mockInitialParts,
      isLoading: false,
      isUpdating: false,
      error: null,
      reload: mockReload,
      createPart: mockCreatePart,
      deletePart: mockDeletePart,
      updateParts: mockUpdateParts,
    });
  });

  it('初期状態で正しく部品が設定される', async () => {
    const { result } = renderHook(() => usePartsManager());
    
    await waitFor(() => {
      expect(result.current.parts).toEqual(mockInitialParts);
      expect(result.current.initialParts).toEqual(mockInitialParts);
    });
  });

  it('handleSaveNewPart が usePartsApi の createPart を呼び出す', async () => {
    const { result } = renderHook(() => usePartsManager());
    const newPart: NewPart = { title: 'New Part', categoryId: 1, quantity: 5 };

    await act(async () => {
      await result.current.handleSaveNewPart(newPart);
    });

    expect(mockCreatePart).toHaveBeenCalledWith(newPart);
  });

  it('handleDelete が usePartsApi の deletePart を呼び出す', async () => {
    const { result } = renderHook(() => usePartsManager());

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(mockDeletePart).toHaveBeenCalledWith(1);
  });

  it('handleUpdate が数量が変更された部品データと共に updateParts を呼び出す', async () => {
    const { result } = renderHook(() => usePartsManager());
    
    // 数量を変更する
    await act(async () => {
      result.current.handleQuantityChange(1, 15);
    });

    // 更新処理を呼び出す
    await act(async () => {
      await result.current.handleUpdate();
    });

    const expectedInventoryChangedPart = { ...mockInitialParts[0], quantity: 15 };
    expect(mockUpdateParts).toHaveBeenCalledWith([expectedInventoryChangedPart], expect.any(Map));
  });

  it('handleUpdate が画像のみ変更された場合、在庫更新API用のデータは空で updateParts を呼び出す', async () => {
    const { result } = renderHook(() => usePartsManager());
    const mockFile = new File([''], 'image.png', { type: 'image/png' });
    
    // 画像を変更する
    await act(async () => {
      result.current.stageImageChange(1, 'new-url', mockFile);
    });

    // 更新処理を呼び出す
    await act(async () => {
      await result.current.handleUpdate();
    });

    // 数量は変わっていないので、在庫更新用の配列は空になる
    expect(mockUpdateParts).toHaveBeenCalledWith([], expect.any(Map));
  });
});
