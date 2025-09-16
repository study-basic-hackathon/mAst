import React, { useState, useEffect } from "react";
import CardView from "../components/Card/CardView";

// APIレスポンスの型定義
interface Part {
    name: string;
    category: string;
    imageUrl: string | null;
    quantity: number;
}

// エラーレスポンスの型定義
interface ErrorResponse {
    message: string;
}

// APIレスポンスの型（成功時は配列、エラー時はオブジェクト）
type ApiResponse = Part[] | ErrorResponse;

const Search: React.FC = () => {
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // APIからデータを取得する関数
    const fetchParts = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('http://localhost:8000/parts');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: ApiResponse = await response.json();
            
            // エラーレスポンス（messageプロパティがある）かどうかをチェック
            if ('message' in data) {
                setError(data.message);
                setParts([]);
            } else {
                // 成功レスポンス（配列）の場合
                setParts(data);
                setError('');
            }
            
        } catch (err) {
            console.error('部品データの取得に失敗しました:', err);
            setError('部品データの取得に失敗しました');
            setParts([]);
        } finally {
            setLoading(false);
        }
    };

    // コンポーネントマウント時にデータを取得
    useEffect(() => {
        fetchParts();
    }, []);

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
            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>読み込み中...</p>
                </div>
            )}

            {/* エラー表示 */}
            {error && !loading && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#ef4444',
                    fontSize: '18px'
                }}>
                    <p>{error}</p>
                    <button 
                        onClick={fetchParts}
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
            {!loading && !error && parts.length > 0 && (
                <div>
                    <h2>部品一覧 ({parts.length}件)</h2>
                    <div style={{ marginTop: '20px' }}>
                        {parts.map((part, index) => (
                            <CardView
                                key={index}
                                title={part.name}
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
