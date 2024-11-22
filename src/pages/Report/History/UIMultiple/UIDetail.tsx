import {
  getMultipleReportByTaskId,
  queryMultipleReportDetailByBaseId,
} from '@/api/ui';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import UiResultInfo from '@/pages/Report/History/UISingle/UIResultInfo';
import {
  UIMultipleDetailReport,
  UIMultipleReport,
} from '@/pages/Report/uiReport';
import { IUIResult } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { history } from '@@/core/history';
import { useParams } from '@@/exports';
import { Pie } from '@ant-design/charts';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  SmileTwoTone,
} from '@ant-design/icons';
import {
  ActionType,
  ProCard,
  ProColumns,
  StatisticCard,
} from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, Descriptions, Row, Spin, Tag } from 'antd';
import DescriptionsItem from 'antd/es/descriptions/Item';
import { useEffect, useRef, useState } from 'react';

const UiDetail = () => {
  const { uid } = useParams<{ uid: string }>();
  const [baseInfo, setBaseInfo] = useState<UIMultipleReport>();
  const [detailSource, setDetailSource] = useState<UIMultipleDetailReport[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [fetchData, setFetchData] = useState(0);
  const [currentDetailId, setCurrentDetailId] = useState<string>();
  const [openResult, setOpenResult] = useState(false);
  const [failOnly, setFailOnly] = useState(false);
  useEffect(() => {
    if (failOnly) {
      setDetailSource(detailSource.filter((item) => item.result === 'FAIL'));
    } else {
      setFetchData(fetchData + 1);
    }
  }, [failOnly]);

  useEffect(() => {
    const fetchBaseInfo = async (uid: string) => {
      const { code, data } = await getMultipleReportByTaskId({ uid: uid });
      if (code === 0) {
        return data;
      }
    };
    const fetchDetailSource = async (uid: string) => {
      const { code, data } = await queryMultipleReportDetailByBaseId({
        uid: uid,
      });
      if (code === 0) {
        return data;
      }
    };
    if (uid) {
      fetchBaseInfo(uid).then((data) => {
        setBaseInfo(data);
        setLoading(false);
      });
      fetchDetailSource(uid).then((data) => {
        setDetailSource(data);
        setLoading(false);
      });
    }
  }, [uid, fetchData]);

  const PieData = [
    {
      type: '成功',
      value: baseInfo?.successNumber,
    },
    {
      type: '失败',
      value: baseInfo?.failNumber,
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

  const columns: ProColumns<IUIResult>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      copyable: true,
      fixed: 'left',
    },
    {
      title: '用例名称',
      dataIndex: 'ui_case_name',
      valueType: 'text',
      fixed: 'left',
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              history.push(`/ui/case/detail/caseId=${record.ui_case_Id}`);
            }}
          >
            {record.ui_case_name} + {` (${record.ui_case_Id})`}
          </a>
        );
      },
    },
    {
      title: '用例描述',
      dataIndex: 'ui_case_desc',
      valueType: 'textarea',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '运行时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: CONFIG.UI_STATUS_ENUM,
      render: (_, record) => {
        return CONFIG.UI_STATUS_ENUM[record.status].tag;
      },
    },
    {
      title: '执行结果',
      dataIndex: 'result',
      valueType: 'select',
      valueEnum: CONFIG.UI_RESULT_ENUM,
      render: (_, record) => {
        return CONFIG.UI_RESULT_ENUM[record.result]?.tag;
      },
    },
    {
      title: '执行人',
      dataIndex: 'starterName',
      valueType: 'text',
    },
    {
      title: '操作',
      dataIndex: 'action',
      valueType: 'option',
      render: (_, record) => {
        if (record.status === 'DONE') {
          return (
            <a
              onClick={() => {
                setCurrentDetailId(record.uid);
                setOpenResult(true);
              }}
            >
              详情
            </a>
          );
        }
      },
    },
  ];

  /**
   * 刷新
   */
  const reload = () => {
    setLoading(true);
    setFetchData(fetchData + 1);
  };
  return (
    <PageContainer title={false}>
      <MyDrawer name={'测试详情'} open={openResult} setOpen={setOpenResult}>
        <UiResultInfo currentUid={currentDetailId} />
      </MyDrawer>
      <Spin tip={'努力加载中。。'} size={'large'} spinning={loading}>
        {baseInfo && (
          <ProCard title={'UI自动化测试报告'}>
            <Row gutter={[8, 8]}>
              <Col span={17}>
                <Row gutter={8}>
                  <Col span={6}>
                    <ProCard hoverable bordered={false}>
                      <StatisticCard
                        statistic={{
                          title: '用例总数',
                          value: baseInfo.totalNumber,
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
                          value: baseInfo.successNumber || 0,
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
                          value: baseInfo.failNumber || 0,
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
                          value: baseInfo.rateNumber ? baseInfo.rateNumber : 0,
                          prefix:
                            baseInfo.rateNumber > 90 ? (
                              <LikeTwoTone />
                            ) : (
                              <FrownTwoTone />
                            ),
                          suffix: '%',
                        }}
                      />
                    </ProCard>
                  </Col>
                </Row>
                <Descriptions style={{ marginTop: 10 }}>
                  <DescriptionsItem label="执行状态">
                    <Tag
                      color={baseInfo.status === 'RUNNING' ? 'blue' : 'green'}
                    >
                      {baseInfo.status}
                    </Tag>
                  </DescriptionsItem>
                  <DescriptionsItem label="执行人">
                    <Tag color={'orange'}>{baseInfo.starterName}</Tag>
                  </DescriptionsItem>
                  <DescriptionsItem label="开始时间">
                    <Tag color={'processing'}>{baseInfo.start_time}</Tag>
                  </DescriptionsItem>
                  <DescriptionsItem label="结束时间">
                    <Tag color={'processing'}>{baseInfo.end_time}</Tag>
                  </DescriptionsItem>
                  <DescriptionsItem label="耗时">
                    <Tag color={'processing'}>{baseInfo.totalUseTime}</Tag>
                  </DescriptionsItem>
                </Descriptions>
              </Col>
              <Col span={7}>
                <Pie {...PieConfig} />
              </Col>
            </Row>
          </ProCard>
        )}
        <MyProTable
          actionRef={actionRef}
          dataSource={detailSource}
          columns={columns}
          search={false}
          rowKey="uid"
          reload={reload}
          toolBarRender={() => [
            <Button
              type={failOnly ? 'primary' : 'default'}
              onClick={() => {
                setFailOnly(!failOnly);
              }}
            >
              只看失败
            </Button>,
          ]}
        />
      </Spin>
    </PageContainer>
  );
};

export default UiDetail;
