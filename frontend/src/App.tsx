import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import SideMenu from './components/SideMenu';
import { RouteComponent } from './Route';

function App() {
  return (
      <div className="App" style={{ display: 'flex', height: '100vh' }}>
        <Router>
            {/* サイドバー */}
            <div className="sidebar" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
              <SideMenu />
            </div>
            {/* メインコンテンツ */}
            <main style={{margin: '10px'}}>
              <RouteComponent/>
            </main>
        </Router>
      </div>
  )
}

export default App
