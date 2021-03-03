import { Form, Select, Input, Divider, Button, Col, Row, message } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TestTypeEnum from '../Enums/TestType.enum';
import { createOrUpdateTest } from '../services/DataFetcher';

const { Option } = Select;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};
 
const NewTestView = ({ onClose, item = {} }) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [ isElement, setIsElement ] = useState(false);

    useEffect(() => {
        form.resetFields();

        if(item) {
            setIsElement(item.type === TestTypeEnum.ELEMENT);
        }
    }, [item, form]);

    const onFormFinish = (values) => {
        const messageTexts = {
            LOADING: 'Creating Test',
            DONE: 'Test Created'
        };

        if(!!values._id) {
            messageTexts.LOADING = 'Updating Test';
            messageTexts.DONE = 'Test Updated';
        }
        message.loading(messageTexts.LOADING, 0);
        createOrUpdateTest(values, e => {
            message.destroy();
            form.resetFields();
            message.success(messageTexts.DONE);
            onClose('new');
            history.go(0);
        })
    };

    const onCancelClicked = () => {
        form.resetFields();
        onClose('cancel');
    }

    const onFormFinishFailed = () => {};
    const onFieldsChange = (e) => {
        const currentChange = e[0];
        if(currentChange.name[0] === 'type') {
            currentChange.value && setIsElement(currentChange.value === TestTypeEnum.ELEMENT);
        }
    };

    return (
        <Form
            form={form}
            {...layout}
            name='newTest'
            initialValues={{...item}}
            onFinish={onFormFinish}
            onFinishFailed={onFormFinishFailed}
            onFieldsChange={onFieldsChange}
            preserve={false}
        >
            <Form.Item
                hidden={true}
                name='_id'
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name='type'
                label='Type'
                rules={[{ required: true, message: 'Type is required' }]}
            >
                <Select>
                    <Option value='element'>Element</Option>
                    <Option value='page'>Page</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name='title'
                label='Test Name'
                rules={[{ required: true, message: 'Test Name is required' }]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name='url'
                label='page URL'
                rules={[{
                    required: true,
                    pattern: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g,
                    message: 'URL is not valid'
                }]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name='resolutions'
                label='Resolutions'
                extra='Not Yet Implemented'
            >
                <Select
                    mode='multiple'
                >
                    <Option value='1024x768'>1024x768</Option>
                    <Option value='1920x1280'>1920x1280</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name='ignoreSelectors'
                label='Ignore Selectors'
                extra='List of selectors, seperated by comma (,)'
            >
                <Input/>
            </Form.Item>

            {isElement && (
                <>
                    <Form.Item
                        name='selector'
                        label='Selector'
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name='isMultiple'
                        label='Is Multiple'
                        valuePropName="checked"
                    >
                        <Checkbox/>
                    </Form.Item>
                </>
            )}

            <Form.Item
                label='Cookies'
                name='cookies'
                extra='Not Yet Implemented'
            >
                <Input/>
            </Form.Item>

            <Divider/>
            <div style={{ textAlign: 'right'}}>
                <Row gutter={16}>
                    <Col>
                        <Button htmlType='submit' type='primary'>Submit</Button>
                    </Col>
                    <Col>
                        <Button onClick={onCancelClicked} type='secondary'>Cancel</Button>
                    </Col>
                </Row>
            </div>
        </Form>
    )
};

export default NewTestView;