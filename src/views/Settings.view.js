import { Input, Form, Select, Button, Slider, Switch, Space, Divider } from 'antd';
import React, { useContext, useEffect } from 'react';
import AuthGuard from '../components/AuthGuard';
import actionTypes from '../store/actionTypes';
import { store } from '../store/AppContext';

const tailLayout = {
    wrapperCol: { offset: 4, span: 8 },
    style: {
        textAlign: 'right'
    }
};

const SettingsView = props => {
    const { dispatch } = useContext(store);

    useEffect(() => {
        dispatch({ type: actionTypes.SET_PAGE_TITLE, payload: 'Settings' });
    }, [dispatch]);

    return (
        <AuthGuard>
            <Form
                name='settingsForm'
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
            >
                <Form.Item
                    name='tolerance'
                    label='Tolerance'
                >
                    <Slider max={10} min={0} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{ span: 1 }}
                    name='highlightColor'
                    label='Highlight Color'
                >
                    <Input type='color' />
                </Form.Item>

                <Form.Item
                    name='headless'
                    label='Headless'
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name='devtools'
                    label='Show Devtools'
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name='ignoreAntialiasing'
                    label='Ignore AntiAliasing'
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name='ssDir'
                    label='Screenshot Directory'
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name='resolutions'
                    label='Resolutions'
                >
                    <Select
                        mode='multiple'
                    >
                        <Select.Option>1280*1024</Select.Option>
                        <Select.Option>1600*1200</Select.Option>
                        <Select.Option>1900*1200</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label='Delete'
                >
                    <Button type='danger'>Delete All tests</Button>
                </Form.Item>
                <Divider/>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type='primary'>Save</Button>
                        <Button>Restore Defaults</Button>
                    </Space>
                </Form.Item>
            </Form>
        </AuthGuard>
    )
};

export default SettingsView;