import React, { ChangeEvent } from 'react';
import { CardBase } from './CardBase';
import { FaCheckCircle } from "react-icons/fa";
import { TfiClose } from 'react-icons/tfi';
import CustomNumberUpDown from '@/components/common/CustomNumberUpDown';
import { Category } from '@/hooks/useCategories';

// --- Props Interfaces ---

interface CardCreatorProps {
    title: string;
    onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    categoryId: number | '';
    onCategoryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    quantity: number;
    onQuantityChange: (value: number) => void;
    previewUrl: string | null;
    isSaveDisabled: boolean;
    onSave: () => void;
    onCancel: () => void;
    triggerFileDialog: () => void;
    getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
    categories: Category[];
}

interface TitleInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface CategorySelectProps {
    value: number | '';
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    categories: Category[];
}

interface ActionButtonsProps {
    onSave: () => void;
    onCancel: () => void;
    isSaveDisabled: boolean;
}




// --- UI Components ---

const TitleInput: React.FC<TitleInputProps> = ({ value, onChange }) => (
    <input type="text" value={value} onChange={onChange} placeholder="部品名" style={{ width: '100%', fontSize: '23px', fontWeight: 'bold', border: 'none', outline: 'none' }} />
);

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, categories }) => {
    return (
        <select value={value} onChange={onChange} style={{ width: '100%', fontSize: '16px', border: 'none', outline: 'none' }}>
            <option value="">カテゴリーを選択</option>
            {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
        </select>
    );
};

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onCancel, isSaveDisabled }) => (
    <div style={{ marginLeft: '10px', display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
        <button
            data-testid="save-button"
            onClick={onSave}
            disabled={isSaveDisabled}
            style={{
                marginRight: '5px', color: 'white', backgroundColor: isSaveDisabled ? 'grey' : '#4CAF50',
                cursor: isSaveDisabled ? 'not-allowed' : 'pointer', border: 'none', padding: '8px 12px',
                borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '36px', transition: 'all 0.2s ease-in-out',
            }}
        >
            <FaCheckCircle size={20} />
        </button>
        <button
            data-testid="cancel-button"
            onClick={onCancel}
            style={{
                border: 'none', padding: '8px 12px', borderRadius: '5px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', minHeight: '36px',
                transition: 'all 0.2s ease-in-out',
            }}
        >
            <TfiClose size={20} />
        </button>
    </div>
);


// --- Main Component ---

const CardCreator: React.FC<CardCreatorProps> = ({
    title, onTitleChange,
    categoryId, onCategoryChange,
    quantity, onQuantityChange,
    previewUrl,
    isSaveDisabled,
    onSave,
    onCancel,
    triggerFileDialog,
    getInputProps,
    categories,
}) => {
    return (
        <CardBase
            title={<TitleInput value={title} onChange={onTitleChange} />}
            category={<CategorySelect value={categoryId} onChange={onCategoryChange} categories={categories} />}
            imageUrl={previewUrl ?? undefined}
            onImageClick={triggerFileDialog}
        >
            <input {...getInputProps()} data-testid="file-input" />
            <div style={{ height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '5px', flexWrap: 'nowrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <CustomNumberUpDown value={quantity} onValueChange={onQuantityChange} />
                    <p style={{ width: 'auto', fontSize: '25px', fontWeight: 'bold', margin: '0 5px 0 0' }}>個</p>
                </div>
                <ActionButtons onSave={onSave} onCancel={onCancel} isSaveDisabled={isSaveDisabled} />
            </div>
        </CardBase>
    );
};

export default CardCreator;
