import { createContext, useReducer } from 'react';
import initialState from './initialState';
import ActionTypes from './actionTypes';

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children, debug }) => {
    const [ state, dispatch ] = useReducer((state, action) => {
        
        debug && console.log(`[AppContext] Got action: ${action.type} with payload:`, action.payload);

        const newState = { ...state };

        switch (action.type) {

            case ActionTypes.SET_FETCHING:
                newState.isFetching = action.payload;
                break;

            case ActionTypes.SET_TEST_RESULTS:
                newState.testResults = action.payload;
                break;

            case ActionTypes.SET_TEST_LIST:
                newState.testList = action.payload;
                break;

            case ActionTypes.SET_SETTINGS:
                newState.settings = action.payload;
                break;

            case ActionTypes.SET_PAGE_TITLE:
                newState.pageTitle = action.payload;
                break;

            default:
                throw new Error(`${action.type} Does not exist`);
        }

        return newState;

    }, initialState);
    
    return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider };