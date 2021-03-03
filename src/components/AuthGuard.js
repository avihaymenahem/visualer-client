import React from 'react';
import { StorageKeys } from '../services/StorageManager';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthGuard = ({ children }) => {
    const [ user ] = useLocalStorage(StorageKeys.USER);

    return user ? (
        <>
            {children}
        </>
    ) : null;
}

export default AuthGuard;