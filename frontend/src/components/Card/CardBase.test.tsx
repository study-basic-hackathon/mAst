import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardBase } from './CardBase';
import React from 'react';

describe('CardBase コンポーネント', () => {
  const defaultProps = {
    title: 'テストタイトル',
    category: 'テストカテゴリ',
    children: <div>子要素のコンテンツ</div>,
  };

  it('タイトルとカテゴリが正しく表示されること', () => {
    render(<CardBase {...defaultProps} />);
    expect(screen.getByText('テストタイトル')).toBeInTheDocument();
    expect(screen.getByText('テストカテゴリ')).toBeInTheDocument();
  });

  it('imageUrlが指定された場合に画像が表示されること', () => {
    render(<CardBase {...defaultProps} imageUrl="test-image.jpg" />);
    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'test-image.jpg');
    expect(screen.queryByTestId('error-image')).not.toBeInTheDocument();
  });

  it('imageUrlが空文字の場合にエラー画像コンポーネントが表示されること', () => {
    render(<CardBase {...defaultProps} imageUrl="" />);
    expect(screen.getByTestId('error-image')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
  
  it('imageUrlが指定されない場合にエラー画像コンポーネントが表示されること', () => {
    render(<CardBase {...defaultProps} />);
    expect(screen.getByTestId('error-image')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('画像コンテナがクリックされたときにonImageClickが呼び出されること', () => {
    const onImageClickMock = vi.fn();
    render(<CardBase {...defaultProps} onImageClick={onImageClickMock} />);
    
    const imageContainer = screen.getByTestId('image-container');
    fireEvent.click(imageContainer);
    
    expect(onImageClickMock).toHaveBeenCalledTimes(1);
  });

  it('子要素のコンテンツが正しく表示されること', () => {
    render(<CardBase {...defaultProps} />);
    expect(screen.getByText('子要素のコンテンツ')).toBeInTheDocument();
  });
});
