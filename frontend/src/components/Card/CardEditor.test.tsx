import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CardEditor from './CardEditor';
import React from 'react';

vi.mock('../common/CustomNumberUpDown', () => ({
  default: ({ value, onValueChange }: { value: number, onValueChange: (v: number) => void }) => (
    <div>
      <input type="text" value={value} onChange={(e) => onValueChange(Number(e.target.value))} />
      <button data-testid="plus-button" onClick={() => onValueChange(value + 1)}>+</button>
      <button data-testid="minus-button" onClick={() => onValueChange(value - 1)}>-</button>
    </div>
  ),
}));

describe('CardEditor コンポーネント', () => {
  const defaultProps = {
    title: 'テスト部品',
    category: 'テストカテゴリ',
    quantity: 10,
    initialQuantity: 10,
    onQuantityChange: vi.fn(),
    handleDeleteClick: vi.fn(),
    onImageClick: vi.fn(),
  };

  it('propsで渡された情報が正しく表示されること', () => {
    render(<CardEditor {...defaultProps} />);
    expect(screen.getByText('テスト部品')).toBeInTheDocument();
    expect(screen.getByText('テストカテゴリ')).toBeInTheDocument();
    // input要素はvalue属性で値を持つ
    const quantityInput = screen.getByDisplayValue('10');
    expect(quantityInput).toBeInTheDocument();
  });

  it('「+」ボタンクリックでonQuantityChangeが正しい値で呼び出されること', () => {
    const onQuantityChangeMock = vi.fn();
    render(<CardEditor {...defaultProps} onQuantityChange={onQuantityChangeMock} />);
    
    const plusButton = screen.getByTestId('plus-button');
    fireEvent.click(plusButton);
    
    expect(onQuantityChangeMock).toHaveBeenCalledTimes(1);
    expect(onQuantityChangeMock).toHaveBeenCalledWith(11);
  });

  it('「-」ボタンクリックでonQuantityChangeが正しい値で呼び出されること', () => {
    const onQuantityChangeMock = vi.fn();
    render(<CardEditor {...defaultProps} onQuantityChange={onQuantityChangeMock} />);
    
    const minusButton = screen.getByTestId('minus-button');
    fireEvent.click(minusButton);
    
    expect(onQuantityChangeMock).toHaveBeenCalledTimes(1);
    expect(onQuantityChangeMock).toHaveBeenCalledWith(9);
  });

  it('削除ボタンクリックでhandleDeleteClickが呼び出されること', () => {
    const handleDeleteClickMock = vi.fn();
    render(<CardEditor {...defaultProps} handleDeleteClick={handleDeleteClickMock} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(handleDeleteClickMock).toHaveBeenCalledTimes(1);
  });

  it('画像クリックでonImageClickが呼び出されること', () => {
    const onImageClickMock = vi.fn();
    render(<CardEditor {...defaultProps} onImageClick={onImageClickMock} />);
    
    const imageContainer = screen.getByTestId('image-container');
    fireEvent.click(imageContainer);
    
    expect(onImageClickMock).toHaveBeenCalledTimes(1);
  });
});
