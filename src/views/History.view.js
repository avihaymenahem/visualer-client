import { UndoOutlined } from '@ant-design/icons';
import { Button, Switch, Col, Row, Table, message, Form, DatePicker, Divider, Tag, Space } from 'antd';
import React, { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getHistoryResults, resetHistory } from '../services/DataFetcher';
import actionTypes from '../store/actionTypes';
import { store } from '../store/AppContext';
import { format, parseISO } from 'date-fns';

const columns = [
    {
        title: 'ID',
        dataIndex: '_id',
        render: id => <Link to={`/test/${id}`}>Click me</Link>
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: s => s ? <Tag color='green'>Done</Tag> : <Tag color='volcano'>In Progress</Tag>
    },
    {
        title: 'Finished',
        dataIndex: 'total'
    },
    {
        title: 'Failed',
        dataIndex: 'failed'
    },
    {
        title: 'succeed',
        dataIndex: 'succeed'
    },
    {
        title: 'Percentage',
        dataIndex: 'percentage',
        render: d => `${d}%`,
        sorter: (a, b) => a.percentage - b.percentage
    },
    {
        title: 'Start Date',
        dataIndex: 'createdAt',
        render: date => date && format(parseISO(date), 'dd/MM/yyyy hh:mm:ss')
    },
    {
        title: 'End Date',
        dataIndex: 'updatedAts',
        render: date => date && format(parseISO(date), 'dd/MM/yyyy hh:mm:ss')
    }
]

const HistoryView = props => {
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ allowAutoRefresh, setAllowAutoRefresh ] = useState(false);
    const { dispatch } = useContext(store);
    const history = useHistory();

    useEffect(() => {
        dispatch({ type: actionTypes.SET_PAGE_TITLE, payload: 'History' });
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            allowAutoRefresh && fetchData();
        }, 60000); // 1 minute refresh
        return () => clearInterval(interval);
    }, [allowAutoRefresh]);

    const fetchData = () => {
        setLoading(true);
        getHistoryResults(d => {
            if(d) {
                setLoading(false);
                setData(d.data.map(h => {
                    const { _id, docsCount, totalUnique } = h;

                    h.key = _id;
                    h.status = docsCount === totalUnique;
                    h.total = `${totalUnique}/${docsCount}`;

                    return h;
                }).reverse());
            }
        });
    }

    const onResetHistoryClicked = () => {
        message.loading('Cleaning history', 0);
        resetHistory(() => {
            message.destroy();
            message.success('History Cleaned');
            history.go(0);
        });
    }

    return (
        <Row gutter={[16, 16]}>
        <Col span={12}>
            <Form layout='inline'>
                <Form.Item
                    label='Dates'
                >
                    <DatePicker.RangePicker/>
                </Form.Item>
            </Form>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
            <Space>
                <Form.Item style={{margin: 0}} valuePropName='checked' label='Auto Refresh'>
                    <Switch checked={allowAutoRefresh} onChange={setAllowAutoRefresh}/>
                </Form.Item>
                <Button onClick={fetchData} icon={<UndoOutlined/>}>Refresh Data</Button>
                <Button onClick={onResetHistoryClicked}>Reset History</Button>
            </Space>
        </Col>
        <Divider/>

        <Col span={24}>
            <Table
                loading={loading}
                columns={columns}
                dataSource={data}
            />
        </Col>
    </Row>
    )
};

export default HistoryView;