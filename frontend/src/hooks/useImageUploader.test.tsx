import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { useImageUploader } from './useImageUploader';
import React from 'react';

describe('useImageUploader フック', () => {
  it('triggerFileDialogがinputのclickイベントを発火させるべき', () => {
    const mockOnFileSelect = vi.fn();
    const { result } = renderHook(() => useImageUploader(mockOnFileSelect));
    
    // UploaderInputComponentをレンダリングして、refをフックに接続する
    const { container } = render(<result.current.UploaderInputComponent />);
    const inputElement = container.querySelector('input');
    
    const clickSpy = vi.spyOn(inputElement!, 'click');
    
    act(() => {
      result.current.triggerFileDialog();
    });
    
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('ファイル選択時にonFileSelectコールバックが呼び出されるべき', () => {
    const mockOnFileSelect = vi.fn();
    const { result } = renderHook(() => useImageUploader(mockOnFileSelect));
    
    const { container } = render(<result.current.UploaderInputComponent />);
    const inputElement = container.querySelector('input');

    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });

    act(() => {
      fireEvent.change(inputElement!, { target: { files: [mockFile] } });
    });

    expect(mockOnFileSelect).toHaveBeenCalledTimes(1);
    expect(mockOnFileSelect).toHaveBeenCalledWith(mockFile);
  });
});
