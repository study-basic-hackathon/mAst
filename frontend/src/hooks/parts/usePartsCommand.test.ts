import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePartsCommand } from './usePartsCommand';
import * as partsApi from '@/api/partsApi';
import * as inventoryApi from '@/api/inventoryApi';
import { Part, NewPart } from '@/api/partsApi';

vi.mock('@/api/partsApi');
vi.mock('@/api/inventoryApi');

describe('usePartsCommand', () => {
  const mockReload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockReload.mockResolvedValue(undefined);
  });

  it('createPartが正常に部品を作成し、reloadを呼び出す', async () => {
    const newPartResponse: Part = { id: 2, inventoryId: 102, category: 'Category B', ...{ title: 'New Part', categoryId: 1, quantity: 5, imageUrl: '' } };
    vi.mocked(partsApi.createPart).mockResolvedValue(newPartResponse);
    const { result } = renderHook(() => usePartsCommand(mockReload));
    const newPart: NewPart = { title: 'New Part', categoryId: 1, quantity: 5 };

    await act(async () => {
      await result.current.createPart(newPart);
    });

    expect(partsApi.createPart).toHaveBeenCalledWith(newPart);
    expect(mockReload).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });

  it('deletePartが正常に部品を削除し、reloadを呼び出す', async () => {
    vi.mocked(partsApi.deletePart).mockResolvedValue(undefined);
    const { result } = renderHook(() => usePartsCommand(mockReload));

    await act(async () => {
      await result.current.deletePart(1);
    });

    expect(partsApi.deletePart).toHaveBeenCalledWith(1);
    expect(mockReload).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });

  it('updatePartsが正常に部品を更新し、reloadを呼び出す', async () => {
    vi.mocked(inventoryApi.batchUpdateInventory).mockResolvedValue(undefined);
    const { result } = renderHook(() => usePartsCommand(mockReload));
    const changedParts: Part[] = [{ id: 1, title: 'Part 1', quantity: 15, imageUrl: 'url1', inventoryId: 101, category: 'Category A' }];
    const pendingFiles = new Map<number, File>();

    await act(async () => {
      await result.current.updateParts(changedParts, pendingFiles);
    });

    expect(inventoryApi.batchUpdateInventory).toHaveBeenCalledWith([{ id: 101, quantity: 15 }]);
    expect(mockReload).toHaveBeenCalledTimes(1);
    expect(result.current.isUpdateSuccessful).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('updatePartsが画像アップロードも正常に行う', async () => {
    vi.mocked(partsApi.uploadPartImage).mockResolvedValue(undefined);
    const { result } = renderHook(() => usePartsCommand(mockReload));
    const changedParts: Part[] = [];
    const mockFile = new File([''], 'image.png', { type: 'image/png' });
    const pendingFiles = new Map<number, File>([[1, mockFile]]);

    await act(async () => {
      await result.current.updateParts(changedParts, pendingFiles);
    });

    expect(partsApi.uploadPartImage).toHaveBeenCalledWith(1, mockFile);
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('API呼び出しに失敗した場合にエラーを設定する', async () => {
    const errorMessage = 'API Error';
    vi.mocked(partsApi.createPart).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => usePartsCommand(mockReload));
    const newPart: NewPart = { title: 'New Part', categoryId: 1, quantity: 5 };

    await act(async () => {
      await result.current.createPart(newPart);
    });

    expect(result.current.error).toBe(errorMessage);
    // 失敗時もリロードして状態をリセットする仕様なので、呼び出し回数をチェック
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('resetUpdateStatusがisUpdateSuccessfulをfalseにリセットする', async () => {
    vi.mocked(inventoryApi.batchUpdateInventory).mockResolvedValue(undefined);
    const { result } = renderHook(() => usePartsCommand(mockReload));
    
    await act(async () => {
      await result.current.updateParts([], new Map());
    });

    expect(result.current.isUpdateSuccessful).toBe(true);

    act(() => {
      result.current.resetUpdateStatus();
    });

    expect(result.current.isUpdateSuccessful).toBe(false);
  });
});
