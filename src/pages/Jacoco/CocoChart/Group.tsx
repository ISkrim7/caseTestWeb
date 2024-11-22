import { cocoChartDetail, cocoChartGroup } from '@/api/coco';
import MyDrawer from '@/components/MyDrawer';
import ChartDetail from '@/pages/Jacoco/CocoChart/ChartDetail';
import { IChart } from '@/pages/Jacoco/CocoChart/IChart';
import { ProCard, ProColumns, ProTable } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useEffect, useState } from 'react';

const Group = () => {
  const [option, setOption] = useState();
  const [open, setOpen] = useState(false);
  const [currentUid, setCurrentUid] = useState<string>();
  const [currentChart, setCurrentChart] = useState<IChart>();
  const [cocoChars, setCocoChars] = useState<IChart[]>([]);

  const fetchCurrentDetail = async (chartId: number) => {
    await cocoChartDetail(chartId).then(({ code, data }) => {
      if (code === 0) {
        setCurrentChart(data);
      }
    });
  };

  useEffect(() => {
    cocoChartGroup('sit').then(({ code, data }) => {
      if (code === 0) {
        setCocoChars(data);
      }
    });
  }, []);
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
      title: '报告名称',
      ellipsis: true,
      dataIndex: 'report_name',
      fixed: 'left',
      width: '8%',
    },
    {
      title: '项目名称',
      dataIndex: 'report_project_name_list',
      hideInSearch: true,
      fixed: 'left',
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
      fixed: 'left',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
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
    {
      title: '创建时间',
      dataIndex: 'create_time',
      hideInSearch: true,
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
      <ProTable
        bordered={true}
        search={false}
        size={'small'}
        dataSource={cocoChars}
        columns={columns}
        rowKey={'id'}
        scroll={{ x: 1600 }}
        pagination={false}
      />
    </ProCard>
  );
};

export default Group;
