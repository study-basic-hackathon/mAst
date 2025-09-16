import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useCategories } from './useCategories';
import * as categoriesApi from '@/api/categoriesApi';

// categoriesApi.ts の fetchCategories 関数をモック化
vi.mock('@/api/categoriesApi');

describe('useCategories', () => {
  it('カテゴリーが正常に取得できた場合、categoriesステートが更新されること', async () => {
    const mockCategories = [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ];
    // モックされた fetchCategories が mockCategories を返すように設定
    vi.mocked(categoriesApi.fetchCategories).mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategories());

    // fetchCategories が呼び出され、categories が更新されるのを待つ
    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories);
    });

    expect(result.current.error).toBeNull();
  });

  it('カテゴリーの取得に失敗した場合、errorステートが更新されること', async () => {
    const errorMessage = 'カテゴリーの取得に失敗しました。';
    // モックされた fetchCategories がエラーをスローするように設定
    vi.mocked(categoriesApi.fetchCategories).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCategories());

    // fetchCategories が呼び出され、error が更新されるのを待つ
    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
    });

    expect(result.current.categories).toEqual([]);
  });
});
