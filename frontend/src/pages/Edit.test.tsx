/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useBlocker } from 'react-router-dom';
import Edit from '@/pages/Edit';
import React from 'react';
import { usePartsManager } from '@/hooks/parts/usePartsManager';
import { useCategories } from '@/hooks/useCategories';

// 依存フックをモック化
const mockOpenUnsavedChangesModal = vi.fn();
const mockSearch = vi.fn();
vi.mock('@/hooks/parts/usePartsManager', () => ({
  usePartsManager: vi.fn(() => ({
    parts: [],
    initialParts: [],
    isUpdating: false,
    error: null,
    hasChanges: true, // 変更がある状態をシミュレート
    handleQuantityChange: vi.fn(),
    stageImageChange: vi.fn(),
    handleCancel: vi.fn(),
    handleUpdate: vi.fn(),
    handleDelete: vi.fn(),
    handleSaveNewPart: vi.fn(),
    isUpdateSuccessful: false,
    resetUpdateStatus: vi.fn(),
    search: mockSearch,
  })),
}));
vi.mock('@/hooks/useCategories', () => ({
    useCategories: vi.fn(() => ({
        categories: [
            { id: 1, name: 'Category A' },
            { id: 2, name: 'Category B' },
        ],
        error: null,
    })),
}));
vi.mock('@/hooks/ui/useImageUploader', () => ({
  useImageUploader: () => ({
    triggerFileDialog: vi.fn(),
    getInputProps: () => ({}),
  }),
}));
vi.mock('@/hooks/ui/useEditPageModals', () => ({
  useEditPageModals: () => ({
    openDeleteModal: vi.fn(),
    openSuccessModal: vi.fn(),
    openUnsavedChangesModal: mockOpenUnsavedChangesModal,
    ModalsComponent: () => <div />,
  }),
}));

// react-router-dom の useBlocker をモック化
const mockBlocker = {
  proceed: vi.fn(),
  reset: vi.fn(),
  state: 'blocked' as const,
};
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useBlocker: vi.fn(() => mockBlocker),
    };
});


describe('Edit ページ', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('変更がある状態で画面遷移しようとすると、確認モーダルが開かれるべき', () => {
    render(
      <MemoryRouter>
        <Edit />
      </MemoryRouter>
    );

    // useBlockerがhasChanges=trueで呼び出されることを確認
    expect(useBlocker).toHaveBeenCalledWith(true);

    // Editコンポーネントはblocker.stateが'blocked'の時にモーダルを開くので、
    // モックされたblockerの状態を利用して、モーダルが開かれることを確認する
    expect(mockOpenUnsavedChangesModal).toHaveBeenCalled();
  });

  it('検索フォームが表示され、検索を実行できるべき', () => {
    (usePartsManager as any).mockImplementation(() => ({
        parts: [],
        initialParts: [],
        isUpdating: false,
        error: null,
        hasChanges: false,
        handleQuantityChange: vi.fn(),
        stageImageChange: vi.fn(),
        handleCancel: vi.fn(),
        handleUpdate: vi.fn(),
        handleDelete: vi.fn(),
        handleSaveNewPart: vi.fn(),
        isUpdateSuccessful: false,
        resetUpdateStatus: vi.fn(),
        search: mockSearch,
    }));

    render(
      <MemoryRouter>
        <Edit />
      </MemoryRouter>
    );

    // 検索フォームの要素が表示されていることを確認
    expect(screen.getByPlaceholderText('部品名で検索')).toBeInTheDocument();
    expect(screen.getByLabelText('カテゴリ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument();

    // カテゴリが正しく表示されていることを確認
    expect(screen.getByText('Category A')).toBeInTheDocument();
    expect(screen.getByText('Category B')).toBeInTheDocument();

    // 検索を実行
    fireEvent.change(screen.getByPlaceholderText('部品名で検索'), { target: { value: 'Test Part' } });
    fireEvent.change(screen.getByLabelText('カテゴリ'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: '検索' }));

    // search関数が正しい引数で呼び出されたことを確認
    expect(mockSearch).toHaveBeenCalledWith({ name: 'Test Part', categoryId: 1 });
  });
});
