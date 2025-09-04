import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home';

const RouteConf = {
    home:     { path: '/'        , element: <Home />                 },
    search:   { path: '/Search'  , element: <div>Search Page</div>   },
    edit:     { path: '/Edit'    , element: <div>Edit Page</div>     },
    settings: { path: '/Settings', element: <div>Settings Page</div> },
};

export const GetLink = (key: string) => {
    return RouteConf[key as keyof typeof RouteConf]?.path;
}

export const RouteComponent: React.FC = () => {
    return (
        <Routes key={window.location.pathname}>
            {Object.values(RouteConf).map((conf, index) => (
                <Route path={conf.path} element={conf.element} key={index}/>
            ))}
        </Routes>
    );
};
