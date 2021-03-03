import { Menu, Layout, message } from 'antd';
import { UnorderedListOutlined, HistoryOutlined, PlayCircleOutlined, PicCenterOutlined, LockOutlined } from '@ant-design/icons';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { runTests, initiateTests } from '../../services/DataFetcher';
import useAuth from '../../hooks/useAuth';
import UserRolesEnum from '../../Enums/UserRoles.enum';

const SideMenu = props => {
    const history = useHistory();
    const { role } = useAuth();

    const menuItems = [
        {
            groupName: 'Menu',
            children: [
                {
                    label: 'Home Page',
                    icon: <UnorderedListOutlined />,
                    link: '/'
                },
                {
                    label: 'History',
                    icon: <HistoryOutlined />,
                    link: '/history'
                }
            ]
        },
        {
            groupName: 'Actions',
            children: [
                {
                    label: 'Run Tests',
                    icon: <PlayCircleOutlined />,
                    onClick: () => {
                        message.loading('Running Tests...', 5);
                        runTests();
                    }
                },
                {
                    label: 'Generate Base',
                    icon: <PicCenterOutlined />,
                    onClick: () => {
                        message.loading('Regenarating Base...', 0);
                        initiateTests(e => {
                            message.destroy();
                            message.success({ content: 'New Bases generated', duration: 3 });
                            history.go(0);
                        })
                    }
                }
            ]
        },
    ];

    if(role === UserRolesEnum.ADMIN) {
        menuItems.push({
            groupName: 'Admin',
            children: [
                {
                    label: 'Home',
                    icon: <LockOutlined/>,
                    link: '/admin'
                }
            ]
        })

    }

    const handleMenuItemClick = e => {
        const menuChildrenItems = [];
        menuItems.forEach(mgi => menuChildrenItems.push(...mgi.children));
        const menuItem = menuChildrenItems.find(mi => mi.label === e.key);

        menuItem.onClick && menuItem.onClick();
    }

    return (
        <Layout.Sider className="site-layout-background">
            <div className='logo' />
            <Menu theme='dark' mode='inline' onClick={handleMenuItemClick}>
                {menuItems.map(mgi => (
                    <Menu.ItemGroup key={mgi.groupName} title={mgi.groupName}>
                        {mgi.children.map(mi => (
                            <Menu.Item key={mi.label} icon={mi.icon}>
                                {mi.link ? <Link to={mi.link}>{mi.label}</Link> : mi.label}
                            </Menu.Item>
                        ))}
                    </Menu.ItemGroup>
                ))}
            </Menu>
        </Layout.Sider>
    );
};

export default SideMenu;