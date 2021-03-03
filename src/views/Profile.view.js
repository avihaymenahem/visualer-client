import React, { useContext, useEffect } from 'react';
import actionTypes from '../store/actionTypes';
import { store } from '../store/AppContext';

const ProfileView = props => {
    const { dispatch } = useContext(store);

    useEffect(() => {
        dispatch({ type: actionTypes.SET_PAGE_TITLE, payload: 'Profile' });
    }, [dispatch]);

    return (
        <div>
            Profile Page
        </div>
    )
};

export default ProfileView;