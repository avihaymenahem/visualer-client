import { Button, Col, Radio, Row, Table, Tag, Tooltip, Form, message, Popconfirm, Space } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { approveSingleTestResult, getResultById } from '../services/DataFetcher';
import { store } from '../store/AppContext';
import actionTypes from '../store/actionTypes';
import { truncate } from 'lodash';
import { CheckOutlined, CloudDownloadOutlined, DiffOutlined, LikeOutlined, LinkOutlined } from '@ant-design/icons';
import TestResultStats from '../components/TestResultStats';
import TestStatusEnum from '../Enums/TestStatus.enum';
import { getImageURL } from '../utils/PathUtils';

const stringSorter = (a, b) => a.url.toLowerCase().localeCompare(b.url.toLowerCase());

const columns = [
    {
        title: 'Status',
        dataIndex: 'status',
        render: status => {
            const isFailed = status === TestStatusEnum.FAILED;
            const tagColor = isFailed ? 'volcano' : 'green';
            const tagText = isFailed ? TestStatusEnum.FAILED : TestStatusEnum.PASSED;
            return <Tag color={tagColor}>{tagText}</Tag>;
        },
    },
    {
        title: 'Type',
        dataIndex: 'type'
    },
    {
        title: 'Name',
        dataIndex: 'title',
        sorter: stringSorter,
        render: name => <Tooltip title={name}>{truncate(name)}</Tooltip>
    },
    {
        title: 'URL',
        dataIndex: 'url',
        sorter: stringSorter,
        sortDirections: ['descend', 'ascend'],
        render: url => <Button size='small' type='link' onClick={() => window.open(url, '_blank')}>{truncate(url)}</Button>
    },
    {
        title: 'Diff',
        dataIndex: 'diffFilePath',
        render: url => url && (
            <Button
                size='small'
                title={url}
                onClick={() => window.open(getImageURL(url), '_blank')}
            >
                <LinkOutlined/>
            </Button>
        )
    },
    {
        title: 'Selector',
        dataIndex: 'selector',
        render: selector => selector && <Tag color='geekblue'>{selector}</Tag>
    },
    {
        title: 'Ignore Selectors',
        dataIndex: 'ignoreSelectors',
        render: ignoreSelector => ignoreSelector && ignoreSelector.split(",").map(is => <Tag key={is} color='magenta'>{is}</Tag>)
    },
    {
        title: 'Is Multiple',
        dataIndex: 'isMultiple'
    },
    {
        title: 'Actions',
        dataIndex: 'actions'
    }
];

const TableItemActions = ({ item, resultId }) => {
    const history = useHistory(0);

    const approveItem = () => {
        message.loading('Approving result', 0);
        approveSingleTestResult(item, resultId, () => {
            message.destroy();
            message.success('Approved!');
            history.go(0);
        })
    }

    const goToCompareView = () => {
        history.push(`/compare/${resultId}/${item.testId}`);
    }

    return (
        <>
            {!item.isPassed && (
                <Space>
                    <Popconfirm
                        title='Are you sure? once approved, cannot be reversed'
                        onConfirm={approveItem}
                        placement='left'
                    >
                        <Tooltip title='Approve'>
                            <Button size='small'>
                                <LikeOutlined/>
                            </Button>
                        </Tooltip>
                    </Popconfirm>
                    <Tooltip title='Compare'>
                        <Button size='small' onClick={goToCompareView}>
                            <DiffOutlined/>
                        </Button>
                    </Tooltip>
                </Space>
            )}
        </>
    );
}

const TestResultView = props => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [ formatData, setFormatData ] = useState([]);
    const [ typeFilter, setTypeFilter ] = useState(TestStatusEnum.FAILED);
    const { state, dispatch } = useContext(store);

    useEffect(() => {
        dispatch({ type: actionTypes.SET_PAGE_TITLE, payload: `Test Result: ${id}` });
        id && getResultById(id, d => setData(d.data));
    }, [dispatch, id])

    useEffect(() => {
        if (data && data.stories && state.testList) {
            const childrens = {};

            data.stories.map(s => {
                const testObj = state.testList.find(t => t._id === s.testId);

                return testObj ? {
                    id: s.testId,
                    key: s.testId,
                    status: s.isPassed ? TestStatusEnum.PASSED : TestStatusEnum.FAILED,
                    diffFilePath: s.diffFilePath,
                    ...testObj,
                    isMultiple: testObj.isMultiple && <CheckOutlined/>,
                    actions: <TableItemActions item={s} resultId={data._id}/>
                } : {};
            }).forEach((s, i) => {
                if (!childrens[s.id]) {
                    childrens[s.id] = s;
                } else {
                    if (!childrens[s.id].children) childrens[s.id].children = [];
                    const newStory = {...s};
                    newStory.key = s.key + i;
                    childrens[s.id].children.push(newStory);
                }
            });

            setFormatData(Object.values(childrens));
        }
    }, [data, state])

    const getFilteredData = () => {
        return formatData
            .filter(d => !typeFilter || d.status === typeFilter);
    }

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <TestResultStats
                    total={data.total}
                    failed={data.failed}
                    startDate={data.createdAt}
                    endDate={data.updatedAt}
                    succeed={data.succeed}
                    percentage={data.percentage}
                />
            </Col>

            <Col span={24}>
                <Row>
                    <Col span={12}>
                        <Form.Item label='Show' colon>
                            <Radio.Group value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                                <Radio.Button value={''}>All</Radio.Button>
                                <Radio.Button value={TestStatusEnum.PASSED}>Passed</Radio.Button>
                                <Radio.Button value={TestStatusEnum.FAILED}>Failed</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Button icon={<CloudDownloadOutlined/>}>Export as JSON</Button>
                    </Col>
                </Row>
            </Col>

            <Col span={24}>
                <Table
                    size='middle'
                    columns={columns}
                    dataSource={getFilteredData()}
                />
            </Col>
        </Row>
    );
}

export default TestResultView;