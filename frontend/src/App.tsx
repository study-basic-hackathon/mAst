import { BrowserRouter as Router, Route, Routes } from 'react-router'
import SideMenu from './components/SideMenu.tsx';
import { RouteComponent } from './Route.tsx';

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
