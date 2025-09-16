import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as partsApi from '@/api/partsApi';
import * as inventoryApi from '@/api/inventoryApi';
import { usePartsApi } from '@/hooks/usePartsApi';
import { Part, NewPart } from '@/api/partsApi';

// Mock the API modules
vi.mock('@/api/partsApi');
vi.mock('@/api/inventoryApi');

const mockParts: Part[] = [
  { id: 1, title: 'Part 1', quantity: 10, imageUrl: 'url1', inventoryId: 101, category: 'Category A' },
  { id: 2, title: 'Part 2', quantity: 20, imageUrl: 'url2', inventoryId: 102, category: 'Category B' },
];

describe('usePartsApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('初期状態で部品データを正常に読み込む', async () => {
    vi.mocked(partsApi.fetchParts).mockResolvedValue(mockParts);

    const { result } = renderHook(() => usePartsApi());

    expect(result.current.parts).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(true);

    // Wait for the useEffect in the hook to complete
    await act(async () => {
      // Let the hook's useEffect run
    });

    expect(partsApi.fetchParts).toHaveBeenCalledTimes(1);
    expect(result.current.parts).toEqual(mockParts);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('部品データの読み込みに失敗した場合、エラー状態が設定される', async () => {
    const errorMessage = 'Failed to fetch parts';
    vi.mocked(partsApi.fetchParts).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePartsApi());

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      // Let the hook's useEffect run
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.parts).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it('部品を正常に削除する', async () => {
    vi.mocked(partsApi.fetchParts).mockResolvedValue(mockParts);
    vi.mocked(partsApi.deletePart).mockResolvedValue();

    const { result } = renderHook(() => usePartsApi());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.deletePart(1);
    });

    expect(partsApi.deletePart).toHaveBeenCalledWith(1);
    expect(partsApi.fetchParts).toHaveBeenCalledTimes(2); // Initial load + reload
  });

  it('新しい部品を正常に作成する', async () => {
    const newPart: NewPart = { title: 'New Part', categoryId: 1, quantity: 5 };
    const createdPart: Part = { ...newPart, id: 3, inventoryId: 103, imageUrl: '', category: 'Category A' };
    
    vi.mocked(partsApi.fetchParts).mockResolvedValue(mockParts);
    vi.mocked(partsApi.createPart).mockResolvedValue(createdPart);

    const { result } = renderHook(() => usePartsApi());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.createPart(newPart);
    });

    expect(partsApi.createPart).toHaveBeenCalledWith(newPart);
    expect(partsApi.fetchParts).toHaveBeenCalledTimes(2);
  });

  it('部品の在庫と画像を正常に更新する', async () => {
    const changedParts: Part[] = [{ ...mockParts[0], quantity: 15 }];
    const pendingFiles = new Map<number, File>();
    const mockFile = new File([''], 'image.png', { type: 'image/png' });
    pendingFiles.set(1, mockFile);

    vi.mocked(partsApi.fetchParts).mockResolvedValue(mockParts);
    vi.mocked(inventoryApi.batchUpdateInventory).mockResolvedValue();
    vi.mocked(partsApi.uploadPartImage).mockResolvedValue();

    const { result } = renderHook(() => usePartsApi());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateParts(changedParts, pendingFiles);
    });

    expect(partsApi.uploadPartImage).toHaveBeenCalledWith(1, mockFile);
    expect(inventoryApi.batchUpdateInventory).toHaveBeenCalledWith([{ id: 101, quantity: 15 }]);
    expect(partsApi.fetchParts).toHaveBeenCalledTimes(2);
  });
});
