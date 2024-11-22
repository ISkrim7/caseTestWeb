import { IGroupInterfaceDataSource, IGroupInterfacesResult } from '@/api';
import {
  getApiDetail,
  getInterfacesResultInfo,
  queryInterfacesGroupInfo,
} from '@/api/interface';
import MyProTable from '@/components/Table/MyProTable';
import InterResponse from '@/pages/Interface/InterResponse';
import { history } from '@@/core/history';
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
import { Col, Descriptions, Row, Spin, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'umi';

const DescriptionsItem = Descriptions.Item;
const Detail = () => {
  const { uid } = useParams<{ uid: string }>();
  const [interfaceResultInfo, setInterfaceResultInfo] =
    useState<IGroupInterfacesResult>();
  const [loading, setLoading] = useState<boolean>(true);
  const [caseDataSource, setCaseDataSource] = useState<
    IGroupInterfaceDataSource[]
  >([]);
  const [openResult, setOpenResult] = useState(false);
  const [currentDetailUid, setCurrentDetailUid] = useState<string>();
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [fetchData, setFetchData] = useState(0);

  useEffect(() => {
    const fetchData = async (uid: string) => {
      const { code, data } = await getInterfacesResultInfo({ uid: uid });
      if (code === 0) {
        return data;
      }
    };

    const fetchInterfaceQuery = async (id: number) => {
      const { code, data } = await queryInterfacesGroupInfo({
        interfaceGroupId: id,
      });
      if (code === 0) {
        return data;
      }
    };
    if (uid) {
      fetchData(uid).then((data) => {
        if (data) {
          setInterfaceResultInfo(data);
          setLoading(false);
          fetchInterfaceQuery(data.id).then((data) => {
            if (data) {
              setCaseDataSource(data);
            }
          });
        }
      });
    }
  }, [uid, fetchData]);

  const PieData = [
    {
      type: '成功',
      value: interfaceResultInfo?.successNumber,
    },
    {
      type: '失败',
      value: interfaceResultInfo?.failNumber,
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

  const goApiDetail = async (uid: string) => {
    const { code, data } = await getApiDetail({ uid: uid });
    if (code === 0) {
      history.push(
        `/interface/caseApi/detail/projectID=${data.projectID}&casePartID=${data.casePartID}&uid=${data.uid}`,
      );
    }
  };
  const columns: ProColumns<IGroupInterfaceDataSource>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: '3%',
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      copyable: true,
      width: '7%',
      render: (text, record) => (
        <a onClick={async () => await goApiDetail(record.interfaceUid)}>
          {text}
        </a>
      ),
    },
    {
      title: '名称',
      dataIndex: 'interfaceName',
      key: 'interfaceName',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },

    {
      title: '创建人',
      dataIndex: 'interfaceCreator',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '用时',
      dataIndex: 'useTime',
      valueType: 'text',
      search: false,
    },
    {
      title: '运行状态',
      dataIndex: 'flag',
      render: (text, record) => {
        return (
          <Tag color={record.flag === 'RUNNING' ? 'blue' : 'green'}>{text}</Tag>
        );
      },
    },
    {
      title: '运行结果',
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <Tag color={record.status === 'SUCCESS' ? 'green' : 'red'}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => {
        if (record.flag === 'DONE') {
          return [
            [
              <a
                onClick={() => {
                  setCurrentDetailUid(record.uid);
                  setOpenResult(true);
                }}
              >
                详情
              </a>,
            ],
          ];
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
      <InterResponse
        open={openResult}
        setOpen={setOpenResult}
        resultUid={currentDetailUid}
        isGroup={true}
      />

      <Spin tip={'努力加载中。。'} size={'large'} spinning={loading}>
        {interfaceResultInfo && (
          <ProCard title={'测试报告'}>
            <Row gutter={[8, 8]}>
              <Col span={17}>
                <Row gutter={8}>
                  <Col span={6}>
                    <ProCard hoverable bordered={false}>
                      <StatisticCard
                        statistic={{
                          title: '用例总数',
                          value: interfaceResultInfo.totalNumber,
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
                          value: interfaceResultInfo.successNumber,
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
                          value: interfaceResultInfo.failNumber,
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
                          value: interfaceResultInfo.rateNumber
                            ? interfaceResultInfo.rateNumber
                            : 0,
                          prefix:
                            interfaceResultInfo.rateNumber > 90 ? (
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
                      color={
                        interfaceResultInfo.status === 'RUNNING'
                          ? 'blue'
                          : 'green'
                      }
                    >
                      {interfaceResultInfo.status}
                    </Tag>
                  </DescriptionsItem>
                  <DescriptionsItem label="执行人">
                    <Tag color={'orange'}>
                      {interfaceResultInfo.starterName}
                    </Tag>
                  </DescriptionsItem>
                  <DescriptionsItem label="开始时间">
                    <Tag color={'processing'}>
                      {interfaceResultInfo.create_time}
                    </Tag>
                  </DescriptionsItem>
                  <DescriptionsItem label="结束时间">
                    <Tag color={'processing'}>
                      {interfaceResultInfo.end_time}
                    </Tag>
                  </DescriptionsItem>
                  <DescriptionsItem label="耗时">
                    <Tag color={'processing'}>
                      {interfaceResultInfo.totalUseTime}
                    </Tag>
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
          dataSource={caseDataSource}
          columns={columns}
          search={false}
          reload={reload}
          rowKey="uid"
        />
      </Spin>
    </PageContainer>
  );
};

export default Detail;
