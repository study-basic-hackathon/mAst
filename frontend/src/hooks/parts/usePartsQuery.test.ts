import { renderHook, waitFor, act } from '@testing-library/react';
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

  describe('search関数', () => {
    it('指定された部品名でAPIを呼び出し、部品リストを更新する', async () => {
      vi.mocked(partsApi.fetchParts).mockResolvedValueOnce([]); // 初期ロード
      const searchResultParts: Part[] = [
        { id: 2, title: 'Search Result Part', quantity: 5, imageUrl: 'url2', inventoryId: 102, category: 'Category B' },
      ];
      // searchのAPIコールをモック
      vi.mocked(partsApi.fetchParts).mockResolvedValueOnce(searchResultParts);

      const { result } = renderHook(() => usePartsQuery());

      // 初期ロード完了を待つ
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // search関数を実行
      const searchCriteria = { name: 'Result' };
      act(() => {
        result.current.search(searchCriteria);
      });

      // ローディング状態の確認
      expect(result.current.isLoading).toBe(true);

      // 検索結果が反映されるのを待つ
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.parts).toEqual(searchResultParts);
        expect(result.current.error).toBeNull();
      });

      // fetchPartsが検索条件付きで呼ばれたことを確認
      // (現時点ではfetchPartsを流用するが、将来的にはsearchPartsのような別関数になる想定)
      expect(partsApi.fetchParts).toHaveBeenCalledWith(searchCriteria);
      expect(partsApi.fetchParts).toHaveBeenCalledTimes(2); // initial load + search
    });

    it('指定されたカテゴリIDでAPIを呼び出し、部品リストを更新する', async () => {
      vi.mocked(partsApi.fetchParts).mockResolvedValueOnce([]); // 初期ロード
      const searchResultParts: Part[] = [
        { id: 3, title: 'Category Search Result', quantity: 15, imageUrl: 'url3', inventoryId: 103, category: 'Category C' },
      ];
      vi.mocked(partsApi.fetchParts).mockResolvedValueOnce(searchResultParts);

      const { result } = renderHook(() => usePartsQuery());
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const searchCriteria = { categoryId: 2 };
      act(() => {
        result.current.search(searchCriteria);
      });

      expect(result.current.isLoading).toBe(true);
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.parts).toEqual(searchResultParts);
      });

      expect(partsApi.fetchParts).toHaveBeenCalledWith(searchCriteria);
      expect(partsApi.fetchParts).toHaveBeenCalledTimes(2);
    });

    it('検索APIの呼び出しに失敗した場合にエラーを設定する', async () => {
      vi.mocked(partsApi.fetchParts).mockResolvedValueOnce([]); // 初期ロード
      const errorMessage = 'Search failed';
      vi.mocked(partsApi.fetchParts).mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => usePartsQuery());

      // 初期ロード完了を待つ
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // search関数を実行
      act(() => {
        result.current.search({ name: 'error' });
      });

      // ローディング状態の確認
      expect(result.current.isLoading).toBe(true);

      // エラーが設定されるのを待つ
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
      });
    });
  });
});
