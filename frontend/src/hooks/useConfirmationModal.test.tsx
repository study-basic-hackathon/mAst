import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConfirmationModal } from './useConfirmationModal';

describe('useConfirmationModal フック', () => {
  it('初期状態ではモーダルは閉じているべき', () => {
    const { result } = renderHook(() => useConfirmationModal<string>());
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.itemToProcess).toBe(null);
  });

  it('openModalを呼び出すとモーダルが開き、アイテムがセットされるべき', () => {
    const { result } = renderHook(() => useConfirmationModal<string>());
    
    act(() => {
      result.current.openModal('テストアイテム');
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.itemToProcess).toBe('テストアイテム');
  });

  it('closeModalを呼び出すとモーダルが閉じ、アイテムがリセットされるべき', () => {
    const { result } = renderHook(() => useConfirmationModal<string>());
    
    act(() => {
      result.current.openModal('テストアイテム');
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
      result.current.openModal('テストアイテム');
    });
    
    act(() => {
      result.current.confirm(mockAction);
    });

    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(mockAction).toHaveBeenCalledWith('テストアイテム');
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.itemToProcess).toBe(null);
  });

  it('アイテムがない状態でconfirmを呼び出してもアクションは実行されないべき', () => {
    const { result } = renderHook(() => useConfirmationModal<string>());
    const mockAction = vi.fn();
    
    act(() => {
      result.current.confirm(mockAction);
    });

    expect(mockAction).not.toHaveBeenCalled();
  });
});
