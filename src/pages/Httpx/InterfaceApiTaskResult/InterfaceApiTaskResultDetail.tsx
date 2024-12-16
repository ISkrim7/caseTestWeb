import { getInterTaskResultDetail } from '@/api/inter/interTask';
import InterfaceApiCaseResultTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultTable';
import InterfaceApiResultTable from '@/pages/Httpx/InterfaceApiTaskResult/InterfaceApiResultTable';
import { IInterfaceTaskResult } from '@/pages/Httpx/types';
import { Pie } from '@ant-design/charts';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  SmileTwoTone,
} from '@ant-design/icons';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { Col, Descriptions, Row, Tabs, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

const DescriptionsItem = Descriptions.Item;

interface Props {
  taskResultId?: string | number;
}

const InterfaceApiTaskResultDetail: FC<Props> = ({ taskResultId }) => {
  const [interfaceTaskResultInfo, setInterfaceTaskResultInfo] =
    useState<IInterfaceTaskResult>();
  const [rateNumber, setRateNumber] = useState(0);
  useEffect(() => {
    if (taskResultId) {
      getInterTaskResultDetail(taskResultId).then(async ({ code, data }) => {
        if (code === 0) {
          setInterfaceTaskResultInfo(data);
          const r =
            (data.successNumber / (data.failNumber + data.successNumber)) * 100;
          console.log(r);
          setRateNumber(r);
        }
      });
    }
  }, [taskResultId]);
  const PieData = [
    {
      type: '成功',
      value: interfaceTaskResultInfo?.successNumber,
    },
    {
      type: '失败',
      value: interfaceTaskResultInfo?.failNumber,
    },
  ];
  const PieConfig = {
    height: 230,
    appendPadding: 10,
    data: PieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return (
    <ProCard split={'horizontal'}>
      <ProCard>
        <ProCard title={'测试报告'}>
          <Row gutter={[8, 8]}>
            <Col span={17}>
              <Row gutter={8}>
                <Col span={6}>
                  <ProCard hoverable bordered={false}>
                    <StatisticCard
                      statistic={{
                        title: '用例总数',
                        value: interfaceTaskResultInfo?.totalNumber,
                        prefix: <SmileTwoTone />,
                      }}
                    />
                  </ProCard>
                </Col>
                <Col span={6}>
                  <ProCard hoverable bordered={false}>
                    <StatisticCard
                      statistic={{
                        title: '成功数量',
                        value: interfaceTaskResultInfo?.successNumber,
                        prefix: (
                          <CheckCircleTwoTone twoToneColor="rgb(63, 205, 127)" />
                        ),
                      }}
                    />
                  </ProCard>
                </Col>
                <Col span={6}>
                  <ProCard
                    hoverable
                    bordered={false}
                    className={'statisticCard'}
                  >
                    <StatisticCard
                      statistic={{
                        title: '失败数量',
                        value: interfaceTaskResultInfo?.failNumber,
                        prefix: (
                          <CloseCircleTwoTone twoToneColor="rgb(230, 98, 97)" />
                        ),
                      }}
                    />
                  </ProCard>
                </Col>
                <Col span={6}>
                  <ProCard
                    hoverable
                    bordered={false}
                    className={'statisticCard'}
                  >
                    <StatisticCard
                      statistic={{
                        title: '测试通过率',
                        value: rateNumber ? rateNumber : 0,
                        prefix:
                          rateNumber > 90 ? <LikeTwoTone /> : <FrownTwoTone />,
                        suffix: '%',
                      }}
                    />
                  </ProCard>
                </Col>
              </Row>
              <Descriptions style={{ marginTop: 10 }}>
                <DescriptionsItem label="执行状态">
                  <Tag
                    color={
                      interfaceTaskResultInfo?.status === 'RUNNING'
                        ? 'blue'
                        : 'green'
                    }
                  >
                    {interfaceTaskResultInfo?.status}
                  </Tag>
                </DescriptionsItem>
                <DescriptionsItem label="执行人">
                  <Tag color={'orange'}>
                    {interfaceTaskResultInfo?.starterName}
                  </Tag>
                </DescriptionsItem>
                <DescriptionsItem label="开始时间">
                  <Tag color={'processing'}>
                    {interfaceTaskResultInfo?.create_time}
                  </Tag>
                </DescriptionsItem>
                <DescriptionsItem label="结束时间">
                  <Tag color={'processing'}>
                    {interfaceTaskResultInfo?.end_time}
                  </Tag>
                </DescriptionsItem>
                <DescriptionsItem label="耗时">
                  <Tag color={'processing'}>
                    {interfaceTaskResultInfo?.totalUseTime}
                  </Tag>
                </DescriptionsItem>
              </Descriptions>
            </Col>
            <Col span={7}>
              <Pie {...PieConfig} />
            </Col>
          </Row>
        </ProCard>
      </ProCard>
      <ProCard bordered={false}>
        <Tabs defaultActiveKey={'1'}>
          <Tabs.TabPane tab={'API'} key="1">
            <InterfaceApiResultTable taskResultId={taskResultId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={'API CASE'} key="2">
            <InterfaceApiCaseResultTable taskResultId={taskResultId} />
          </Tabs.TabPane>
        </Tabs>
      </ProCard>
    </ProCard>
  );
};

export default InterfaceApiTaskResultDetail;
