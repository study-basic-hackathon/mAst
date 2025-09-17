import React from "react";
import CardView from "@/components/Card/CardView";
import { usePartsQuery } from '@/hooks/usePartsQuery';

const Search: React.FC = () => {
    const {
        parts,
        isLoading,
        error,
        reload,
    } = usePartsQuery();

    return (
        <>
            <h1>検索・一覧画面</h1>
            
            {/* 検索フォーム（将来の機能） */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div>
                    <label>部品名</label>
                    <input 
                        type="text" 
                        placeholder="部品名で検索" 
                        style={{ 
                            padding: '8px', 
                            marginLeft: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                        disabled // 将来の機能として無効化
                    />
                </div>
                <div>
                    <label>カテゴリ</label>
                    <select 
                        style={{ 
                            padding: '8px', 
                            marginLeft: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                        disabled // 将来の機能として無効化
                    >
                        <option>すべて</option>
                    </select>
                </div>
                <button 
                    style={{ 
                        padding: '8px 16px',
                        backgroundColor: '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                    disabled // 将来の機能として無効化
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
