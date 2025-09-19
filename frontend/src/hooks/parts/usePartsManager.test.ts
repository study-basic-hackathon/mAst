import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePartsManager } from './usePartsManager';
import { usePartsQuery } from './usePartsQuery';
import { usePartsCommand } from './usePartsCommand';
import { Part, NewPart } from '@/api/partsApi';

vi.mock('./usePartsQuery');
vi.mock('./usePartsCommand');

const mockInitialParts: Part[] = [
  { id: 1, title: 'Part 1', quantity: 10, imageUrl: 'url1', inventoryId: 101, category: 'Category A' },
];

describe('usePartsManager', () => {
  const mockCreatePart = vi.fn();
  const mockDeletePart = vi.fn();
  const mockUpdateParts = vi.fn();
  const mockReload = vi.fn();
  const mockResetUpdateStatus = vi.fn();

  // モックの基本値を定義
  const mockSearch = vi.fn();

  // モックの基本値を定義
  const baseMockUsePartsQuery = {
    parts: mockInitialParts,
    isLoading: false,
    error: null,
    reload: mockReload,
    search: mockSearch,
  };

  const baseMockUsePartsCommand = {
    isUpdating: false,
    error: null,
    deletePart: mockDeletePart,
    createPart: mockCreatePart,
    updateParts: mockUpdateParts,
    isUpdateSuccessful: false,
    resetUpdateStatus: mockResetUpdateStatus,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePartsQuery).mockReturnValue(baseMockUsePartsQuery);
    vi.mocked(usePartsCommand).mockReturnValue(baseMockUsePartsCommand);
  });

  it('初期状態で正しく部品が設定される', async () => {
    const { result } = renderHook(() => usePartsManager());
    
    await waitFor(() => {
      expect(result.current.parts).toEqual(mockInitialParts);
      expect(result.current.initialParts).toEqual(mockInitialParts);
    });
  });

  it('handleSaveNewPart が usePartsCommand の createPart を呼び出す', async () => {
    const { result } = renderHook(() => usePartsManager());
    const newPart: NewPart = { title: 'New Part', categoryId: 1, quantity: 5 };

    await act(async () => {
      await result.current.handleSaveNewPart(newPart);
    });

    expect(mockCreatePart).toHaveBeenCalledWith(newPart);
  });

  it('handleDelete が usePartsCommand の deletePart を呼び出す', async () => {
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

  it('更新成功状態とリセット関数を正しく返す', () => {
    // isUpdateSuccessfulがtrueの場合をテストするためにモックを上書き
    vi.mocked(usePartsCommand).mockReturnValue({
      ...baseMockUsePartsCommand,
      isUpdateSuccessful: true,
    });

    const { result } = renderHook(() => usePartsManager());

    expect(result.current.isUpdateSuccessful).toBe(true);
    expect(result.current.resetUpdateStatus).toBe(mockResetUpdateStatus);
  });

  it('usePartsQuery から search 関数を正しく返す', () => {
    const { result } = renderHook(() => usePartsManager());

    expect(result.current.search).toBe(mockSearch);
    
    act(() => {
      result.current.search({ name: 'test' });
    });

    expect(mockSearch).toHaveBeenCalledWith({ name: 'test' });
  });
});
