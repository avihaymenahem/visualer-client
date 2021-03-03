import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const ErrorView = props => {
    const history = useHistory();

    const backHomeClicked = () => history.push('/');

    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary" onClick={backHomeClicked}>Back Home</Button>
            }
        />
    )
};

export default ErrorView;