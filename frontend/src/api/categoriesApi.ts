import { Category } from '@/hooks/useCategories';

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('カテゴリーの取得に失敗しました。');
  }
  const data = await response.json();
  return data;
};
