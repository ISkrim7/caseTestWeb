import { getInterTaskResultDetail } from '@/api/inter/interTask';
import MyTabs from '@/components/MyTabs';
import InterfaceApiCaseResultTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultTable';
import InterfaceApiResultTable from '@/pages/Httpx/InterfaceApiTaskResult/InterfaceApiResultTable';
import { IInterfaceTaskResult } from '@/pages/Httpx/types';
import { Pie } from '@ant-design/charts';
import {
  ArrowLeftOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  SmileTwoTone,
} from '@ant-design/icons';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { useLocation, useNavigate, useParams } from '@umijs/max';
import { Button, Col, Descriptions, Row, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

const DescriptionsItem = Descriptions.Item;

// 定义 location.state 的类型
interface LocationState {
  from?: string;
}

const InterfaceApiTaskResultDetail: FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // 使用类型断言解决 TypeScript 错误
  const state = location.state as LocationState | undefined;
  const [interfaceTaskResultInfo, setInterfaceTaskResultInfo] =
    useState<IInterfaceTaskResult>();
  const [rateNumber, setRateNumber] = useState(0);

  // 增强的返回函数 - 保留老代码的功能
  const handleGoBack = () => {
    // 1. 如果 state 中有 from 路径，优先使用
    if (state?.from) {
      navigate(state.from);
      return;
    }

    // 2. 尝试返回上一页
    navigate(-1);

    // 3. 如果返回上一页无效（3秒后仍在当前页），跳转到默认列表页
    setTimeout(() => {
      // 检查是否仍在当前页面
      const isStillOnPage = window.location.pathname.includes(
        `/httpx/interface-api-task-result/${resultId}`,
      );
      if (isStillOnPage) {
        // 跳转到接口任务结果列表页
        navigate('/httpx/interface-api-task-result');
      }
    }, 3000);
  };

  useEffect(() => {
    if (resultId) {
      getInterTaskResultDetail(resultId).then(async ({ code, data }) => {
        if (code === 0) {
          setInterfaceTaskResultInfo(data);
          // 使用新代码的Math.trunc改进，避免小数问题
          const r = Math.trunc(
            (data.successNumber / (data.failNumber + data.successNumber)) * 100,
          );
          setRateNumber(r);
        }
      });
    }
  }, [resultId]);

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
    color: ['#52c41a', '#f5222d'], // 保留饼图颜色配置
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  // 使用新代码的MyTabs配置方式
  const TabsItem = [
    {
      label: '用例结果',
      key: '1',
      children: <InterfaceApiCaseResultTable taskResultId={resultId} />,
    },
    {
      label: '接口结果',
      key: '2',
      children: <InterfaceApiResultTable taskResultId={resultId} />,
    },
  ];

  return (
    <ProCard split={'horizontal'}>
      {/* 保留老代码的返回按钮卡片 */}
      <ProCard>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={handleGoBack}
          style={{ marginBottom: 16 }}
        >
          返回上一页
        </Button>
      </ProCard>

      {/* 使用新代码的卡片样式，保留老代码的标题 */}
      <ProCard title={'测试报告'} bordered hoverable>
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
                <ProCard hoverable bordered={false} className={'statisticCard'}>
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
                <ProCard hoverable bordered={false} className={'statisticCard'}>
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

      {/* 使用新代码的MyTabs组件 */}
      <ProCard bordered hoverable bodyStyle={{ padding: 0 }}>
        <MyTabs defaultActiveKey={'1'} items={TabsItem} />
      </ProCard>
    </ProCard>
  );
};

export default InterfaceApiTaskResultDetail;
