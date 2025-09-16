import React from 'react';
import { Outlet } from 'react-router-dom';
import SideMenu from '@/components/SideMenu';

function App() {
  return (
    <div className="App" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* サイドバー */}
      <SideMenu />
      {/* メインコンテンツ */}
      <main style={{ width: '100%', margin: '10px' }}>
        <Outlet /> {/* 子ルートがここにレンダリングされる */}
      </main>
    </div>
  );
}

export default App;
