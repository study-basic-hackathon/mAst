import React, { useState } from 'react';
import { FaSearch, FaPencilAlt } from 'react-icons/fa';
import { VscSettingsGear } from 'react-icons/vsc';
import { TfiMenu, TfiClose } from 'react-icons/tfi';
import {Sidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';

const SideMenu: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <>
            <Sidebar collapsed={sidebarCollapsed} >
                <Menu className='sidebar_header' style={{ borderBottom: '1px solid #ccc' }}>
                    <MenuItem onClick={toggleSidebar}>{sidebarCollapsed ? <TfiMenu/> : <><TfiClose/> mAst</> }</MenuItem>
                </Menu>
                <Menu className="sidebar_body">
                    <MenuItem><FaSearch /> {sidebarCollapsed ? "" : "検索・一覧"}</MenuItem>
                    <MenuItem><FaPencilAlt /> {sidebarCollapsed ? "" : "追加・編集"}</MenuItem>
                </Menu>
            </Sidebar>
            <Sidebar collapsed={sidebarCollapsed} style={{ borderTop: '1px solid #ccc', marginTop: 'auto' }} >
                <Menu className="sidebar_footer" >
                    <MenuItem><VscSettingsGear/> {sidebarCollapsed ? "" : "設定"}</MenuItem>
                </Menu>
            </Sidebar>
        </>
    );
}
export default SideMenu;