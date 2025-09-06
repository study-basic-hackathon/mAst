import React, {useState} from "react";

const Home: React.FC = () => {
    const [message, setMessage] = useState('')
    const [dbMessage, setDbMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // FastAPIのAPIからメッセージを取得する関数
    const fetchMessage = async () => {
        setLoading(true)
        setError(null)
        try {
          const response = await fetch('/api')
          if (!response.ok) {
              throw new Error('APIから応答がありませんでした')
          }
          const data = await response.json()
          setMessage(data.message)
        } catch (err: Error | any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
    }

    // FastAPI経由でMySQLからメッセージを取得する関数
    const fetchDbMessage = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/db')
            if (!response.ok) {
                throw new Error('DB接続に失敗しました')
            }
            const data = await response.json()
            setDbMessage(data.db_message)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }

    return (
    <>
        <h1>mAst</h1>
        <p>電子部品の在庫を見える化</p>
        
        <div style={{ marginBottom: '20px' }}>
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
        </div>
    </>
    );
}
export default Home;
