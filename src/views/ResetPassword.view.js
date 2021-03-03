import { Alert, Button, Col, Form, Input, message, Row } from 'antd';
import React, { useContext, useEffect } from 'react';
import actionTypes from '../store/actionTypes';
import { store } from '../store/AppContext';
import { resetPassword } from '../services/DataFetcher';
import { useState } from 'react/cjs/react.development';

const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 6 },
};
const tailLayout = {
    wrapperCol: { offset: 10, span: 6 },
};

const ResetPasswordView = props => {
    const [ success, setSuccess ] = useState(false);
    const { dispatch } = useContext(store);

    useEffect(() => {
        dispatch({ type: actionTypes.SET_PAGE_TITLE, payload: 'Reset password' });
    }, [dispatch]);

    const onFormFinish = (values) => {
        message.loading('Reseting Password', 0);
        resetPassword({ email: values.email, callbackUrl: `${window.location.origin}/reset-callback` }, (res) => {
            message.destroy();
            setSuccess(true);
            // console.log("RES", res);
        });
    }

    return success ? (
        <div>
            <Row gutter={[16,16]}>
                <Col span={24}>
                    <Alert type='success' message='Please check your email and follow the instructions' />
                </Col>
            </Row>
        </div>
    ) : (
        <Form
            {...layout}
            name='resetPassword'
            onFinish={onFormFinish}
        >
            <Form.Item
                name='email'
                label='Email'
                rules={[{ required: true }]}
            >
                <Input/>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type='primary' htmlType='submit'>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ResetPasswordView;