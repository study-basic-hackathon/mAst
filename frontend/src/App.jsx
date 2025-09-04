import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SideMenu from './components/SideMenu.tsx';
import Home from './pages/Home.tsx';

function App() {
  const pages = [ 
    { path: '/', element: <Home /> },
    { path: '/About', element: <div>about Pages</div> },
  ];

  const BuildRouter = () => {
    return (
      <Router>
        <Routes key={window.location.pathname}>
          {pages.map((page, index) => (
            <Route path={page.path} element={page.element} key={index}/>
          ))}
        </Routes>
      </Router>
    );
  }

  return (
    <div className="App" style={{ display: 'flex', height: '100vh' }}>

      {/* サイドバー */}
      <div className="sidebar" style={{display: 'flex', padding: '10px', flexDirection: 'column', height: '100%'}}>
        <SideMenu />
      </div>
      {/* メインコンテンツ */}
      <main style={{margin: '10px'}}>
        {BuildRouter()}
      </main>
    </div>
  )
}

export default App
