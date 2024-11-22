import { ISearch } from '@/api';
import { pageResult } from '@/api/ui';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import UiResultInfo from '@/pages/Report/History/UISingle/UIResultInfo';
import { IUIResult } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { history } from '@@/core/history';
import { ProCard, ProColumns } from '@ant-design/pro-components';
import { FC, useCallback, useState } from 'react';

interface SelfProps {
  currentCaseId?: number;
}

const Index: FC<SelfProps> = ({ currentCaseId }) => {
  const [open, setOpen] = useState(false);
  const [currentUid, setCurrentUid] = useState<string>();

  const fetchHistory = useCallback(
    async (params: ISearch, sort: ISearch) => {
      const newData = {
        ...params,
        ...sort,
        ui_case_Id: currentCaseId,
      };
      const { code, data } = await pageResult(newData);
      if (code === 0) {
        return {
          data: data.items,
          total: data.pageInfo.total,
          success: true,
          pageSize: data.pageInfo.page,
          current: data.pageInfo.limit,
        };
      } else {
        return {
          success: false,
        };
      }
    },
    [currentCaseId],
  );
  const columns: ProColumns<IUIResult>[] = [
    {
      title: 'uid',
      dataIndex: 'uid',
      valueType: 'text',
      copyable: true,
      hideInSearch: currentCaseId !== undefined,
      width: '10%',
    },
    {
      title: '用例名称',
      dataIndex: 'ui_case_name',
      hideInSearch: currentCaseId !== undefined,
      valueType: 'text',
      render: (_, record) => {
        if (currentCaseId !== undefined) {
          return record.ui_case_name;
        } else {
          return (
            <a
              onClick={() => {
                history.push(`/ui/case/detail/caseId=${record.ui_case_Id}`);
              }}
            >
              {record.ui_case_name}
            </a>
          );
        }
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
                setCurrentUid(record.uid);
                setOpen(true);
              }}
            >
              详情
            </a>
          );
        }
      },
    },
  ];

  return (
    <ProCard bodyStyle={{ height: 'auto' }}>
      <MyDrawer name={'测试详情'} open={open} width={'80%'} setOpen={setOpen}>
        <UiResultInfo currentUid={currentUid} />
      </MyDrawer>
      <MyProTable
        rowKey={'uid'}
        headerTitle={currentCaseId !== undefined ? '' : '用例历史'}
        columns={columns}
        request={fetchHistory}
      />
    </ProCard>
  );
};

export default Index;
