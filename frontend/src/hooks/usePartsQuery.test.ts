import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePartsQuery } from './usePartsQuery';
import * as partsApi from '@/api/partsApi';
import { Part } from '@/api/partsApi';

vi.mock('@/api/partsApi');

const mockParts: Part[] = [
  { id: 1, title: 'Part 1', quantity: 10, imageUrl: 'url1', inventoryId: 101, category: 'Category A' },
];

describe('usePartsQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常に部品データを取得する', async () => {
    vi.mocked(partsApi.fetchParts).mockResolvedValue(mockParts);
    const { result } = renderHook(() => usePartsQuery());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.parts).toEqual(mockParts);
      expect(result.current.error).toBeNull();
    });
  });

  it('データ取得に失敗した場合にエラーを設定する', async () => {
    const errorMessage = 'Failed to fetch parts';
    vi.mocked(partsApi.fetchParts).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => usePartsQuery());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.parts).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it('reload関数が呼ばれた際にデータを再取得する', async () => {
    vi.mocked(partsApi.fetchParts).mockResolvedValueOnce(mockParts);
    const { result } = renderHook(() => usePartsQuery());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.parts).toEqual(mockParts);

    const newMockParts = [...mockParts, { id: 2, title: 'Part 2', quantity: 5, imageUrl: 'url2', inventoryId: 102, category: 'Category B' }];
    vi.mocked(partsApi.fetchParts).mockResolvedValueOnce(newMockParts);

    result.current.reload();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.parts).toEqual(newMockParts);
    });
    expect(partsApi.fetchParts).toHaveBeenCalledTimes(2);
  });
});
