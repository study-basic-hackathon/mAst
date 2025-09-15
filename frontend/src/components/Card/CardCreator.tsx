import React, { useState, useRef, ChangeEvent } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { CardBase } from './CardBase';
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

interface CardCreatorProps {
  onSave: (newPart: { title: string; categoryId: number; quantity: number; image?: File }) => void;
  onCancel: () => void;
}

// --- 個数変更コンポーネント ---
interface CustomNumberUpDownProps {
    value: number;
    onValueChange: (value: number) => void;
}

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

    const inputStyle: React.CSSProperties = {
        fontSize: '25px', fontWeight: 'bold', textAlign: 'right', width: '40%', margin: 'auto 0',
        backgroundColor: 'transparent', border: 'none', outline: 'none',
    };
    const componentStyle: React.CSSProperties = {
        display: 'flex', flexDirection: 'row', height: '50%', width: '160px', border: '1px solid',
        borderRadius: '10px', borderColor: 'gray', marginRight: '5px',
    };
    const buttonStyle: React.CSSProperties = {
        width: '25%', padding: 0, margin: 'auto 5px', background: 'none', border: 'none', cursor: 'pointer',
    };

    return (
        <div style={componentStyle}>
            <button data-testid="minus-button" onClick={() => handleValueChange(value - 1)} style={buttonStyle}><FaMinusCircle size='60%' /></button>
            <input className='quantityText' value={value} onChange={handleChange} type="text" style={inputStyle} />
            <button data-testid="plus-button" onClick={() => handleValueChange(value + 1)} style={buttonStyle}><FaPlusCircle size='60%' /></button>
        </div>
    );
};


const CardCreator: React.FC<CardCreatorProps> = ({ onSave, onCancel }) => {
  const { categories } = useCategories();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (categoryId === '' || title.trim() === '') return;
    onSave({ title, categoryId, quantity, image });
  };

  const isSaveDisabled = categoryId === '' || title.trim() === '';

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const titleInput = <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="部品名" style={{width: '100%', fontSize:'23px', fontWeight:'bold', border:'none', outline:'none'}} />;
  const categorySelect = (
    <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))} style={{width: '100%', fontSize:'16px', border:'none', outline:'none'}}>
      <option value="">カテゴリーを選択</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>
  );

  return (
    <CardBase title={titleInput} category={categorySelect} imageUrl={previewUrl} onImageClick={handleImageClick}>
      <input type="file" data-testid="file-input" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '5px', flexWrap: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <CustomNumberUpDown value={quantity} onValueChange={setQuantity} />
            <p style={{ width: 'auto', fontSize: '25px', fontWeight: 'bold', margin: '0 5px 0 0' }}>個</p>
        </div>
        <div style={{marginLeft: '10px', display: 'flex'}}>
          <button 
            onClick={handleSave} 
            disabled={isSaveDisabled}
            style={{
              marginRight: '5px', 
              color: 'white', 
              backgroundColor: '#4CAF50',
              cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px'
            }}>登録</button>
          <button 
            onClick={onCancel}
            style={{
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px'
            }}
          >キャンセル</button>
        </div>
      </div>
    </CardBase>
  );
};

export default CardCreator;
