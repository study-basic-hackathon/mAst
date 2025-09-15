import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConfirmationModal } from './useConfirmationModal';

describe('useConfirmationModal フック', () => {
  it('初期状態ではモーダルは閉じているべき', () => {
    const { result } = renderHook(() => useConfirmationModal<string>());
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.itemToProcess).toBe(null);
  });

  it('openModalを呼び出すとモーダルが開き、アイテムとアクションがセットされるべき', () => {
    const { result } = renderHook(() => useConfirmationModal<string>());
    const mockAction = vi.fn();

    act(() => {
      result.current.openModal('テストアイテム', mockAction);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.itemToProcess).toBe('テストアイテム');
  });

  it('closeModalを呼び出すとモーダルが閉じ、アイテムとアクションがリセットされるべき', () => {
    const { result } = renderHook(() => useConfirmationModal<string>());
    const mockAction = vi.fn();

    act(() => {
      result.current.openModal('テストアイテム', mockAction);
    });
    
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.itemToProcess).toBe(null);
  });

  it('confirmを呼び出すとアクションが実行され、モーダルが閉じるべき', () => {
    const { result } = renderHook(() => useConfirmationModal<string>());
    const mockAction = vi.fn();
    
    act(() => {
      result.current.openModal('テストアイテム', mockAction);
    });
    
    act(() => {
      result.current.confirm();
    });

    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.itemToProcess).toBe(null);
  });

  it('アクションがセットされていない状態でconfirmを呼び出してもアクションは実行されないべき', () => {
    const { result } = renderHook(() => useConfirmationModal<string>());
    const mockAction = vi.fn();
    
    act(() => {
      result.current.confirm();
    });

    expect(mockAction).not.toHaveBeenCalled();
  });
});
