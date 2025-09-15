import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardCreator from './CardCreator';

import { vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import * as useCategories from '../../hooks/useCategories';

vi.mock('../../../hooks/useCategories');

describe('CardCreator', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.spyOn(useCategories, 'useCategories').mockReturnValue({
      categories: [
        { id: 1, name: 'Category A' },
        { id: 2, name: 'Category B' },
      ],
      error: null,
    });
  });

  const renderComponent = () => {
    render(<CardCreator onSave={mockOnSave} onCancel={mockOnCancel} />);
  };

  it('すべてのフォーム要素を描画する', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /画像を選択/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/部品名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/カテゴリー/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/個数/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登録/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /キャンセル/i })).toBeInTheDocument();
  });

  it('入力の変更を処理する', () => {
    renderComponent();
    const nameInput = screen.getByLabelText(/部品名/i) as HTMLInputElement;
    const categorySelect = screen.getByLabelText(/カテゴリー/i) as HTMLSelectElement;
    const quantityInput = screen.getByLabelText(/個数/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'New Part' } });
    fireEvent.change(categorySelect, { target: { value: '1' } }); // Category A's id
    fireEvent.change(quantityInput, { target: { value: '123' } });

    expect(nameInput.value).toBe('New Part');
    expect(categorySelect.value).toBe('1');
    expect(quantityInput.value).toBe('123');
  });

  it('登録ボタンがクリックされた時、onSaveが正しいデータで呼び出される', () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/部品名/i), { target: { value: 'Test Part' } });
    fireEvent.change(screen.getByLabelText(/カテゴリー/i), { target: { value: '2' } }); // Category B's id
    fireEvent.change(screen.getByLabelText(/個数/i), { target: { value: '50' } });

    fireEvent.click(screen.getByRole('button', { name: /登録/i }));

    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'Test Part',
      categoryId: 2,
      quantity: 50,
      image: undefined,
    });
  });

  it('キャンセルボタンがクリックされた時、onCancelが呼び出される', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /キャンセル/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
