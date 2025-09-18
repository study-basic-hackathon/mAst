import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import Search from './Search';
import { usePartsQuery } from '@/hooks/usePartsQuery';
import { Part } from '@/api/partsApi';
import { useCategories, Category } from '@/hooks/useCategories';

// フックをモック化
vi.mock('@/hooks/usePartsQuery');
vi.mock('@/hooks/useCategories');

const mockUsePartsQuery = vi.mocked(usePartsQuery);
const mockUseCategories = vi.mocked(useCategories);

describe('Searchコンポーネント', () => {
  const mockSearch = vi.fn();
  const mockReload = vi.fn();
  const mockCategories: Category[] = [
    { id: 1, name: 'Category A' },
    { id: 2, name: 'Category B' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // モックのデフォルトの戻り値を設定
    mockUsePartsQuery.mockReturnValue({
      parts: [] as Part[],
      isLoading: false,
      error: null,
      reload: mockReload,
      search: mockSearch,
    });
    mockUseCategories.mockReturnValue({
      categories: mockCategories,
      error: null,
    });
  });

  it('部品名を入力して検索ボタンをクリックすると、search関数が入力された値で呼び出される', async () => {
    const user = userEvent.setup();
    render(<Search />);

    // フォーム要素を有効化するために、Search.tsx側のdisabledを外す必要があるが、
    // まずはテストが失敗することを確認する。
    // テストが成功するためには、inputとbuttonのdisabled属性を削除する必要がある。
    const input = screen.getByPlaceholderText('部品名で検索');
    const searchButton = screen.getByRole('button', { name: '検索' });

    // disabled属性が外れていることを期待するテスト（これは最初は失敗する）
    expect(input).not.toBeDisabled();
    expect(searchButton).not.toBeDisabled();

    // 検索語を入力
    await user.type(input, 'テスト部品');

    // 検索ボタンをクリック
    await user.click(searchButton);

    // search関数が正しい引数で呼び出されたことを確認
    expect(mockSearch).toHaveBeenCalledWith({ name: 'テスト部品' });
    expect(mockSearch).toHaveBeenCalledTimes(1);
  });

  it('カテゴリを選択して検索ボタンをクリックすると、search関数が選択されたIDで呼び出される', async () => {
    const user = userEvent.setup();
    render(<Search />);

    const categorySelect = screen.getByRole('combobox', { name: 'カテゴリ' });
    const searchButton = screen.getByRole('button', { name: '検索' });

    // カテゴリドロップダウンが有効であることを確認
    expect(categorySelect).not.toBeDisabled();

    // カテゴリを選択
    await user.selectOptions(categorySelect, 'Category B');

    // 検索ボタンをクリック
    await user.click(searchButton);

    // search関数が正しい引数で呼び出されたことを確認
    expect(mockSearch).toHaveBeenCalledWith({ categoryId: 2 });
    expect(mockSearch).toHaveBeenCalledTimes(1);
  });
});
