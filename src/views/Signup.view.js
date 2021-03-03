import { Form, Input, Button, Space, Alert } from 'antd';
import React, { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/DataFetcher';
import actionTypes from '../store/actionTypes';
import { store } from '../store/AppContext';
import StatusCodes from '../Enums/StatusCodes.enum';

const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 6 },
};

const tailLayout = {
    wrapperCol: { offset: 10, span: 6 },
};

const SignupView = props => {
    const { dispatch } = useContext(store);
    const [formError, setFormError] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

    useEffect(() => {
        dispatch({ type: actionTypes.SET_PAGE_TITLE, payload: 'Sign Up' });
    }, [dispatch]);

    const onFinish = (values) => {
        registerUser({...values, callbackUrl: `${window.location.origin}/approve-callback`}, (res) => {
            switch (res.code) {
                default:
                case StatusCodes.FAILED:
                    setFormSuccess(false);
                    setFormError(res.reason);
                    return;

                case StatusCodes.SUCCEED:
                    setFormError(false);
                    setFormSuccess('Registered successfully, please check your mailbox to approve your email');
                    return;
            }
        });
    };

    const onFinishFailed = (errs) => {

    };

    return (
        <Form
            {...layout}
            name='signUp'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >

            {formError && (
                <Form.Item {...tailLayout}>
                    <Alert type='error' message={formError} />
                </Form.Item>
            )}

            {formSuccess ? (
                <Form.Item {...tailLayout}>
                    <Alert type='success' message={formSuccess} />
                </Form.Item>
            ) : (
                    <>
                        <Form.Item
                            name='username'
                            label='Username'
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name='email'
                            label='Email'
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name='password'
                            label='Password'
                            rules={[{ required: true }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name='confirmPassword'
                            label='Confirm Password'
                            hasFeedback
                            dependencies={['password']}
                            rules={[
                                { required: true },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject('The two passwords that you entered do not match!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Submit
                </Button>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Space>
                                <Link to='/login'>Already registered? Login</Link>
                            </Space>
                        </Form.Item>
                    </>
                )}
        </Form>
    );
};

export default SignupView;