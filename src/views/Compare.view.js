import { Col, Row, Select, Slider, Form, Divider } from 'antd';
import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getResultById } from '../services/DataFetcher';
import actionTypes from '../store/actionTypes';
import { store } from '../store/AppContext';
import { getImageURL } from '../utils/PathUtils';

const fileTypes = {
    ORIGINAL: {
        label: 'Original',
        value: 'original'
    },
    CURRENT: {
        label: 'Current',
        value: 'current'
    },
    DIFF: {
        label: 'Difference',
        value: 'diff'
    }
};

const CompareView = props => {
    const { resultId, testId } = useParams();
    const [data, setData] = useState([]);
    const { dispatch } = useContext(store);
    const [diffValue, setDiffValue] = useState(50);

    const [diffOne, setDiffOne] = useState(fileTypes.ORIGINAL.value);
    const [diffTwo, setDiffTwo] = useState(fileTypes.DIFF.value);

    useEffect(() => {
        dispatch({ type: actionTypes.SET_PAGE_TITLE, payload: `Compare: ${resultId}` });
        resultId && testId && getResultById(resultId, res => {
            const current = res.data.stories.filter(s => s.testId === testId);
            setData(current);
        });
    }, [testId, resultId, dispatch]);

    const getFileTypePath = (type) => {
        switch (type) {
            case fileTypes.ORIGINAL.value:
                return 'originalFilePath';

            case fileTypes.DIFF.value:
                return 'diffFilePath';

            default:
            case fileTypes.CURRENT.value:
                return 'currentFilePath';
        }
    }

    return (
        <>
            {data.map(d => (
                <Row key={d._id} gutter={[16, 16]}>
                    <Col span={24}>
                        <Form layout='inline'>
                            <Form.Item
                                label='Compare'
                            >
                                <Select value={diffOne} onChange={setDiffOne}>
                                    {Object.values(fileTypes).map(f => (
                                        <Select.Option key={f.label} value={f.value}>
                                            {f.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='With'
                            >
                                <Select value={diffTwo} onChange={setDiffTwo}>
                                    {Object.values(fileTypes).map(f => (
                                        <Select.Option key={f.label} value={f.value}>
                                            {f.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Divider type='vertical' />
                            </Form.Item>
                            <Form.Item label='Layer Opacity' style={{ width: 200 }}>
                                <Slider
                                    value={diffValue}
                                    onChange={setDiffValue}
                                />
                            </Form.Item>
                        </Form>
                        <Divider />
                    </Col>
                    <Col span={24}>
                        <img style={{ position: 'absolute', opacity: `${100 - diffValue}%` }} width='100%' src={getImageURL(d[getFileTypePath(diffOne)])} alt='Current' />
                        <img style={{ position: 'absolute', opacity: `${diffValue}%` }} width='100%' src={getImageURL(d[getFileTypePath(diffTwo)])} alt='Diff' />
                    </Col>
                </Row>
            ))}
        </>
    );
};

export default CompareView;