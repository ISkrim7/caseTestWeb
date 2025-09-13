import { pageTestCase } from '@/api/case/testCase';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import { CaseHubConfig } from '@/pages/CaseHub/CaseConfig';
import DynamicInfo from '@/pages/CaseHub/TestCase/DynamicInfo';
import TestCaseDetail from '@/pages/CaseHub/TestCase/TestCaseDetail';
import { ITestCase } from '@/pages/CaseHub/type';
import { ModuleEnum } from '@/utils/config';
import { pageData } from '@/utils/somefunc';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Popconfirm, Space, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  currentProjectId?: number;
  currentModuleId?: number;
  perKey: string;
}

const CaseDataTable: FC<Props> = (props) => {
  const { perKey, currentProjectId, currentModuleId } = props;
  const { CASE_LEVEL_ENUM } = CaseHubConfig;
  const actionRef = useRef<ActionType>();
  const [currentCaseId, setCurrentCaseId] = useState<number>();
  const [currentCase, setCurrentCase] = useState<ITestCase>();
  const [showDynamic, setShowDynamic] = useState<boolean>(false);
  const [showCaseDetail, setShowCaseDetail] = useState<boolean>(false);
  useEffect(() => {
    actionRef.current?.reload();
  }, [currentModuleId, currentProjectId]);
  const column: ProColumns<ITestCase>[] = [
    {
      title: 'ID',
      dataIndex: 'uid',
      fixed: 'left',
      copyable: true,
      render: (_, record) => {
        return <Tag>{record.uid}</Tag>;
      },
    },
    {
      title: '用例名称',
      dataIndex: 'case_name',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '等级',
      dataIndex: 'case_level',
      sorter: true,
      valueEnum: CASE_LEVEL_ENUM,
      render: (_, record) => {
        return <Tag color={'blue'}>{record.case_level}</Tag>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      valueType: 'option',
      fixed: 'right',
      width: '8%',
      render: (_: any, record: ITestCase) => {
        return (
          <Space>
            <a
              onClick={() => {
                setCurrentCase(record);
                setShowCaseDetail(true);
              }}
            >
              详情
            </a>
            <a
              onClick={() => {
                setCurrentCaseId(record.id);
                setShowDynamic(true);
              }}
            >
              动态
            </a>
            <Popconfirm title={'确认删除'}>
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const fetchPageData = useCallback(
    async (params: ITestCase, sort: any) => {
      const values = {
        ...params,
        is_common: true,
        module_id: currentModuleId,
        module_type: ModuleEnum.CASE,
        sort: sort,
      };
      const { code, data } = await pageTestCase(values);
      return pageData(code, data);
    },
    [currentModuleId],
  );
  return (
    <>
      <MyDrawer
        name={'动态'}
        width={'40%'}
        open={showDynamic}
        setOpen={setShowDynamic}
      >
        <DynamicInfo caseId={currentCaseId} />
      </MyDrawer>
      <MyDrawer name={''} open={showCaseDetail} setOpen={setShowCaseDetail}>
        <TestCaseDetail
          testcase={currentCase}
          callback={() => {
            actionRef.current?.reload();
          }}
        />
      </MyDrawer>
      <MyProTable
        actionRef={actionRef}
        persistenceKey={perKey}
        request={fetchPageData}
        columns={column}
        x={1200}
        rowKey={'uid'}
      />
    </>
  );
};

export default CaseDataTable;
