export interface UpdateInventoryPayload {
  id: number;
  quantity: number;
}

export const batchUpdateInventory = async (payload: UpdateInventoryPayload[]): Promise<void> => {
  const response = await fetch('/api/inventory/batch', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update inventory: ${errorData.detail}`);
  }
};
