import React, { useState } from 'react';
import { useCategories } from '../../../hooks/useCategories';

interface CardCreatorProps {
  onSave: (newPart: { title: string; categoryId: number; quantity: number; image?: File }) => void;
  onCancel: () => void;
}

const CardCreator: React.FC<CardCreatorProps> = ({ onSave, onCancel }) => {
  const { categories } = useCategories();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState<File | undefined>(undefined);

  const handleSave = () => {
    if (categoryId === '') return;
    onSave({ title, categoryId, quantity, image });
  };

  return (
    <div className="card-editor">
      <button>画像を選択</button>
      <div>
        <label htmlFor="part-name">部品名</label>
        <input id="part-name" type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="part-category">カテゴリー</label>
        <select id="part-category" value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}>
          <option value="">選択してください</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="part-quantity">個数</label>
        <input id="part-quantity" type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10))} />
      </div>
      <button onClick={handleSave}>登録</button>
      <button onClick={onCancel}>キャンセル</button>
    </div>
  );
};

export default CardCreator;
