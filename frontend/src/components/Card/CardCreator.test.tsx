import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CardCreator from './CardCreator';
import * as usePartForm from '@/hooks/parts/usePartForm';
import * as useCategories from '@/hooks/useCategories';

vi.mock('@/hooks/parts/usePartForm');
vi.mock('@/hooks/useCategories');

describe('CardCreator', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();
  const mockSetTitle = vi.fn();
  const mockSetCategoryId = vi.fn();
  const mockSetQuantity = vi.fn();
  const mockHandleSave = vi.fn();
  const mockTriggerFileDialog = vi.fn();
  const mockGetInputProps = vi.fn(() => ({
    ref: React.createRef<HTMLInputElement>(),
    onChange: vi.fn(),
    style: { display: 'none' },
    accept: 'image/*',
    type: 'file',
  } as const));

  beforeEach(() => {
    vi.spyOn(useCategories, 'useCategories').mockReturnValue({
      categories: [
        { id: 1, name: 'Category A' },
        { id: 2, name: 'Category B' },
      ],
      error: null,
    });

    vi.spyOn(usePartForm, 'usePartForm').mockReturnValue({
      title: '',
      setTitle: mockSetTitle,
      categoryId: '',
      setCategoryId: mockSetCategoryId,
      quantity: 0,
      setQuantity: mockSetQuantity,
      previewUrl: undefined,
      isSaveDisabled: true,
      handleSave: mockHandleSave,
      triggerFileDialog: mockTriggerFileDialog,
      getInputProps: mockGetInputProps,
    });

    mockOnSave.mockClear();
    mockOnCancel.mockClear();
  });

  const renderComponent = () => {
    render(<CardCreator onSave={mockOnSave} onCancel={mockOnCancel} />);
  };

  it('すべてのフォーム要素を描画する', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/部品名/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    expect(screen.getByTestId('save-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  it('入力変更時にフック関数を呼び出す', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/部品名/i), { target: { value: 'New Part' } });
    expect(mockSetTitle).toHaveBeenCalledWith('New Part');

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    expect(mockSetCategoryId).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByTestId('plus-button'));
    expect(mockSetQuantity).toHaveBeenCalled();
  });

  it('無効でないときに保存ボタンをクリックするとhandleSaveを呼び出す', () => {
    // ボタンが有効な状態をモックする
    vi.spyOn(usePartForm, 'usePartForm').mockReturnValue({
      title: 'Test',
      setTitle: mockSetTitle,
      categoryId: 1,
      setCategoryId: mockSetCategoryId,
      quantity: 0,
      setQuantity: mockSetQuantity,
      previewUrl: undefined,
      isSaveDisabled: false, // isSaveDisabledをfalseに設定
      handleSave: mockHandleSave,
      triggerFileDialog: mockTriggerFileDialog,
      getInputProps: mockGetInputProps,
    });

    renderComponent();
    fireEvent.click(screen.getByTestId('save-button'));
    expect(mockHandleSave).toHaveBeenCalledTimes(1);
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
