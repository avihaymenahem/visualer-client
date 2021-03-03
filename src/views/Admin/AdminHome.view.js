import { Button, Col, Divider, List, Row, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActionLog, getStats } from '../../services/DataFetcher';

const AdminHomeView = props => {
    const [ actionLog, setActionLog ] = useState([]);
    const [ stats, setStats ] = useState({
        totalUsers: 0,
        totalTests: 0
    });

    useEffect(() => {
        getActionLog(d => setActionLog(d.data));
        getStats(d => setStats(d.data));
    }, []);

    return (
        <>
            <Divider>Statistics</Divider>
            <Row gutter={[16,16]}>
                <Col span={6}>
                    <Statistic title='Total Users' value={stats.totalUsers}/>
                </Col>
                <Col span={6}>
                    <Statistic title='Total Tests' value={stats.totalTests}/>
                </Col>
                <Col span={6}>
                    <Statistic title='Total Results' value={stats.totalResults}/>
                </Col>
            </Row>

            <Divider>Logs</Divider>
            <Row gutter={[16,16]}>
                <Col span={24}>
                    <List bordered header='Logs'>
                        {actionLog.map(a => (
                            <List.Item key={a._id} actions={[a.createdAt]}>
                                <Button type='link' size='small'>{a.userId}</Button> {a.text}
                            </List.Item>    
                        ))}
                    </List>
                </Col>

            </Row>

            <Divider>Actions</Divider>
            <Row gutter={[16,16]}>
                <Col span={8}>
                    <List bordered header='Users'>
                        <List.Item>
                            <Link to='/admin/users'>
                                Manage Users
                            </Link>
                        </List.Item>
                        <List.Item> Invoke All Tokens </List.Item>
                    </List>
                </Col>

                <Col span={8}>
                    <List bordered header='Tests'>
                        <List.Item> Remove All Tests </List.Item>
                        <List.Item> Run All Tests </List.Item>
                    </List>
                </Col>

                <Col span={8}>
                    <List bordered header='History'>
                        <List.Item> Clear All History </List.Item>
                    </List>
                </Col>
            </Row>
        </>
    );
};

export default AdminHomeView;