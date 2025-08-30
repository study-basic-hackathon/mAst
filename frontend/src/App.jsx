import { useState } from 'react'
import { FaSearch, FaPencilAlt } from "react-icons/fa";
import { TfiMenu, TfiClose } from "react-icons/tfi";
import { VscSettingsGear } from "react-icons/vsc";
import {Sidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';


function App() {
  const [message, setMessage] = useState('')
  const [dbMessage, setDbMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

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
    } catch (err) {
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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App" style={{ display: 'flex', height: '100vh' }}>

      {/* サイドバー */}
      <div className="sidebar" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        {/* TODO:ホバー時、背景色を変える */}
        <div className='sidebar_header' style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          <div className='sidebar_toggle' onClick={toggleSidebar} style={{width: '100%', padding: '10px', textAlign: 'left', fontSize: '16px', cursor: 'pointer' }}>
            {sidebarCollapsed ? <TfiMenu/> : <><TfiClose/> mAst</> }
          </div>
        </div>
        <div className="sidebar_body" style={{ flex: 1, overflowY: 'auto' }}>
          <Sidebar collapsed={sidebarCollapsed}>
            <Menu>
              <MenuItem><FaSearch /> {sidebarCollapsed ? "" : "検索・一覧"}</MenuItem>
              <MenuItem><FaPencilAlt /> {sidebarCollapsed ? "" : "追加・編集"}</MenuItem>
            </Menu>
          </Sidebar>
        </div>
        {/* TODO:ホバー時、背景色を変える */}
        <div className="sidebar_footer" style={{ padding: '10px', borderTop: '1px solid #ccc', marginTop: 'auto' }}>
          <div style={{width: '100%', padding: '10px', fontSize: '16px', textAlign: 'left', cursor: 'pointer' }}>
            <VscSettingsGear/> {sidebarCollapsed ? "" : "設定"}
          </div>
        </div>
      </div>
      {/* メインコンテンツ */}
      <main>
        <h1>Docker Compose 連携確認アプリ</h1>
        <p>このページはNginxによって提供されています。</p>
        
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
      </main>

    </div>
  )
}

export default App
