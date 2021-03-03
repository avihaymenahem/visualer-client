import { Button, Space, Table, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUsersList } from '../../services/DataFetcher';
import { DeleteOutlined, EditOutlined, PoweroffOutlined } from '@ant-design/icons';

const columns = [
    {
        title: 'Username',
        dataIndex: 'username'
    },
    {
        title: 'Email',
        dataIndex: 'email'
    },
    {
        title: 'Role',
        dataIndex: 'role'
    },
    {
        title: 'Is Active',
        dataIndex: 'isActive',
        render: u => <Tag>{(!!u).toString()}</Tag>
    },
    {
        title: 'Actions',
        dataIndex: 'actions'
    }
];

const UserActions = ({ user }) => {
    return (
        <Space>
            <Tooltip title='Edit'>
                <Button size='small'>
                    <EditOutlined/>
                </Button>
            </Tooltip>
            <Tooltip title='Deactivate'>
                <Button size='small'>
                    <PoweroffOutlined/>
                </Button>
            </Tooltip>
            <Tooltip title='Delete'>
                <Button size='small'>
                    <DeleteOutlined/>
                </Button>
            </Tooltip>
        </Space>
    )
}

const ManageUsersView = props => {
    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        getUsersList(d => setUsers(d.data));
    }, []);

    const enrichedUsers = () => users.map(u => {
        u.key = u._id;
        u.actions = <UserActions/>
        return u;
    })

    return (
        <div>
            <Table
                columns={columns}
                dataSource={enrichedUsers()}
            />
        </div>
    );
};

export default ManageUsersView;