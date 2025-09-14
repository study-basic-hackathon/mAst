import React from 'react';
import CardEditor from '../../Card/CardEditor';
import { Part } from '../../../hooks/usePartsManager';

interface PartCardListProps {
  parts: Part[];
  initialParts: Part[];
  onQuantityChange: (partId: number, newQuantity: number) => void;
  onDeleteClick: (part: Part) => void;
}

const PartCardList: React.FC<PartCardListProps> = ({ parts, initialParts, onQuantityChange, onDeleteClick }) => {
  return (
    <div className="cardList" style={{ display: 'grid', overflow: 'auto', flexGrow: 1, width: '100%', marginTop: '10px' }}>
      {parts.map((part) => {
        const initialPart = initialParts.find(p => p.id === part.id);
        return (
          <CardEditor
            key={part.id}
            title={part.title}
            category={part.category}
            quantity={part.quantity}
            initialQuantity={initialPart ? initialPart.quantity : 0}
            onQuantityChange={(newQuantity) => onQuantityChange(part.id, newQuantity)}
            handleDeleteClick={() => onDeleteClick(part)}
          />
        );
      })}
    </div>
  );
};

export default PartCardList;
