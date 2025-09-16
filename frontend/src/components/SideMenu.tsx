import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPencilAlt } from 'react-icons/fa';
import { VscSettingsGear } from 'react-icons/vsc';
import { TfiMenu, TfiClose } from 'react-icons/tfi';
import {Sidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';
import { GetLink } from '@/Route'

const MenuItemList: any = {
    header: [
    ],
    body: [
        { key: "search"   , icon: <FaSearch />   , label: "検索・一覧" },
        { key: "edit"     , icon: <FaPencilAlt />, label: "追加・編集" },
    ],
    footer: [
        { key: "settings" ,icon: <VscSettingsGear />, label: "設定" },
    ]
}

const BuildMenuItems = (layout: string) => {
    return (
        MenuItemList[layout].map((item : any, index: number) => (
            <MenuItem icon={item.icon} key={index} component={<Link to={GetLink(item.key)} />} >
                {item.label}
            </MenuItem>
        ))
    );
}

const SideMenu: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="sidebar" style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Sidebar collapsed={sidebarCollapsed}>
                <Menu className="header" style={{ borderBottom: '1px solid #ccc', marginTop: 5}}>
                    <MenuItem onClick={toggleSidebar} icon={sidebarCollapsed ? <TfiMenu/> : <TfiClose/>}>mAst</MenuItem>
                    {BuildMenuItems("header")}
                </Menu>
                <Menu className="body">
                    {BuildMenuItems("body")}
                </Menu>
            </Sidebar>
            <Sidebar collapsed={sidebarCollapsed} style={{ borderTop: '1px solid #ccc', bottom: '0%', marginTop: 'auto', marginBottom: 10 }}>
                <Menu className="footer">
                    {BuildMenuItems("footer")}
                </Menu>
            </Sidebar>
        </div>
    );
}
export default SideMenu;
