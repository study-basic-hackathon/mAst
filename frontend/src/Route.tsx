import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home';
import Search from './pages/Search';
import Edit from './pages/Edit'

const RouteConf = {
    home:     { path: '/'        , element: <Home />                 },
    search:   { path: '/Search'  , element: <Search />               },
    edit:     { path: '/Edit'    , element: <Edit />                 },
    settings: { path: '/Settings', element: <div>Settings Page</div> },
};

export const GetLink = (key: keyof typeof RouteConf) => {
    return RouteConf[key]?.path;
}

export const RouteComponent: React.FC = () => {
    return (
        <div style={{height:"100%", width:"100%"}}>
            <Routes key={window.location.pathname}>
                {Object.values(RouteConf).map((conf, index) => (
                    <Route path={conf.path} element={conf.element} key={index}/>
                ))}
            </Routes>
        </div>
    );
};
