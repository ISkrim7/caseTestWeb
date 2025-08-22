import { pageCase } from '@/api/case';
import MyProTable from '@/components/Table/MyProTable';
import AddCase from '@/pages/CaseHub/component/AddCase';
import { CaseInfo } from '@/pages/CaseHub/type';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { pageData } from '@/utils/somefunc';
import { ActionType, ProCard } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Popconfirm, Space, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SelfProps {
  projectID: number;
  currentModuleId: number;
}

const CaseHubTable: FC<SelfProps> = ({ projectID, currentModuleId }) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [caseInfo, setCaseInfo] = useState<CaseInfo>();
  const [showCaseDrawerVisibleProps, setShowCaseDrawerVisibleProps] =
    useState<boolean>(false);

  const fetchDeleteDate = async (id: string) => {};
  const caseColumns: ProColumns[] = [
    {
      title: 'ID',
      key: 'uid',
      dataIndex: 'uid',
      fixed: 'left',
      width: '10%',
      copyable: true,
    },
    {
      title: '用例',
      key: 'case_title',
      dataIndex: 'case_title',
      width: '20%',
      copyable: true,
    },
    {
      title: '需求名',
      key: 'requirement_name',
      dataIndex: 'requirement_name',
      width: '20%',
      copyable: true,
    },
    {
      title: '需求等级',
      key: 'requirement_level',
      dataIndex: 'requirement_level',
      valueEnum: CONFIG.CASE_LEVEL_ENUM,
      width: '10%',
      render: (text, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_LEVEL[record.case_level].color}>
            {CONFIG.RENDER_CASE_LEVEL[record.case_level].text}
          </Tag>
        );
      },
    },
    {
      title: '进度',
      key: 'process',
      dataIndex: 'process',
      width: '10%',
      render: (text, record) => {
        return <Tag></Tag>;
      },
    },
    {
      title: '用例数',
      key: 'case_number',
      dataIndex: 'case_number',
      width: '10%',
      hideInSearch: true,
      render: (text, record) => {
        return <Tag></Tag>;
      },
    },
    {
      title: '评审',
      key: 'is_review',
      dataIndex: 'is_review',
    },
    {
      title: '维护人',
      key: 'creatorName',
      dataIndex: 'creatorName',
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space>
            <a
              onClick={() => {
                setCaseInfo(record);
                setShowCaseDrawerVisibleProps(true);
              }}
            >
              详情
            </a>

            <a>需求文档</a>
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={async () => {
                await fetchDeleteDate(record.uid);
              }}
              okText="是"
              cancelText="否"
            >
              <a style={{ marginLeft: 8 }}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const reloadTable = () => {
    setShowCaseDrawerVisibleProps(false);
    actionRef.current?.reload();
  };
  useEffect(() => {
    reloadTable();
  }, [currentModuleId, projectID]);

  const fetchPageData = useCallback(
    async (params: any, sort: any) => {
      const values = {
        ...params,
        module_id: currentModuleId,
        module_type: ModuleEnum.CASE,
      };
      const { code, data } = await pageCase(values);
      return pageData(code, data);
    },
    [currentModuleId, projectID],
  );

  return (
    <ProCard bodyStyle={{ padding: 2 }}>
      <MyProTable
        rowKey={'id'}
        actionRef={actionRef}
        columns={caseColumns}
        request={fetchPageData}
        toolBarRender={() => [
          <AddCase
            currentModuleId={currentModuleId}
            projectID={projectID!}
            callback={reloadTable}
          />,
        ]}
      />
    </ProCard>
  );
};

export default CaseHubTable;
