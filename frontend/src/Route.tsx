import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Edit from './pages/Edit';
import App from './App'; // Appをレイアウトとしてインポート

const routeConfig = {
    home:     { path: '/',        element: <Home />                 },
    search:   { path: '/Search',  element: <Search />               },
    edit:     { path: '/Edit',    element: <Edit />                 },
    settings: { path: '/Settings', element: <div>Settings Page</div> },
};

export const GetLink = (key: keyof typeof routeConfig) => {
    return routeConfig[key]?.path;
};

// createBrowserRouter用のルート定義を作成
const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />, // Appをルート要素とし、子ルートをOutletでレンダリング
        children: Object.values(routeConfig).map(route => ({
            index: route.path === '/',
            path: route.path === '/' ? undefined : route.path,
            element: route.element,
        })),
    },
];

export const router = createBrowserRouter(routes);
