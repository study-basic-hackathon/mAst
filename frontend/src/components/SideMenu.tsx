import React, { useState } from 'react';
import { FaSearch, FaPencilAlt } from 'react-icons/fa';
import { VscSettingsGear } from 'react-icons/vsc';
import { TfiMenu, TfiClose } from 'react-icons/tfi';
import {Sidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';

const MenuItemList = {
    header: [
    ],
    body: [
        { icon: <FaSearch />, label: "検索・一覧"},
        { icon: <FaPencilAlt />, label: "追加・編集"},
    ],
    footer: [
        { icon: <VscSettingsGear/>, label: "設定"}
    ]
}

const BuildMenuItems = (layout: string) => {
    return (
        MenuItemList[layout].map((item, index) => (
            <MenuItem icon={item.icon} key={index}>
                {item.label}
            </MenuItem>
        ))
    );
}

const SideMenu: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <>
            <Sidebar collapsed={sidebarCollapsed}>
                <Menu className="sidebar_header" style={{ borderBottom: '1px solid #ccc', marginTop: 5}}>
                    <MenuItem onClick={toggleSidebar} icon={sidebarCollapsed ? <TfiMenu/> : <TfiClose/>}>mAst</MenuItem>
                    {BuildMenuItems("header")}
                </Menu>
                <Menu className="sidebar_body">
                    {BuildMenuItems("body")}
                </Menu>
            </Sidebar>
            <Sidebar collapsed={sidebarCollapsed} style={{ borderTop: '1px solid #ccc', bottom: '0%', marginTop: 'auto', marginBottom: 10 }}>
                <Menu className="sidebar_footer">
                    {BuildMenuItems("footer")}
                </Menu>
            </Sidebar>
        </>
    );
}
export default SideMenu;