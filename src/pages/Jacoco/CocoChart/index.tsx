import { cocoChartDetail, pageCocoChart, queryModel } from '@/api/coco';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import ChartDetail from '@/pages/Jacoco/CocoChart/ChartDetail';
import { IChart } from '@/pages/Jacoco/CocoChart/IChart';
import { history } from '@@/core/history';
import { useParams } from '@@/exports';
import { ProCard, ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';

const Index = () => {
  const { reportId, uid } = useParams<{
    reportId: string;
    uid: string;
  }>();
  const [cocoChars, setCocoChars] = useState<IChart[]>([]);
  const [option, setOption] = useState();
  const [open, setOpen] = useState(false);
  const [currentUid, setCurrentUid] = useState<string>();
  const [currentChart, setCurrentChart] = useState<IChart>();
  useEffect(() => {
    queryModel().then(({ data }) => {
      setOption(data);
    });
  }, []);

  const fetchData = useCallback(
    async (params: any, sort: any) => {
      const searchData: any = {
        ...params,
        sort: sort,
      };
      if (reportId) {
        searchData.report_id = parseInt(reportId);
      }
      const { code, data, msg } = await pageCocoChart(searchData);
      if (code === 0) {
        setCocoChars(data.items);
        return {
          data: data.items,
          total: data.pageInfo.total,
          success: true,
          pageSize: data.pageInfo.page,
          current: data.pageInfo.limit,
        };
      }
      return {
        data: [],
        success: false,
        total: 0,
      };
    },
    [reportId],
  );

  const fetchCurrentDetail = async (chartId: number) => {
    await cocoChartDetail(chartId).then(({ code, data }) => {
      if (code === 0) {
        setCurrentChart(data);
      }
    });
  };
  const columns: ProColumns<IChart>[] = [
    {
      title: '模块',
      dataIndex: 'module_name',
      valueType: 'select',
      valueEnum: option,
      fixed: 'left',
      width: '5%',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '标签',
      dataIndex: 'trigger_tag',
      valueType: 'select',
      valueEnum: {
        1: 'manually',
        2: 'manuallyMerge',
        3: 'process',
        4: 'finally',
        5: 'auto',
        6: 'version',
      },
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '报告名称',
      dataIndex: 'report_name',
      fixed: 'left',
      width: '8%',
    },

    {
      title: '项目名称',
      dataIndex: 'report_project_name_list',
      hideInSearch: true,
    },
    {
      title: '字节覆盖率',
      dataIndex: 'instruction_coverage',
      hideInSearch: true,
    },

    {
      title: '分支覆盖率',
      dataIndex: 'branch_coverage',
      hideInSearch: true,
    },

    {
      title: '行覆盖率',
      dataIndex: 'line_coverage',
      hideInSearch: true,
    },

    {
      title: '圈复杂度覆盖率',
      dataIndex: 'cxty_coverage',
      hideInSearch: true,
    },
    {
      title: '类覆盖率',
      dataIndex: 'class_coverage',
      hideInSearch: true,
    },
    {
      title: '方法覆盖率',
      dataIndex: 'method_coverage',
      hideInSearch: true,
    },
    //
    // {
    //   title: '版本号',
    //   dataIndex: 'version',
    //   hideInSearch: true
    //
    // },

    // {
    //   title: '备注',
    //   dataIndex: 'remarks',
    //   hideInSearch: true
    //
    // },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      hideInSearch: true,
    },
    {
      title: '环境',
      dataIndex: 'env',
      valueType: 'select',
      valueEnum: {
        dev: 'dev',
        sit: 'sit',
        uat: 'uat',
      },
      width: '5%',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: 'Opt',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: '5%',
      render: (_, record, __, action) => {
        return (
          <a
            onClick={async () => {
              await fetchCurrentDetail(record.id).then(() => {
                setCurrentUid(record.report_uid);
                setOpen(true);
              });
            }}
          >
            详情
          </a>
        );
      },
    },
  ];

  return (
    <ProCard>
      <MyDrawer width={'80%'} name={'报告详情'} open={open} setOpen={setOpen}>
        <ProCard split={'horizontal'}>
          <ChartDetail currentChart={currentChart} />
          <ProCard style={{ height: '50vh' }}>
            {currentUid ? (
              <iframe
                src={`/api/jacoco/report/detail/root/${currentUid}`}
                width="100%"
                height="100%"
                allowFullScreen
              />
            ) : (
              'not found'
            )}
          </ProCard>
        </ProCard>
      </MyDrawer>
      <MyProTable
        reload={() => {
          history.push('/jacoco/chart/');
        }}
        dataSource={cocoChars}
        columns={columns}
        rowKey={'id'}
        x={1600}
        request={fetchData}
      />
    </ProCard>
  );
};
export default Index;
