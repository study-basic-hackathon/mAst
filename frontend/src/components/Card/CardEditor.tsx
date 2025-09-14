import React, { useState, ChangeEvent } from 'react';
import { CardBase, CardBaseProps } from './CardBase';
import { FaPlusCircle, FaMinusCircle, FaMinusSquare } from "react-icons/fa";
import { ActionFunction } from 'react-router-dom';

interface CardEditorProps extends CardBaseProps {
  quantity: number;
  handleDeleteClick: ActionFunction;
};

interface CustomNumberUpDownProps {
    value: number; // 内部でstateを持たず、親から受け取る
    onValueChange: (value: number) => void; // 値を親に通知するための関数
};

// CustomNumberUpDownはstateを持たず、props経由で値の表示と更新を行う
const CustomNumberUpDown: React.FC<CustomNumberUpDownProps> = ({ value, onValueChange }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isNaN(Number(newValue))) {
            onValueChange(Number(newValue));
        }
    };

    const handleValueChange = (newValue: number) => {
        if (newValue < 0) {
            onValueChange(0);
        } else {
            onValueChange(newValue);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '50%', width: '160px', border: '1px solid', borderRadius: '10px', borderColor: 'gray', marginRight: '5px' }}>
            <button onClick={() => handleValueChange(value - 1)} style={{ width: '25%', padding: 0, marginRight: '5px' }}><FaMinusCircle size='60%' /></button>
            <input className='quantityText' value={value} onChange={handleChange} type="text" style={{ fontSize: '25px', fontWeight: 'bold', textAlign: 'right', width: '40%', marginTop: '10px', marginBottom: '10px' }} />
            <button onClick={() => handleValueChange(value + 1)} style={{ width: '25%', padding: 0, marginLeft: '5px' }}><FaPlusCircle size='60%' /></button>
        </div>
    );
};

const CardEditor: React.FC<CardEditorProps> = ({ title = '', category = '', imageUrl = '', quantity: init_quantity, handleDeleteClick }) => {
    // CardEditorで数量(quantity)の状態を管理する
    const [quantity, setQuantity] = useState(init_quantity);

    const QuantitySelector = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {/* CustomNumberUpDownに現在の値と、値を更新するための関数を渡す */}
                <CustomNumberUpDown value={quantity} onValueChange={setQuantity} />
                <p style={{ width: 'auto', fontSize: '25px', fontWeight: 'bold' }}>個</p>
            </div>
        );
    };

    const DeleteButton = () => {
        return (
            <button style={{ height: '100%', padding: 0 }}>
                <FaMinusSquare size={'60%'} color={'#ff6464'} onClick={() => handleDeleteClick} />
            </button>
        );
    };

    const ItemEditor = () => {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <div style={{ alignContent: 'right' }}>
                    <QuantitySelector />
                </div>
                <div style={{ width: '50px' }}>
                    <DeleteButton />
                </div>
            </div>
        );
    };

    return (
        <CardBase title={title} category={category} imageUrl={imageUrl} >
            <ItemEditor />
        </CardBase>
    );
};

export default CardEditor;