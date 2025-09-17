import React, { ChangeEvent } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { CardBase } from './CardBase';
import { FaCheckCircle } from "react-icons/fa";
import { TfiClose } from 'react-icons/tfi';
import CustomNumberUpDown from '@/components/common/CustomNumberUpDown';
import { usePartForm } from '@/hooks/usePartForm';

// --- Props Interfaces ---

interface CardCreatorProps {
  onSave: (newPart: { title: string; categoryId: number; quantity: number; image?: File }) => void;
  onCancel: () => void;
}

interface CustomNumberUpDownProps {
    value: number;
    onValueChange: (value: number) => void;
}

interface TitleInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface CategorySelectProps {
    value: number | '';
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
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

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
    const { categories } = useCategories();
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

const CardCreator: React.FC<CardCreatorProps> = ({ onSave, onCancel }) => {
    const {
        title, setTitle,
        categoryId, setCategoryId,
        quantity, setQuantity,
        previewUrl,
        isSaveDisabled,
        handleSave,
        triggerFileDialog,
        getInputProps,
    } = usePartForm({ onSave });

    return (
        <CardBase
            title={<TitleInput value={title} onChange={e => setTitle(e.target.value)} />}
            category={<CategorySelect value={categoryId} onChange={e => setCategoryId(Number(e.target.value))} />}
            imageUrl={previewUrl}
            onImageClick={triggerFileDialog}
        >
            <input {...getInputProps()} data-testid="file-input" />
            <div style={{ height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '5px', flexWrap: 'nowrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <CustomNumberUpDown value={quantity} onValueChange={setQuantity} />
                    <p style={{ width: 'auto', fontSize: '25px', fontWeight: 'bold', margin: '0 5px 0 0' }}>個</p>
                </div>
                <ActionButtons onSave={handleSave} onCancel={onCancel} isSaveDisabled={isSaveDisabled} />
            </div>
        </CardBase>
    );
};

export default CardCreator;
