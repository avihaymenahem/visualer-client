import { Typography } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { removeUserTokens } from '../services/DataFetcher';
import { GetStorageItem, RemoveStorageItem, StorageKeys } from '../services/StorageManager';

const LogoutView = props => {
    const history = useHistory();
    
    useEffect(() => {
        const userData = GetStorageItem(StorageKeys.USER);
        removeUserTokens(userData, () => {
            RemoveStorageItem(StorageKeys.USER);
        });
        setTimeout(() => {
            history.push('/');
        }, 2000);
    }, [history]);

    return (
        <Typography.Title level={5}>See ya later ;)</Typography.Title>
    );
};

export default LogoutView;