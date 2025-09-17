export interface Part {
  id: number;
  inventoryId: number;
  title: string;
  category: string;
  quantity: number;
  imageUrl: string;
}

export interface NewPart {
  title: string;
  categoryId: number;
  quantity: number;
  image?: File;
}

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred.' }));
    throw new Error(errorData.detail || 'Request failed');
  }
  return response.json();
};

export const fetchParts = async (): Promise<Part[]> => {
  const response = await fetch('/api/parts');
  return handleApiResponse(response);
};

export const uploadPartImage = async (partId: number, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`/api/parts/${partId}/image`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to upload image for part ID ${partId}: ${errorData.detail}`);
  }
};

export const deletePart = async (id: number): Promise<void> => {
  const response = await fetch(`/api/parts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete part.');
  }
};

export const createPart = async (newPart: NewPart): Promise<Part> => {
  const formData = new FormData();
  formData.append('title', newPart.title);
  formData.append('category_id', newPart.categoryId.toString());
  formData.append('quantity', newPart.quantity.toString());
  if (newPart.image) {
    formData.append('file', newPart.image);
  }

  const response = await fetch('/api/parts', {
    method: 'POST',
    body: formData,
  });
  return handleApiResponse(response);
};
