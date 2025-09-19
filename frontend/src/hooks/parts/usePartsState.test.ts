import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePartsState } from './usePartsState';
import { Part } from '@/api/partsApi';

const mockInitialParts: Part[] = [
  { id: 1, title: 'Part 1', quantity: 10, imageUrl: 'url1', inventoryId: 101, category: 'Category A' },
  { id: 2, title: 'Part 2', quantity: 20, imageUrl: 'url2', inventoryId: 102, category: 'Category B' },
];

describe('usePartsState with Change Log', () => {
  it('初期状態で正しく部品が設定される', () => {
    const { result } = renderHook(() => usePartsState(mockInitialParts));
    expect(result.current.parts).toEqual(mockInitialParts);
    expect(result.current.hasChanges).toBe(false);
  });

  it('handleQuantityChange で部品の数量が変更され、表示に反映される', async () => {
    const { result } = renderHook(() => usePartsState(mockInitialParts));

    act(() => {
      result.current.handleQuantityChange(1, 15);
    });

    await waitFor(() => {
      expect(result.current.parts.find(p => p.id === 1)?.quantity).toBe(15);
    });
    expect(result.current.hasChanges).toBe(true);
  });

  it('数量を元に戻すと、変更ログから削除され、hasChanges が false になる', async () => {
    const { result } = renderHook(() => usePartsState(mockInitialParts));

    act(() => {
      result.current.handleQuantityChange(1, 15);
    });
    await waitFor(() => expect(result.current.hasChanges).toBe(true));

    act(() => {
      result.current.handleQuantityChange(1, 10); // 元の数量に戻す
    });
    await waitFor(() => expect(result.current.hasChanges).toBe(false));
    expect(result.current.parts.find(p => p.id === 1)?.quantity).toBe(10);
  });

  it('stageImageChange で画像が変更され、表示に反映される', async () => {
    const { result } = renderHook(() => usePartsState(mockInitialParts));
    const mockFile = new File([''], 'image.png', { type: 'image/png' });

    act(() => {
      result.current.stageImageChange(1, 'new-url', mockFile);
    });

    await waitFor(() => {
      expect(result.current.parts.find(p => p.id === 1)?.imageUrl).toBe('new-url');
    });
    expect(result.current.pendingImageFiles.get(1)).toBe(mockFile);
    expect(result.current.hasChanges).toBe(true);
  });

  it('handleCancel で全ての変更がリセットされる', async () => {
    const { result } = renderHook(() => usePartsState(mockInitialParts));
    const mockFile = new File([''], 'image.png', { type: 'image/png' });

    act(() => {
      result.current.handleQuantityChange(1, 15);
      result.current.stageImageChange(2, 'new-url', mockFile);
    });

    await waitFor(() => expect(result.current.hasChanges).toBe(true));

    act(() => {
      result.current.handleCancel();
    });

    await waitFor(() => {
      expect(result.current.parts).toEqual(mockInitialParts);
      expect(result.current.pendingImageFiles.size).toBe(0);
      expect(result.current.hasChanges).toBe(false);
    });
  });

  describe('initialParts が変更された場合（検索実行時など）', () => {
    it('ユーザーによる変更は、initialParts が更新されても維持される', async () => {
      const { result, rerender } = renderHook(({ initialParts }) => usePartsState(initialParts), {
        initialProps: { initialParts: mockInitialParts },
      });

      act(() => result.current.handleQuantityChange(1, 15));

      const newInitialParts = [
        { id: 1, title: 'Part 1 Updated', quantity: 10, imageUrl: 'url1', inventoryId: 101, category: 'Category A' },
        { id: 3, title: 'Part 3', quantity: 30, imageUrl: 'url3', inventoryId: 103, category: 'Category C' },
      ];
      rerender({ initialParts: newInitialParts });

      await waitFor(() => {
        expect(result.current.parts.find(p => p.id === 1)?.quantity).toBe(15);
        expect(result.current.parts.find(p => p.id === 3)?.quantity).toBe(30);
        expect(result.current.parts.find(p => p.id === 2)).toBeUndefined();
      });
    });

    it('一度検索対象から外れても、再度表示された際に変更は維持されるべき', async () => {
      const { result, rerender } = renderHook(({ initialParts }) => usePartsState(initialParts), {
        initialProps: { initialParts: mockInitialParts },
      });

      act(() => result.current.handleQuantityChange(1, 15));
      await waitFor(() => expect(result.current.parts.find(p => p.id === 1)?.quantity).toBe(15));

      const filteredInitialParts = [mockInitialParts[1]]; // Part 2 のみ
      rerender({ initialParts: filteredInitialParts });
      await waitFor(() => expect(result.current.parts.find(p => p.id === 1)).toBeUndefined());

      rerender({ initialParts: mockInitialParts });

      await waitFor(() => {
        expect(result.current.parts.find(p => p.id === 1)?.quantity).toBe(15);
      });
    });
  });
});
