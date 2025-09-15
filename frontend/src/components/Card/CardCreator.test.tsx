import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CardCreator from './CardCreator';
import * as useCategories from '../../hooks/useCategories';

vi.mock('../../hooks/useCategories');

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
    mockOnSave.mockClear();
    mockOnCancel.mockClear();
    
    // JSDOMに存在しないためモックする
    window.URL.createObjectURL = vi.fn(() => 'mock-url');
    window.URL.revokeObjectURL = vi.fn();
  });

  const renderComponent = () => {
    render(<CardCreator onSave={mockOnSave} onCancel={mockOnCancel} />);
  };

  it('すべてのフォーム要素を描画する', () => {
    renderComponent();
    expect(screen.getByTestId('image-container')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/部品名/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0')).toBeInTheDocument(); // 個数入力
    expect(screen.getByTestId('save-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  it('入力の変更を処理する', () => {
    renderComponent();
    const nameInput = screen.getByPlaceholderText(/部品名/i) as HTMLInputElement;
    const categorySelect = screen.getByRole('combobox') as HTMLSelectElement;
    const quantityInput = screen.getByDisplayValue('0') as HTMLInputElement;
    const plusButton = screen.getByTestId('plus-button');

    fireEvent.change(nameInput, { target: { value: 'New Part' } });
    fireEvent.change(categorySelect, { target: { value: '1' } });
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);

    expect(nameInput.value).toBe('New Part');
    expect(categorySelect.value).toBe('1');
    expect(quantityInput.value).toBe('2');
  });

  it('登録ボタンがクリックされた時、onSaveが正しいデータで呼び出される', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/部品名/i), { target: { value: 'Test Part' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    fireEvent.click(screen.getByTestId('plus-button'));

    fireEvent.click(screen.getByTestId('save-button'));

    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'Test Part',
      categoryId: 2,
      quantity: 1,
      image: undefined,
    });
  });

  it('キャンセルボタンがクリックされた時、onCancelが呼び出される', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('画像エリアクリックでファイル選択ダイアログが開く', () => {
    renderComponent();
    const imageContainer = screen.getByTestId('image-container');
    const fileInput = screen.getByTestId('file-input');
    const clickSpy = vi.spyOn(fileInput, 'click').mockImplementation(() => {});
    
    fireEvent.click(imageContainer);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it('ファイルが選択されたらonSaveで送信される', async () => {
    renderComponent();
    const fileInput = screen.getByTestId('file-input');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    fireEvent.change(screen.getByPlaceholderText(/部品名/i), { target: { value: 'Part with Image' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    
    await waitFor(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    fireEvent.click(screen.getByTestId('save-button'));

    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'Part with Image',
      categoryId: 1,
      quantity: 0,
      image: file,
    });
  });

  it('部品名かカテゴリが空の時、登録ボタンは無効化される', () => {
    renderComponent();
    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/部品名/i), { target: { value: 'Test' } });
    expect(saveButton).toBeDisabled();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    expect(saveButton).not.toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/部品名/i), { target: { value: '' } });
    expect(saveButton).toBeDisabled();
  });
});
