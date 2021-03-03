import React, { useState } from 'react';
import { Button, Card, Col, message, Popover, Row, Tag, Tooltip, Divider, Carousel } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { removeTestItem } from '../services/DataFetcher';
import TestTypeEnum from '../Enums/TestType.enum';
import { useHistory } from 'react-router-dom';
import { getImageURL } from '../utils/PathUtils';

const DeletePopover = ({ visible, setVisible, onItemDelete }) => {
    const onCancelClicked = () => setVisible(false);
    const onDeleteClicked = () => onItemDelete();

    return (
        <Popover
            trigger='click'
            title='Are you sure?'
            visible={visible}
            onVisibleChange={setVisible}
            content={(
                <Row gutter={8}>
                    <Col span={12}>
                        <Button type='danger' onClick={onDeleteClicked}>Delete</Button>
                    </Col>
                    <Col span={12}>
                        <Button onClick={onCancelClicked}>Cancel</Button>
                    </Col>
                </Row>
            )}
        >
            <DeleteOutlined key="delete" />
        </Popover>
    );
}

const TestListCard = ({ item, onItemEdit }) => {
    const { title, type, image: img, url, selector, files, ignoreSelectors } = item;
    const [ popoverVisible, setPopoverVisible ] = useState(false);
    const history = useHistory();

    const onItemDelete = () => {
        removeTestItem(item, () => message.success('Item deleted'));
        history.go(0);
    };

    const getIgnoreSelectors = () => ignoreSelectors ? ignoreSelectors.split(",") : [];

    return (
        <Card
            size='small'
            className='test-list-card'
            cover={
                <Carousel autoplay effect='fade'>
                    {files.map(f => (
                        <img
                            key={f}
                            alt='example'
                            src={getImageURL(f)}
                        />
                    ))}
                </Carousel>
            }
            actions={[
                <Tooltip title='Genereate Base'>
                    <SettingOutlined key="setting" />
                </Tooltip>,
                <Tooltip title='Edit'>
                    <EditOutlined key="edit" onClick={() => onItemEdit(item)} />
                </Tooltip>,
                <Tooltip title='Delete'>
                    <DeletePopover
                        onItemDelete={onItemDelete}
                        visible={popoverVisible}
                        setVisible={setPopoverVisible}
                    />
                </Tooltip>,
            ]}
        >
            <Card.Meta
                avatar={<Avatar>{type[0].toUpperCase()}</Avatar>}
                title={title}
                description={url}
            />
            <Divider/>
            <Tag color='orange'>{files.length} Files</Tag>
            {type === TestTypeEnum.ELEMENT && <Tag color='geekblue' icon={<EyeOutlined/>}>{selector}</Tag>}

            {!!getIgnoreSelectors().length && (
                <>
                    {getIgnoreSelectors().map(is => <Tag color='magenta' key={is} icon={<EyeInvisibleOutlined/>}>{is}</Tag>)}
                </>
            )}
        </Card>
    );
};

export default TestListCard;