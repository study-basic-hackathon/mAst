import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePartsState } from './usePartsState';
import { Part } from '@/api/partsApi';

const mockInitialParts: Part[] = [
  { id: 1, title: 'Part 1', quantity: 10, imageUrl: 'url1', inventoryId: 101, category: 'Category A' },
  { id: 2, title: 'Part 2', quantity: 20, imageUrl: 'url2', inventoryId: 102, category: 'Category B' },
];

describe('usePartsState', () => {
  it('初期状態で正しく部品が設定される', () => {
    const { result } = renderHook(() => usePartsState(mockInitialParts));
    expect(result.current.parts).toEqual(mockInitialParts);
    expect(result.current.hasChanges).toBe(false);
  });

  it('handleQuantityChange で部品の数量が変更される', () => {
    const { result } = renderHook(() => usePartsState(mockInitialParts));

    act(() => {
      result.current.handleQuantityChange(1, 15);
    });

    expect(result.current.parts.find(p => p.id === 1)?.quantity).toBe(15);
    expect(result.current.hasChanges).toBe(true);
  });

  it('stageImageChange で画像のURLが変更され、保留中のファイルが設定される', () => {
    const { result } = renderHook(() => usePartsState(mockInitialParts));
    const mockFile = new File([''], 'image.png', { type: 'image/png' });

    act(() => {
      result.current.stageImageChange(1, 'new-url', mockFile);
    });

    expect(result.current.parts.find(p => p.id === 1)?.imageUrl).toBe('new-url');
    expect(result.current.pendingImageFiles.get(1)).toBe(mockFile);
    expect(result.current.hasChanges).toBe(true);
  });

  it('handleCancel で変更がリセットされる', () => {
    const { result } = renderHook(() => usePartsState(mockInitialParts));
    const mockFile = new File([''], 'image.png', { type: 'image/png' });

    act(() => {
      result.current.handleQuantityChange(1, 15);
      result.current.stageImageChange(2, 'new-url', mockFile);
    });

    expect(result.current.hasChanges).toBe(true);

    act(() => {
      result.current.handleCancel();
    });

    expect(result.current.parts).toEqual(mockInitialParts);
    expect(result.current.pendingImageFiles.size).toBe(0);
    expect(result.current.hasChanges).toBe(false);
  });

  it('hasChanges が数量の変更を正しく検知する', () => {
    const { result } = renderHook(() => usePartsState(mockInitialParts));
    expect(result.current.hasChanges).toBe(false);
    act(() => {
      result.current.handleQuantityChange(1, 11);
    });
    expect(result.current.hasChanges).toBe(true);
  });

  it('hasChanges が画像の変更を正しく検知する', () => {
    const { result } = renderHook(() => usePartsState(mockInitialParts));
    const mockFile = new File([''], 'image.png', { type: 'image/png' });
    expect(result.current.hasChanges).toBe(false);
    act(() => {
      result.current.stageImageChange(1, 'new-url', mockFile);
    });
    expect(result.current.hasChanges).toBe(true);
  });
});
