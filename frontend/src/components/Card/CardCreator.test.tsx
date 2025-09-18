import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CardCreator from './CardCreator';
import { Category } from '@/hooks/useCategories';

describe('CardCreator', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnTitleChange = vi.fn();
  const mockOnCategoryChange = vi.fn();
  const mockOnQuantityChange = vi.fn();
  const mockTriggerFileDialog = vi.fn();
  const mockGetInputProps = vi.fn(() => ({
    ref: React.createRef<HTMLInputElement>(),
    onChange: vi.fn(),
    style: { display: 'none' },
    accept: 'image/*',
    type: 'file',
  } as const));

  const categories: Category[] = [
    { id: 1, name: 'Category A' },
    { id: 2, name: 'Category B' },
  ];

  const defaultProps = {
    title: '',
    onTitleChange: mockOnTitleChange,
    categoryId: '' as const,
    onCategoryChange: mockOnCategoryChange,
    quantity: 0,
    onQuantityChange: mockOnQuantityChange,
    previewUrl: null,
    isSaveDisabled: true,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
    triggerFileDialog: mockTriggerFileDialog,
    getInputProps: mockGetInputProps,
    categories: categories,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    render(<CardCreator {...defaultProps} {...props} />);
  };

  it('すべてのフォーム要素を描画する', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/部品名/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    expect(screen.getByTestId('save-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  it('入力変更時に対応するコールバック関数を呼び出す', () => {
    renderComponent();
    const titleInput = screen.getByPlaceholderText(/部品名/i);
    fireEvent.change(titleInput, { target: { value: 'New Part' } });
    expect(mockOnTitleChange).toHaveBeenCalledTimes(1);

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: '1' } });
    expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);

    // CustomNumberUpDownのテストは別途行うべきだが、ここではonChangeが呼ばれることを確認
    const plusButton = screen.getByTestId('plus-button');
    fireEvent.click(plusButton);
    expect(mockOnQuantityChange).toHaveBeenCalledWith(1);
  });

  it('保存ボタンが無効な場合、クリックしてもonSaveは呼び出されない', () => {
    renderComponent({ isSaveDisabled: true });
    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeDisabled();
    fireEvent.click(saveButton);
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('保存ボタンが有効な場合、クリックするとonSaveを呼び出す', () => {
    renderComponent({ isSaveDisabled: false });
    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).not.toBeDisabled();
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('キャンセルボタンをクリックするとonCancelを呼び出す', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('画像コンテナをクリックするとtriggerFileDialogを呼び出す', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('image-container'));
    expect(mockTriggerFileDialog).toHaveBeenCalledTimes(1);
  });
});
