import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PartCardList from './PartCardList';
import { Part } from '../../../hooks/usePartsManager';

describe('PartCardList', () => {
  const mockParts: Part[] = [
    { id: 1, inventoryId: 101, title: 'Part 1', category: 'Category A', quantity: 10, imageUrl: 'url1' },
    { id: 2, inventoryId: 102, title: 'Part 2', category: 'Category B', quantity: 5, imageUrl: 'url2' },
  ];

  const mockInitialParts: Part[] = [
    { id: 1, inventoryId: 101, title: 'Part 1', category: 'Category A', quantity: 10, imageUrl: 'url1' },
    { id: 2, inventoryId: 102, title: 'Part 2', category: 'Category B', quantity: 5, imageUrl: 'url2' },
  ];

  it('renders a button to add a new part', () => {
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

  it('shows CardCreator when add button is clicked', () => {
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
    
    expect(screen.getByLabelText(/部品名/i)).toBeInTheDocument();
  });
});
