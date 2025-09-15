import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, render } from '@testing-library/react';
import { useEditPageModals } from './useEditPageModals';
import React from 'react';

// ConfirmationModalとNotificationModalをモック化
vi.mock('../components/Modal/ConfirmationModal', () => ({
  default: ({ isOpen, message }: { isOpen: boolean, message: string }) =>
    isOpen ? <div data-testid="confirmation-modal">{message}</div> : null,
}));

vi.mock('../components/Modal/NotificationModal', () => ({
  default: ({ isOpen, message }: { isOpen: boolean, message: string }) =>
    isOpen ? <div data-testid="notification-modal">{message}</div> : null,
}));

describe('useEditPageModals フック', () => {
  it('openUnsavedChangesModalを呼び出すと、変更破棄確認モーダルが表示されるべき', () => {
    const mockOnConfirm = vi.fn();
    const { result, rerender } = renderHook(() => useEditPageModals({ onConfirmDelete: vi.fn() }));

    // ModalsComponentをレンダリングしないとモーダルは表示されない
    const { container } = render(<result.current.ModalsComponent />);

    // 初期状態ではモーダルは表示されていない
    expect(container.querySelector('[data-testid="confirmation-modal"]')).toBeNull();

    // モーダルを開く
    act(() => {
      result.current.openUnsavedChangesModal(mockOnConfirm);
    });

    // 再レンダリングしてModalsComponentの状態を更新
    rerender({});
    render(<result.current.ModalsComponent />, { container });

    // モーダルが表示され、正しいメッセージが表示されることを確認
    const modal = container.querySelector('[data-testid="confirmation-modal"]');
    expect(modal).not.toBeNull();
    expect(modal?.textContent).toBe('変更中の内容は破棄されます。よろしいですか？');
  });
});
