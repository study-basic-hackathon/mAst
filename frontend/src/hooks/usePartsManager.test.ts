import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { usePartsManager } from './usePartsManager';

describe('usePartsManager', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a new part successfully', async () => {
    const mockCreatedPart = { id: 1, inventoryId: 101, title: 'New Part', category: 'Category A', quantity: 10, imageUrl: '' };
    
    // 初回のfetchParts呼び出しをモック
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    const { result, rerender } = renderHook(() => usePartsManager());

    // 初回のfetchが完了するのを待つ
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // 部品作成とそれに続くfetchParts呼び出しをモック
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatedPart,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCreatedPart],
      } as Response);

    await act(async () => {
      await result.current.handleSaveNewPart({ title: 'New Part', category: 'Category A', quantity: 10 });
    });

    rerender();

    expect(result.current.parts).toEqual([mockCreatedPart]);
    expect(result.current.error).toBeNull();
  });
});
