import React, { useContext } from 'react';
import { Dropdown, Layout, Menu, PageHeader } from 'antd';
import SideMenu from './components/Layout/SideMenu';

import TestListView from './views/TestList.view';
import HistoryView from './views/History.view';
import SettingsView from './views/Settings.view';
import TestResultView from './views/TestResult.view';
import ErrorView from './views/Error.view';
import LoginView from './views/Login.view';
import LogoutView from './views/Logout.view';
import ProfileView from './views/Profile.view';
import ResetPasswordView from './views/ResetPassword.view';
import ResetCallbackView from './views/ResetCallback.view';
import CompareView from './views/Compare.view';
import SignupView from './views/Signup.view';

import 'antd/dist/antd.css';
import './App.css';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import { store } from './store/AppContext';
import DataLoader from './components/DataLoader';
import { LogoutOutlined, ProfileOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import useLocalStorage from './hooks/useLocalStorage';
import { StorageKeys } from './services/StorageManager';
import ApproveCallbackView from './views/ApproveCallback.view';
import AdminHomeView from './views/Admin/AdminHome.view';
import ManageUsersView from './views/Admin/ManageUsers.view';

const { Content } = Layout;

const styles = {
  root: {
    height: '100vh'
  },
  content: {
    height: '100%',
    overflowY: 'auto',
    backgroundColor: '#fff',
    padding: 12,
    margin: 12
  }
}

const unauthRoutes = [
  '/signup',
  '/login',
  '/logout',
  '/reset-password',
  '/reset-callback',
  '/approve-callback'
];

function App() {
  const location = useLocation();
  const { state } = useContext(store);
  const isNonAuthRoute = !unauthRoutes.includes(location.pathname);

  const [ user ] = useLocalStorage(StorageKeys.USER);

  const isLoggedIn = !!user?.user;

  const loggedInUserDropdown = isLoggedIn && (
    <Dropdown.Button
      key='UserButton'
      icon={<UserOutlined />}
      overlay={(
        <Menu>
          <Menu.Item key='profile' icon={<ProfileOutlined />}>
            <Link to='/profile'>Profile</Link>
          </Menu.Item>
          <Menu.Item key='settings' icon={<SettingOutlined />}>
            <Link to='/settings'>Settings</Link>
          </Menu.Item>
          <Menu.Item key='logout' icon={<LogoutOutlined />}>
            <Link to='/logout'>Logout</Link>
          </Menu.Item>
        </Menu>
      )}
    >
      Hello, {user.user}
    </Dropdown.Button>
  );

  return (
    <Layout style={styles.root}>
      {isNonAuthRoute && <DataLoader />}
      {isNonAuthRoute && <SideMenu />}
      <Layout className="site-layout">
        <PageHeader
          className='site-layout-background'
          title={state.pageTitle}
          extra={[
            loggedInUserDropdown
          ]}
        />
        <Layout>
          <Content className="site-layout-background" style={styles.content}>
            <Switch>
              <Route exact path='/' component={TestListView} />
              <Route path='/logout' component={LogoutView} />
              <Route path='/login' component={LoginView} />
              <Route path='/signup' component={SignupView} />
              <Route path='/history' component={HistoryView} />
              <Route path='/settings' component={SettingsView} />
              <Route path='/test/:id' component={TestResultView} />
              <Route path='/compare/:resultId/:testId' component={CompareView} />
              <Route path='/profile' component={ProfileView} />
              <Route path='/reset-password' component={ResetPasswordView} />
              <Route path='/reset-callback' component={ResetCallbackView} />
              <Route path='/approve-callback' component={ApproveCallbackView} />

              {/** Admin Section */}
              <Route exact path='/admin' component={AdminHomeView} />
              <Route path='/admin/users' component={ManageUsersView} />

              <Route component={ErrorView} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
