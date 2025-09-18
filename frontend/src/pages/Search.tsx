import React, { useState } from "react";
import CardView from "@/components/Card/CardView";
import { usePartsQuery } from '@/hooks/usePartsQuery';
import { useCategories } from "@/hooks/useCategories";

const Search: React.FC = () => {
    const {
        parts,
        isLoading,
        error,
        reload,
        search, // search関数を取得
    } = usePartsQuery();
    const { categories } = useCategories();

    const [partName, setPartName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

    const handleSearch = () => {
        const criteria: { name?: string; categoryId?: number } = {};
        if (partName) {
            criteria.name = partName;
        }
        if (selectedCategoryId) {
            criteria.categoryId = selectedCategoryId;
        }
        search?.(criteria);
    };

    return (
        <>
            <h1>検索・一覧画面</h1>
            
            {/* 検索フォーム */}
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

            {/* ローディング表示 */}
            {isLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>読み込み中...</p>
                </div>
            )}

            {/* エラー表示 */}
            {error && !isLoading && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#ef4444',
                    fontSize: '18px'
                }}>
                    <p>{error}</p>
                    <button 
                        onClick={reload}
                        style={{ 
                            padding: '8px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        再試行
                    </button>
                </div>
            )}

            {/* 部品一覧表示 */}
            {!isLoading && !error && parts.length > 0 && (
                <div>
                    <h2>部品一覧 ({parts.length}件)</h2>
                    <div style={{ marginTop: '20px' }}>
                        {parts.map((part, index) => (
                            <CardView
                                key={index}
                                title={part.title}
                                category={part.category}
                                // imageUrl={part.imageUrl}
                                quantity={part.quantity}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
export default Search;
