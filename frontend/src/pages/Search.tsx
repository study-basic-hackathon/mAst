import React from "react";
import CardView from "@/components/Card/CardView";
import { usePartsQuery } from '@/hooks/usePartsQuery';
import { useCategories } from "@/hooks/useCategories";
import SearchForm from "@/components/common/SearchForm";

const Search: React.FC = () => {
    const {
        parts,
        isLoading,
        error,
        reload,
        search,
    } = usePartsQuery();
    const { categories } = useCategories();

    return (
        <>
            <h1>検索・一覧画面</h1>
            
            <SearchForm categories={categories} onSearch={search} />

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
