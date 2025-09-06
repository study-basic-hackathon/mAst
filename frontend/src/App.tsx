import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import SideMenu from './components/SideMenu';
import { RouteComponent } from './Route';

function App() {
  return (
      <div className="App" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
        <Router>
            {/* サイドバー */}
              <SideMenu />
            {/* メインコンテンツ */}
            <main style={{ width:'100%', margin: '10px'}}>
              <RouteComponent/>
            </main>
        </Router>
      </div>
  )
}

export default App
