import React, { useState, useEffect, useContext } from 'react';
import { Button, Col, Drawer, Empty, Input, Radio, Row } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import TestListCard from '../components/TestListCard';
import { store } from '../store/AppContext';
import ActionTypes from '../store/actionTypes';
import NewTestView from './NewTest.view';
import TestTypeEnum from '../Enums/TestType.enum';
import AuthGuard from '../components/AuthGuard';

const filterOptions = [
    { label: 'Element', value: TestTypeEnum.ELEMENT },
    { label: 'Page', value: TestTypeEnum.PAGE },
    { label: 'All', value: TestTypeEnum.ALL },
];

const TestListView = props => {
    const { state, dispatch } = useContext(store);
    const [ search, setSearch ] = useState('');
    const [ drawerVisible, setDrawerVisible ] = useState(false);
    const [ type, setType ] = useState(TestTypeEnum.ALL);

    const [ editItem, setEditItem ] = useState({});

    const toggleDrawer = e => setDrawerVisible(!drawerVisible);
    const typeOnChange = e => setType(e.target.value);
    const searchOnChange = e => setSearch(e.target.value.toLowerCase());

    useEffect(() => {
        dispatch({ type: ActionTypes.SET_PAGE_TITLE, payload: 'Test List' });
    }, [dispatch]);

    const onItemEditClicked = (item) => {
        setEditItem(item);
        toggleDrawer();
    }

    const onDrawerCloseClicked = () => {
        setEditItem(null);
        toggleDrawer();
    }

    const getFilteredItems = () =>
        state.testList
            .filter(it => !it.isDeleted === true)
            // Type filter (all/element/page)
            .filter(it => type === TestTypeEnum.ALL || it.type === type)
            // Free Search filter (title/description)
            .filter(it => it.title.toLowerCase().includes(search));

    return (
        <AuthGuard>
            <div style={{ height: '100%', overflow: 'hidden' }}>
            <Drawer
                title='New Test'
                width={600}
                visible={drawerVisible}
                onClose={onDrawerCloseClicked}
            >
                <NewTestView onClose={onDrawerCloseClicked} item={editItem}/>
            </Drawer>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                    <Radio.Group
                        optionType='button'
                        options={filterOptions}
                        onChange={typeOnChange}
                        value={type}
                    />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Input.Search value={search} onChange={searchOnChange} placeholder='Search...'/>
                </Col>
                <Col xs={24} md={8} lg={8} xl={10} style={{ textAlign: 'right' }}>
                    <Button
                        icon={<PlusCircleOutlined/>}
                        type='primary'
                        onClick={toggleDrawer}
                    >
                        Add New Test
                    </Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ height: 'calc(100% - 48px)', overflowY: 'scroll', marginTop: 16}}>
                {!getFilteredItems().length ? (
                    <Col span={24} style={{ marginTop: 96 }}>
                        <Empty/>
                    </Col>
                ) : getFilteredItems().map(i => (
                    <Col sm={24} md={12} lg={8} xl={6} key={i._id}>
                        <TestListCard onItemEdit={onItemEditClicked} item={i} />
                    </Col>
                ))}
            </Row>
        </div>
        </AuthGuard>
    )
};

export default TestListView;