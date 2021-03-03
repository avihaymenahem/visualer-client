import { Input, Form, Button, Alert, message, Space } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { doLogin } from '../services/DataFetcher';
import { SetStorageItem, StorageKeys } from '../services/StorageManager';
import actionTypes from '../store/actionTypes';
import { store } from '../store/AppContext';

const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 6 },
};

const tailLayout = {
    wrapperCol: { offset: 10, span: 6 },
};

const LoginView = props => {
    const history = useHistory();
    const { dispatch } = useContext(store);
    const [ loginError, setLoginError ] = useState('');

    useEffect(() => {
        dispatch({ type: actionTypes.SET_PAGE_TITLE, payload: 'Login' });
    }, [dispatch]);

    const onFinish = (values) => {
        doLogin(values, (res) => {
            if(res.status === 'failed') {
                setLoginError(res.reason);
                return;
            } else {
                setLoginError(null);
                SetStorageItem(StorageKeys.USER, res.data, values.remember);
                message.success('Logged In');
                history.replace('/');
            }
        })
    };

    const onFinishFailed = (errs) => {

    }

    return (
        <Form
            {...layout}
            name='login'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            {loginError && (
                <Form.Item {...tailLayout}>
                    <Alert type='error' message={loginError}/>
                </Form.Item>
            )}

            <Form.Item
                name='username'
                label='Username'
                rules={[{ required: true }]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name='password'
                label='Password'
                rules={[{ required: true }]}
            >
                <Input.Password/>
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Space>
                    <Link to='/signup'>New Here? Signup</Link>
                    <Link to='/reset-password'>Forgot Password?</Link>
                </Space>
            </Form.Item>
                
        </Form>
    )
};

export default LoginView;