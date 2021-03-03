import React, { useContext, useEffect } from 'react';
import { getTestList } from '../services/DataFetcher';
import actionTypes from '../store/actionTypes';
import { store } from '../store/AppContext';

const DataLoader = props => {
    const { dispatch } = useContext(store);

    useEffect(() => {
        getTestList(d => dispatch({ type: actionTypes.SET_TEST_LIST, payload: d.data }));
    }, [dispatch, props.rand]);

    return <></>;
};

export default DataLoader;