import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PartCardList from './PartCardList';
import { Part } from '@/hooks/parts/usePartsManager';

describe('PartCardList', () => {
  const mockParts: Part[] = [
    { id: 1, inventoryId: 101, title: 'Part 1', category: 'Category A', quantity: 10, imageUrl: 'url1' },
    { id: 2, inventoryId: 102, title: 'Part 2', category: 'Category B', quantity: 5, imageUrl: 'url2' },
  ];

  const mockInitialParts: Part[] = [
    { id: 1, inventoryId: 101, title: 'Part 1', category: 'Category A', quantity: 10, imageUrl: 'url1' },
    { id: 2, inventoryId: 102, title: 'Part 2', category: 'Category B', quantity: 5, imageUrl: 'url2' },
  ];

  it('新しい部品を追加するボタンを描画する', () => {
    render(
      <PartCardList
        parts={mockParts}
        initialParts={mockInitialParts}
        onQuantityChange={vi.fn()}
        onDeleteClick={vi.fn()}
        onImageClick={vi.fn()}
        onSaveNewPart={vi.fn()}
      />
    );

    const addButton = screen.getByRole('button', { name: /パーツを追加/i });
    expect(addButton).toBeInTheDocument();
  });

  it('追加ボタンをクリックするとCardCreatorを表示する', () => {
    render(
      <PartCardList
        parts={mockParts}
        initialParts={mockInitialParts}
        onQuantityChange={vi.fn()}
        onDeleteClick={vi.fn()}
        onImageClick={vi.fn()}
        onSaveNewPart={vi.fn()}
      />
    );

    const addButton = screen.getByRole('button', { name: /パーツを追加/i });
    fireEvent.click(addButton);
    
    expect(screen.getByPlaceholderText(/部品名/i)).toBeInTheDocument();
  });

  it('部品データが空の場合、「表示するパーツがありません。」というメッセージを表示する', () => {
    render(
      <PartCardList
        parts={[]}
        initialParts={[]}
        onQuantityChange={vi.fn()}
        onDeleteClick={vi.fn()}
        onImageClick={vi.fn()}
        onSaveNewPart={vi.fn()}
      />
    );

    expect(screen.getByText('表示するパーツがありません。')).toBeInTheDocument();
  });
});
