import React from 'react';
import { format, formatDistance, parseISO } from 'date-fns';
import { Card, Col, Row , Statistic} from 'antd';

const TestResultStats = ({
    startDate,
    endDate,
    total, 
    failed,
    succeed,
    percentage
}) => {
    const stats = [
        {
            title: 'Execution Time',
            value: startDate && format(parseISO(startDate), 'dd/MM/yyyy hh:mm:ss'),
            size: 6
        },
        {
            title: 'Duration',
            value: startDate && endDate && formatDistance(parseISO(startDate), parseISO(endDate)),
            size: 6
        },
        {
            title: 'Total Tests',
            value: total
        },
        {
            title: 'Failed',
            value: failed
        },
        {
            title: 'Percentage',
            value: `${percentage}%`
        }
    ];

    return (
        <Row style={{ background: '#ececec', padding: 16 }}>
            {stats.map(s => (
                <Col span={s.size || 4} key={s.title}>
                    <Card>
                        <Statistic {...s}/>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default TestResultStats;