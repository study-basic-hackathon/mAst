import React, { useState } from 'react';
import type { Category } from '@/hooks/useCategories';

export type SearchCriteria = {
    name?: string;
    categoryId?: number;
};

type SearchFormProps = {
    categories: Category[];
    onSearch: (criteria: SearchCriteria) => void;
};

const SearchForm: React.FC<SearchFormProps> = ({ categories, onSearch }) => {
    const [partName, setPartName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

    const handleSearch = () => {
        const criteria: SearchCriteria = {};
        if (partName) {
            criteria.name = partName;
        }
        if (selectedCategoryId) {
            criteria.categoryId = selectedCategoryId;
        }
        onSearch(criteria);
    };

    return (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div>
                <label>部品名</label>
                <input
                    type="text"
                    placeholder="部品名で検索"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    style={{
                        padding: '8px',
                        marginLeft: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
            </div>
            <div>
                <label htmlFor="category-select">カテゴリ</label>
                <select
                    id="category-select"
                    value={selectedCategoryId ?? ''}
                    onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                    style={{
                        padding: '8px',
                        marginLeft: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                >
                    <option value="">すべて</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleSearch}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                検索
            </button>
        </div>
    );
};

export default SearchForm;
