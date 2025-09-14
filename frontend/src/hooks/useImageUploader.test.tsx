import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { useImageUploader } from './useImageUploader';
import React from 'react';

// フックをテストするためのヘルパーコンポーネント
const TestHarness = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const { UploaderInputComponent, triggerFileDialog } = useImageUploader(onFileSelect);
  return (
    <div>
      <UploaderInputComponent />
      <button data-testid="trigger" onClick={triggerFileDialog}>Trigger</button>
    </div>
  );
};

describe('useImageUploader フック', () => {
  it('triggerFileDialogがinputのclickイベントを発火させるべき', () => {
    const mockOnFileSelect = vi.fn();
    render(<TestHarness onFileSelect={mockOnFileSelect} />);
    
    // DOMからinput要素を取得
    const inputElement = document.querySelector('input[type="file"]');
    expect(inputElement).not.toBeNull();

    // clickメソッドをスパイ
    const clickSpy = vi.spyOn(inputElement as HTMLElement, 'click');
    
    // トリガーボタンをクリック
    const triggerButton = screen.getByTestId('trigger');
    fireEvent.click(triggerButton);
    
    // clickが呼ばれたことを確認
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('ファイル選択時にonFileSelectコールバックが呼び出されるべき', () => {
    const mockOnFileSelect = vi.fn();
    render(<TestHarness onFileSelect={mockOnFileSelect} />);
    
    const inputElement = document.querySelector('input[type="file"]');
    expect(inputElement).not.toBeNull();

    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });

    // ファイル選択イベントを発火
    fireEvent.change(inputElement!, { target: { files: [mockFile] } });

    // コールバックが正しい引数で呼ばれたことを確認
    expect(mockOnFileSelect).toHaveBeenCalledTimes(1);
    expect(mockOnFileSelect).toHaveBeenCalledWith(mockFile);
  });
});
