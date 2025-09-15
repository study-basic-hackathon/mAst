import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { usePartsManager } from './usePartsManager';
import * as partsApi from '../api/partsApi';

vi.mock('../api/partsApi');

describe('usePartsManager', () => {
  beforeEach(() => {
    vi.mocked(partsApi.fetchParts).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('新しい部品を正常に作成する', async () => {
    const mockCreatedPart: partsApi.Part = { id: 1, inventoryId: 101, title: 'New Part', category: 'Category A', quantity: 10, imageUrl: '' };
    
    vi.mocked(partsApi.createPart).mockResolvedValue(mockCreatedPart);
    vi.mocked(partsApi.fetchParts).mockResolvedValueOnce([]).mockResolvedValueOnce([mockCreatedPart]);

    const { result } = renderHook(() => usePartsManager());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const newPartData = { title: 'New Part', categoryId: 1, quantity: 10 };
    await act(async () => {
      await result.current.handleSaveNewPart(newPartData);
    });

    expect(partsApi.createPart).toHaveBeenCalledWith(newPartData);
    expect(partsApi.fetchParts).toHaveBeenCalledTimes(2);
    expect(result.current.parts).toEqual([mockCreatedPart]);
    expect(result.current.error).toBeNull();
  });
});
