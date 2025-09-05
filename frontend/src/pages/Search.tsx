import React, {useState} from "react";

const Search: React.FC = () => {
    return (
    <>
        <h1>Search</h1>
        <p>検索ページです</p>
        
        {/* <div style={{ marginBottom: '20px' }}>
            <h2>バックエンド通信テスト (FastAPI)</h2>
            <button onClick={fetchMessage} style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
                FastAPIからメッセージを取得
            </button>
            {loading && <p>読み込み中...</p>}
            {error && <p style={{ color: 'red' }}>エラー: {error}</p>}
            {message && <p>FastAPIからのメッセージ: <strong>{message}</strong></p>}
        </div>

        <div style={{ marginBottom: '20px' }}>
            <h2>データベース通信テスト (MySQL)</h2>
            <button onClick={fetchDbMessage} style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
                MySQLからメッセージを取得
            </button>
            {loading && <p>読み込み中...</p>}
            {error && <p style={{ color: 'red' }}>エラー: {error}</p>}
            {dbMessage && <p>MySQLからのメッセージ: <strong>{dbMessage}</strong></p>}
        </div> */}
    </>
    );
}
export default Search;
