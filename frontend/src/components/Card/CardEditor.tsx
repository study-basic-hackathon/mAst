import React from 'react';
import { CardBase, CardBaseProps } from './CardBase';
import { FaMinusSquare } from "react-icons/fa";
import CustomNumberUpDown from '@/components/common/CustomNumberUpDown';

// QuantitySelectorのProps
interface QuantitySelectorProps {
    quantity: number;
    initialQuantity: number; // 初期値を受け取る
    onQuantityChange: (quantity: number) => void;
}

// QuantitySelectorコンポーネント
const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, initialQuantity, onQuantityChange }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <CustomNumberUpDown value={quantity} initialValue={initialQuantity} onValueChange={onQuantityChange} />
            <p style={{ width: 'auto', fontSize: '25px', fontWeight: 'bold' }}>個</p>
        </div>
    );
};

// DeleteButtonのProps
interface DeleteButtonProps {
    handleDeleteClick: () => void;
}

// DeleteButtonコンポーネント
const DeleteButton: React.FC<DeleteButtonProps> = ({ handleDeleteClick }) => {
    return (
        <button data-testid="delete-button" style={{ height: '100%', padding: 0, background:'none', border:'none', cursor:'pointer' }} onClick={handleDeleteClick}>
            <FaMinusSquare size={'60%'} color={'#ff6464'} />
        </button>
    );
};

// ItemEditorのProps
interface ItemEditorProps {
    quantity: number;
    initialQuantity: number; // 初期値を受け取る
    onQuantityChange: (quantity: number) => void;
    handleDeleteClick: () => void;
}

// ItemEditorコンポーネント
const ItemEditor: React.FC<ItemEditorProps> = ({ quantity, initialQuantity, onQuantityChange, handleDeleteClick }) => {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <QuantitySelector quantity={quantity} initialQuantity={initialQuantity} onQuantityChange={onQuantityChange} />
            <div style={{ width: '50px' }}>
                <DeleteButton handleDeleteClick={handleDeleteClick} />
            </div>
        </div>
    );
};


// --- CardEditor ---

interface CardEditorProps extends CardBaseProps {
  quantity: number;
  initialQuantity: number; // 親から初期値を受け取る
  onQuantityChange: (newQuantity: number) => void; // 親に数量の変更を通知する
  handleDeleteClick: () => void;
  onImageClick?: () => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ 
    title = '', 
    category = '', 
    imageUrl = '', 
    quantity, 
    initialQuantity,
    onQuantityChange,
    handleDeleteClick,
    onImageClick
}) => {
    return (
        <CardBase title={title} category={category} imageUrl={imageUrl} onImageClick={onImageClick}>
            <ItemEditor
                quantity={quantity}
                initialQuantity={initialQuantity}
                onQuantityChange={onQuantityChange}
                handleDeleteClick={handleDeleteClick}
            />
        </CardBase>
    );
};

export default CardEditor;
