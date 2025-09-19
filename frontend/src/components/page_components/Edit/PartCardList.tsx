import React, { useState } from 'react';
import CardEditor from '@/components/Card/CardEditor';
import CardCreator from '@/components/Card/CardCreator';
import { Part } from '@/hooks/parts/usePartsManager';
import { usePartCreator } from '@/hooks/parts/usePartCreator';
import { useCategories } from '@/hooks/useCategories';

interface PartCardListProps {
  parts: Part[];
  initialParts: Part[];
  onQuantityChange: (partId: number, newQuantity: number) => void;
  onDeleteClick: (part: Part) => void;
  onImageClick: (partId: number) => void;
  onSaveNewPart: (newPart: { title: string; categoryId: number; quantity: number; image?: File }) => void;
}

const PartCardList: React.FC<PartCardListProps> = ({ parts, initialParts, onQuantityChange, onDeleteClick, onImageClick, onSaveNewPart }) => {
  const [isCreating, setIsCreating] = useState(false);
  const { categories } = useCategories();

  const handleSaveWrapper = (newPart: { title: string; categoryId: number; quantity: number; image?: File }) => {
    onSaveNewPart(newPart);
    setIsCreating(false);
  };

  const partCreator = usePartCreator({ onSave: handleSaveWrapper });

  return (
    <div className="cardList" style={{ display: 'flex', flexDirection:'column', overflow: 'auto', flexGrow: 1, width: '100%', marginTop: '10px' }}>
      {!isCreating ? (
        <div style={{ textAlign: 'center', margin: '10px' }}>
          <button onClick={() => setIsCreating(true)}>パーツを追加</button>
        </div>
      ) : (
        <CardCreator
          title={partCreator.title}
          onTitleChange={e => partCreator.setTitle(e.target.value)}
          categoryId={partCreator.categoryId}
          onCategoryChange={e => partCreator.setCategoryId(Number(e.target.value))}
          quantity={partCreator.quantity}
          onQuantityChange={partCreator.setQuantity}
          previewUrl={partCreator.previewUrl}
          isSaveDisabled={partCreator.isSaveDisabled}
          onSave={partCreator.handleSave}
          onCancel={() => setIsCreating(false)}
          triggerFileDialog={partCreator.triggerFileDialog}
          getInputProps={partCreator.getInputProps}
          categories={categories}
        />
      )}
      {parts.length === 0 && !isCreating ? (
        <div style={{ textAlign: 'center', margin: '10px' }}>
          <p>表示するパーツがありません。</p>
        </div>
      ) : (
        parts.map((part) => {
          const initialPart = initialParts.find(p => p.id === part.id);
          return (
            <CardEditor
              key={part.id}
              title={part.title}
              category={part.category}
              quantity={part.quantity}
              initialQuantity={initialPart ? initialPart.quantity : 0}
              imageUrl={part.imageUrl}
              onQuantityChange={(newQuantity) => onQuantityChange(part.id, newQuantity)}
              handleDeleteClick={() => onDeleteClick(part)}
              onImageClick={() => onImageClick(part.id)}
            />
          );
        })
      )}
    </div>
  );
};

export default PartCardList;
