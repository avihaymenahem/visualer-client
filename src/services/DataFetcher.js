import { GetStorageItem, SetStorageItem, StorageKeys } from "./StorageManager";
import axios from 'axios';
import { message } from "antd";

const BASE_API_URL = 'https://localhost:3005/api';
const getFullUrl = path => `${BASE_API_URL}/${path}`;

const redirectToLogin = () => window.location.href ='/login';

const doFetch = (url, method, data, includeAuth, callback, afterRefresh) => {
    const token = GetStorageItem(StorageKeys.USER);
    const headers = {
        'Content-Type' : 'application/json'
    };

    if(includeAuth && token) headers.authorization = `Bearer ${token.accessToken}`;

    axios({
        method,
        url: getFullUrl(url),
        data: JSON.stringify(data),
        responseType: 'json',
        headers,
        withCredentials: true
    })
    .then(response => callback && callback(response.data))
    .catch(e => {
        if(afterRefresh) {
            redirectToLogin();
            return false;
        }

        const responseStatus = e?.response?.status;
        if(!responseStatus) {
            message.destroy();
            message.error('Error fetching data, please refresh or retry');
            return;
        }

        switch(responseStatus) {
            case 401:
                !!includeAuth && axios
                    .post(getFullUrl('user/token'), {
                        data: token
                    })
                    .then(refreshRawResponse => {
                        const refreshRes = refreshRawResponse.data;
                        if(refreshRes) {
                            SetStorageItem(StorageKeys.USER, refreshRes.data);
                            return doFetch(url, method, data, includeAuth, callback, true);
                        } else {
                            console.log('REDIRR');
                            redirectToLogin();
                        }
                    })
                    .catch(e => {
                        console.log('TOKEN ERR', e)
                        
                    });
                break;

            case 500:
                message.error('Error fetching data, please retry');
                break;

            case 404:
                window.location.href = '/404';
                break;

            default:
                if(!!includeAuth) {
                    console.log('RESS', responseStatus)
                    redirectToLogin();
                };
                break;
        }
    })
};

const removeUserTokens = (data, callback) => doFetch('user/revoke', 'post', data, false, callback);
const doLogin = (data, callback) => doFetch('user/login', 'post', data, false, callback);
const getTestList = callback => doFetch('test', 'get', null, true, callback);
const removeTestItem = (data, callback) => doFetch(`test/${data._id}`, 'delete', data, true, callback);
const runTests = callback => doFetch('test/run', 'get', null, true, callback);
const initiateTests = callback => doFetch('test/run?first=true', 'get', null, true, callback);
const resetHistory = callback => doFetch('result', 'delete', null, true, callback);
const getHistoryResults = callback => doFetch('result', 'get', null, true, callback);
const generateSingleBase = (id, callback) => doFetch(`test/${id}/updateBase`, 'get', null, true, callback);
const updateTest = (data, callback) => doFetch(`test/${data._id}`, 'post', data, true, callback);
const createNewTest = (data, callback) => doFetch('test', 'post', data, true, callback);
const getResultById = (id, callback) => doFetch(`result/${id}`, 'get', null, true, callback);
const approveSingleTestResult = (testResultSingleObj, resultId, callback) => doFetch('result/approve', 'post', { item: testResultSingleObj, resultId }, true, callback);
const resetPassword = ({ email, callbackUrl }, callback) => doFetch('user/reset-password', 'post', { email, callbackUrl }, false, callback);
const updatePassword = ({ email, token, password, confirmPassword }, callback) => doFetch('user/update-password', 'post', { email, token, password, confirmPassword }, false, callback);
const registerUser = ({ username, email, password, callbackUrl }, callback) => doFetch('user/signup', 'post', { username, email, password, callbackUrl }, false, callback);
const approveUser = ({ email, token }, callback) => doFetch('user/approve-email', 'post', { email, token }, false, callback);
const createOrUpdateTest = (data, callback) => doFetch((!!data._id ? `test/${data._id}` : 'test'), 'post', data, true, callback);

const getUsersList = (callback) => doFetch('admin/users', 'get', null, true, callback);
const getActionLog = (callback) => doFetch('admin/logs', 'get', null, true, callback);
const getStats = (callback) => doFetch('admin/stats', 'get', null, true, callback);

const getSettings = callback =>
    fetch(getFullUrl('settings'))
        .then(res => res.json())
        .then(callback);

export {
    getStats,
    getActionLog,
    getUsersList,
    approveUser,
    registerUser,
    updatePassword,
    resetPassword,
    approveSingleTestResult,
    removeUserTokens,
    doLogin,
    updateTest,
    createNewTest,
    createOrUpdateTest,
    generateSingleBase,
    getResultById,
    getHistoryResults,
    resetHistory,
    initiateTests,
    runTests,
    removeTestItem,
    getTestList,
    getSettings
}