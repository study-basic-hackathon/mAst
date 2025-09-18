import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchForm from './SearchForm';
import type { Category } from '@/hooks/useCategories';

const mockCategories: Category[] = [
    { id: 1, name: 'Category A' },
    { id: 2, name: 'Category B' },
];

describe('SearchForm', () => {
    it('コンポーネントが正しくレンダリングされる', () => {
        render(<SearchForm categories={mockCategories} onSearch={() => {}} />);

        expect(screen.getByPlaceholderText('部品名で検索')).toBeInTheDocument();
        expect(screen.getByLabelText('カテゴリ')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument();
    });

    it('カテゴリの選択肢が正しく表示される', () => {
        render(<SearchForm categories={mockCategories} onSearch={() => {}} />);

        expect(screen.getByRole('option', { name: 'すべて' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Category A' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Category B' })).toBeInTheDocument();
    });

    it('ユーザーが部品名を入力できる', () => {
        render(<SearchForm categories={mockCategories} onSearch={() => {}} />);
        const input = screen.getByPlaceholderText('部品名で検索') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Test Part' } });
        expect(input.value).toBe('Test Part');
    });

    it('ユーザーがカテゴリを選択できる', () => {
        render(<SearchForm categories={mockCategories} onSearch={() => {}} />);
        const select = screen.getByLabelText('カテゴリ') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: '1' } });
        expect(select.value).toBe('1');
    });

    it('検索ボタンをクリックすると、onSearchコールバックが正しい引数で呼び出される', () => {
        const handleSearch = vi.fn();
        render(<SearchForm categories={mockCategories} onSearch={handleSearch} />);

        const input = screen.getByPlaceholderText('部品名で検索');
        const select = screen.getByLabelText('カテゴリ');
        const button = screen.getByRole('button', { name: '検索' });

        // ユーザー入力をシミュレート
        fireEvent.change(input, { target: { value: 'Test Part' } });
        fireEvent.change(select, { target: { value: '2' } });

        // 検索ボタンをクリック
        fireEvent.click(button);

        // onSearchが正しい引数で呼び出されたか検証
        expect(handleSearch).toHaveBeenCalledWith({
            name: 'Test Part',
            categoryId: 2,
        });
    });

    it('入力が空の場合、onSearchコールバックが空のオブジェクトで呼び出される', () => {
        const handleSearch = vi.fn();
        render(<SearchForm categories={mockCategories} onSearch={handleSearch} />);

        const button = screen.getByRole('button', { name: '検索' });
        fireEvent.click(button);

        expect(handleSearch).toHaveBeenCalledWith({});
    });
});
