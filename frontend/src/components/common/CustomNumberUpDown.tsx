import React, { ChangeEvent } from 'react';
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

interface CustomNumberUpDownProps {
    value: number;
    onValueChange: (value: number) => void;
    initialValue?: number;
}

const CustomNumberUpDown: React.FC<CustomNumberUpDownProps> = ({ value, onValueChange, initialValue }) => {
    const hasChanged = initialValue !== undefined && value !== initialValue;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isNaN(Number(newValue))) {
            onValueChange(Number(newValue));
        }
    };

    const handleValueChange = (newValue: number) => {
        onValueChange(newValue < 0 ? 0 : newValue);
    };

    const componentStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        height: '50%',
        width: '160px',
        border: '1px solid',
        borderRadius: '10px',
        borderColor: 'gray',
        marginRight: '5px',
        backgroundColor: hasChanged ? '#fff6b6' : 'transparent',
        transition: 'background-color 0.3s',
    };

    const buttonStyle: React.CSSProperties = {
        width: '25%',
        padding: 0,
        margin: 'auto 5px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
    };

    const inputStyle: React.CSSProperties = {
        fontSize: '25px',
        fontWeight: 'bold',
        textAlign: 'right',
        width: '40%',
        margin: 'auto 0',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
    };

    return (
        <div style={componentStyle}>
            <button data-testid="minus-button" onClick={() => handleValueChange(value - 1)} style={buttonStyle}><FaMinusCircle size='60%' /></button>
            <input className='quantityText' value={value} onChange={handleChange} type="text" style={inputStyle} />
            <button data-testid="plus-button" onClick={() => handleValueChange(value + 1)} style={buttonStyle}><FaPlusCircle size='60%' /></button>
        </div>
    );
};

export default CustomNumberUpDown;
