import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useBlocker } from 'react-router-dom';
import Edit from '@/pages/Edit';
import React from 'react';

// 依存フックをモック化
const mockOpenUnsavedChangesModal = vi.fn();
vi.mock('@/hooks/parts/usePartsManager', () => ({
  usePartsManager: () => ({
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
  }),
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
});
