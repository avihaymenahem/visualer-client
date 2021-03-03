import { Button, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { updatePassword } from '../services/DataFetcher';

const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 6 },
};

const tailLayout = {
    wrapperCol: { offset: 10, span: 6 },
};


const ResetCallbackView = props => {
    const history = useHistory();
    const location = useLocation();
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const resetToken = params.get('t');
        const userEmail = params.get('e');

        if (!resetToken || !userEmail) {
            history.replace('/login');
        } else {
            setToken(resetToken);
            setEmail(userEmail);
        }
    }, [location, history]);

    const onFormFinish = values => {
        const newValues = { ...values };
        newValues.token = token;
        newValues.email = email;
        message.loading('Updating Password', 0);
        updatePassword(newValues, (res) => {
            message.destroy();

            if (res.status === 'failed') {
                message.error('Error has occured')
            } else {
                message.success('Updated Password');
                history.push('/login');
            }
        });
    }

    return (
        <Form
            {...layout}
            name='resetPassword'
            onFinish={onFormFinish}
        >
            <Form.Item
                name='password'
                label='Password'
                hasFeedback
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
                <Button type='primary' htmlType='submit'>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ResetCallbackView;