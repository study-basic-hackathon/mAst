import { describe, it, expect, vi, afterEach } from 'vitest';
import { batchUpdateInventory, UpdateInventoryPayload } from './inventoryApi';

global.fetch = vi.fn();

describe('inventoryApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('batchUpdateInventory', () => {
    it('成功した場合、正常に解決されるべき', async () => {
      const payload: UpdateInventoryPayload[] = [{ id: 1, quantity: 10 }];
      (fetch as vi.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await expect(batchUpdateInventory(payload)).resolves.toBeUndefined();

      expect(fetch).toHaveBeenCalledWith('/api/inventory/batch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    });

    it('失敗した場合、エラーメッセージをスローすべき', async () => {
      const payload: UpdateInventoryPayload[] = [{ id: 1, quantity: 10 }];
      const errorResponse = { detail: 'Inventory update failed' };
      (fetch as vi.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(batchUpdateInventory(payload)).rejects.toThrow(
        `Failed to update inventory: ${errorResponse.detail}`
      );
    });
  });
});
