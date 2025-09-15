import { useState, useEffect, useCallback } from 'react';
import { fetchCategories as fetchCategoriesApi } from '../api/categoriesApi';

export interface Category {
  id: number;
  name: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchCategoriesApi();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, error };
};
