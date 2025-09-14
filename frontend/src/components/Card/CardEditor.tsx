import React, { useState, ChangeEvent } from 'react';
import { CardBase, CardBaseProps } from './CardBase';
import { FaPlusCircle, FaMinusCircle, FaMinusSquare } from "react-icons/fa";

// --- 子コンポーネントをCardEditorの外で定義 ---

// CustomNumberUpDownのProps
interface CustomNumberUpDownProps {
    value: number;
    initialValue: number; // 初期値を受け取る
    onValueChange: (value: number) => void;
}

// CustomNumberUpDownコンポーネント
const CustomNumberUpDown: React.FC<CustomNumberUpDownProps> = ({ value, initialValue, onValueChange }) => {
    // 現在の値が初期値と異なるかどうかを判定
    const hasChanged = value !== initialValue;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isNaN(Number(newValue))) {
            onValueChange(Number(newValue));
        }
    };

    const handleValueChange = (newValue: number) => {
        onValueChange(newValue < 0 ? 0 : newValue);
    };

    // input要素のスタイル
    const inputStyle: React.CSSProperties = {
        fontSize: '25px',
        fontWeight: 'bold',
        textAlign: 'right',
        width: '40%',
        margin: 'auto 0',
        backgroundColor: 'transparent', // 親要素の背景色を継承
        border: 'none',
        outline: 'none',
    };
    
    // コンポーネント全体のスタイル
    const componentStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        height: '50%',
        width: '160px',
        border: '1px solid',
        borderRadius: '10px',
        borderColor: 'gray',
        marginRight: '5px',
        // 値が変更されていたら背景色を変更
        backgroundColor: hasChanged ? '#fff6b6' : 'transparent',
        transition: 'background-color 0.3s',
    };

    // ボタンのスタイル
    const buttonStyle: React.CSSProperties = {
        width: '25%',
        padding: 0,
        margin: 'auto 5px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
    };

    return (
        <div style={componentStyle}>
            <button onClick={() => handleValueChange(value - 1)} style={buttonStyle}><FaMinusCircle size='60%' /></button>
            <input className='quantityText' value={value} onChange={handleChange} type="text" style={inputStyle} />
            <button onClick={() => handleValueChange(value + 1)} style={buttonStyle}><FaPlusCircle size='60%' /></button>
        </div>
    );
};

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
        <button style={{ height: '100%', padding: 0, background:'none', border:'none', cursor:'pointer' }} onClick={handleDeleteClick}>
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
