import { Alert, Button, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { approveUser } from '../services/DataFetcher';

const ApproveCallbackView = props => {
    const history = useHistory();
    const location = useLocation();

    const goToLogin = () => history.push('/login')

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const approveToken = params.get('t');
        const userEmail = params.get('e');

        if (!approveToken || !userEmail) {
            history.replace('/login');
        } else {
            approveUser({ email: userEmail, token: approveToken }, () => {});
        }
    }, [location, history]);

    return (
        <Row gutter={16}>
            <Col span={6} offset={10}>
                <Alert type='success' message="Thanks you, you've been approved"/>
                <Button type='link' onClick={goToLogin}>Login</Button>
            </Col>
        </Row>
    );
};

export default ApproveCallbackView;