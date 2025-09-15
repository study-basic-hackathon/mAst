import { renderHook, act, render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useEditPageModals } from './useEditPageModals';
import { Part } from '../api/partsApi';
import React from 'react';

vi.mock('../components/Modal/ConfirmationModal', () => ({
  __esModule: true,
  default: ({ isOpen, message, onConfirm }: { isOpen: boolean; message: string; onConfirm: () => void; }) =>
    isOpen
      ? React.createElement('div', { "data-testid": "confirmation-modal" }, [
          React.createElement('p', { key: 'msg' }, message),
          React.createElement('button', { key: 'cfm', onClick: onConfirm }, 'Confirm'),
        ])
      : null,
}));

vi.mock('../components/Modal/NotificationModal', () => ({
  __esModule: true,
  default: ({ isOpen, message }: { isOpen: boolean; message: string; }) =>
    isOpen
      ? React.createElement('div', { "data-testid": "notification-modal" }, [
          React.createElement('p', { key: 'msg' }, message),
        ])
      : null,
}));

describe('useEditPageModals', () => {
  const mockPart: Part = { id: 1, title: 'Test Part', quantity: 1, imageUrl: '', inventoryId: 1, category: 'A' };

  it('初期状態ではモーダルは表示されない', () => {
    const { result } = renderHook(() => useEditPageModals({ onConfirmDelete: vi.fn() }));
    const { ModalsComponent } = result.current;
    const { container } = render(React.createElement(ModalsComponent));
    expect(container.firstChild).toBeNull();
  });

  it('openDeleteModal を呼び出すと削除確認モーダルが表示される', () => {
    const { result } = renderHook(() => useEditPageModals({ onConfirmDelete: vi.fn() }));
    
    act(() => {
      result.current.openDeleteModal(mockPart);
    });

    const { ModalsComponent } = result.current;
    const { getByText, getByTestId } = render(React.createElement(ModalsComponent));
    expect(getByTestId('confirmation-modal')).toBeDefined();
    expect(getByText('「Test Part」を本当に削除しますか？')).toBeDefined();
  });

  it('openSuccessModal を呼び出すと成功モーダルが表示される', () => {
    const { result } = renderHook(() => useEditPageModals({ onConfirmDelete: vi.fn() }));
    
    act(() => {
      result.current.openSuccessModal('更新が完了しました。');
    });

    const { ModalsComponent } = result.current;
    const { getByText, getByTestId } = render(React.createElement(ModalsComponent));
    expect(getByTestId('notification-modal')).toBeDefined();
    expect(getByText('更新が完了しました。')).toBeDefined();
  });

  it('確認ボタンをクリックすると onConfirmDelete が呼び出される', () => {
    const mockOnConfirmDelete = vi.fn();
    const { result } = renderHook(() => useEditPageModals({ onConfirmDelete: mockOnConfirmDelete }));
    
    act(() => {
      result.current.openDeleteModal(mockPart);
    });

    const { ModalsComponent } = result.current;
    const { getByText } = render(React.createElement(ModalsComponent));
    
    fireEvent.click(getByText('Confirm'));

    expect(mockOnConfirmDelete).toHaveBeenCalledWith(mockPart.id);
  });
});
