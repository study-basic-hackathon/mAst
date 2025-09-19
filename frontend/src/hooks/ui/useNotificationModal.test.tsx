import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotificationModal } from './useNotificationModal';

describe('useNotificationModal フック', () => {
  it('初期状態ではモーダルは閉じているべき', () => {
    const { result } = renderHook(() => useNotificationModal());
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.message).toBe('');
  });

  it('openModalを呼び出すとモーダルが開き、メッセージがセットされるべき', () => {
    const { result } = renderHook(() => useNotificationModal());
    
    act(() => {
      result.current.openModal('テストメッセージ');
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.message).toBe('テストメッセージ');
  });

  it('closeModalを呼び出すとモーダルが閉じ、メッセージがリセットされるべき', () => {
    const { result } = renderHook(() => useNotificationModal());
    
    act(() => {
      result.current.openModal('テストメッセージ');
    });
    
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.message).toBe('');
  });
});
