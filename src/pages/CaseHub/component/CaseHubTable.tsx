import { ICaseInfo } from '@/api';
import { pageCase } from '@/api/case';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import AddCase from '@/pages/CaseHub/component/AddCase';
import CaseForm from '@/pages/CaseHub/component/CaseForm';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { pageData } from '@/utils/somefunc';
import {
  ActionType,
  ProCard,
  ProFormInstance,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Popconfirm, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SelfProps {
  projectID: number;
  currentModuleId: number;
}

const CaseHubTable: FC<SelfProps> = ({ projectID, currentModuleId }) => {
  const ref = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [caseInfo, setCaseInfo] = useState<ICaseInfo>();
  const [showCaseDrawerVisibleProps, setShowCaseDrawerVisibleProps] =
    useState<boolean>(false);

  const fetchDeleteDate = async (id: string) => {};
  const caseColumns: ProColumns[] = [
    {
      title: '用例标题',
      key: 'case_title',
      dataIndex: 'case_title',
    },
    {
      title: '用例描述',
      key: 'case_desc',
      search: false,
      dataIndex: 'case_desc',
    },
    {
      title: '用例等级',
      key: 'case_level',
      dataIndex: 'case_level',
      valueEnum: CONFIG.CASE_LEVEL_ENUM,
      render: (text, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_LEVEL[record.case_level].color}>
            {CONFIG.RENDER_CASE_LEVEL[record.case_level].text}
          </Tag>
        );
      },
    },
    {
      title: '用例类型',
      key: 'case_type',
      dataIndex: 'case_type',
      render: (text, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_TYPE[record.case_type].color}>
            {CONFIG.RENDER_CASE_TYPE[record.case_type].text}
          </Tag>
        );
      },
    },
    {
      title: '创建人',
      key: 'creatorName',
      dataIndex: 'creatorName',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_: any, record: any) => {
        return (
          <>
            <a
              onClick={() => {
                setCaseInfo(record);
                setShowCaseDrawerVisibleProps(true);
              }}
            >
              详情
            </a>
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
          </>
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
      <MyDrawer
        name={caseInfo?.case_title}
        open={showCaseDrawerVisibleProps}
        setOpen={setShowCaseDrawerVisibleProps}
      >
        <CaseForm caseInfo={caseInfo} update={true} callback={reloadTable} />
      </MyDrawer>
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
