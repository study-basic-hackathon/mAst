import React, { useState, ChangeEvent } from 'react';
import { CardBase, CardBaseProps } from './CardBase';
import { FaPlusCircle, FaMinusCircle, FaMinusSquare } from "react-icons/fa";
import { ActionFunction } from 'react-router-dom';

// --- 子コンポーネントをCardEditorの外で定義 ---

// CustomNumberUpDownのProps
interface CustomNumberUpDownProps {
    value: number;
    onValueChange: (value: number) => void;
}

// CustomNumberUpDownコンポーネント
const CustomNumberUpDown: React.FC<CustomNumberUpDownProps> = ({ value, onValueChange }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isNaN(Number(newValue))) {
            onValueChange(Number(newValue));
        }
    };

    const handleValueChange = (newValue: number) => {
        onValueChange(newValue < 0 ? 0 : newValue);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '50%', width: '160px', border: '1px solid', borderRadius: '10px', borderColor: 'gray', marginRight: '5px' }}>
            <button onClick={() => handleValueChange(value - 1)} style={{ width: '25%', padding: 0, marginRight: '5px' }}><FaMinusCircle size='60%' /></button>
            <input className='quantityText' value={value} onChange={handleChange} type="text" style={{ fontSize: '25px', fontWeight: 'bold', textAlign: 'right', width: '40%', marginTop: '10px', marginBottom: '10px' }} />
            <button onClick={() => handleValueChange(value + 1)} style={{ width: '25%', padding: 0, marginLeft: '5px' }}><FaPlusCircle size='60%' /></button>
        </div>
    );
};

// QuantitySelectorのProps
interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
}

// QuantitySelectorコンポーネント
const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onQuantityChange }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <CustomNumberUpDown value={quantity} onValueChange={onQuantityChange} />
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
        <button style={{ height: '100%', padding: 0 }} onClick={handleDeleteClick}>
            <FaMinusSquare size={'60%'} color={'#ff6464'} />
        </button>
    );
};

// ItemEditorのProps
interface ItemEditorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    handleDeleteClick: () => void;
}

// ItemEditorコンポーネント
const ItemEditor: React.FC<ItemEditorProps> = ({ quantity, onQuantityChange, handleDeleteClick }) => {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <div style={{ alignContent: 'right' }}>
                <QuantitySelector quantity={quantity} onQuantityChange={onQuantityChange} />
            </div>
            <div style={{ width: '50px' }}>
                <DeleteButton handleDeleteClick={handleDeleteClick} />
            </div>
        </div>
    );
};


// --- CardEditor ---

interface CardEditorProps extends CardBaseProps {
  quantity: number;
  handleDeleteClick: () => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ title = '', category = '', imageUrl = '', quantity: init_quantity, handleDeleteClick }) => {
    const [quantity, setQuantity] = useState(init_quantity);

    return (
        <CardBase title={title} category={category} imageUrl={imageUrl}>
            <ItemEditor
                quantity={quantity}
                onQuantityChange={setQuantity}
                handleDeleteClick={handleDeleteClick}
            />
        </CardBase>
    );
};

export default CardEditor;