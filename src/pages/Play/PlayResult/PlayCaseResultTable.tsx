import { clearUICaseResult, pageDebugResult } from '@/api/play/result';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import PlayCaseResultDetail from '@/pages/Play/PlayResult/PlayCaseResultDetail';
import { IUIResult } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { pageData } from '@/utils/somefunc';
import { history } from '@@/core/history';
import { ActionType, ProCard, ProColumns } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { FC, useCallback, useRef, useState } from 'react';

interface PlayDebugResultProps {
  caseId?: number;
}

const PlayCaseResultTable: FC<PlayDebugResultProps> = ({ caseId }) => {
  const [currentUid, setCurrentUid] = useState<string>();
  const [open, setOpen] = useState(false);
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

  const fetchDebugResult = useCallback(
    async (params: any) => {
      const { code, data } = await pageDebugResult({
        ...params,
        caseId: caseId,
      });
      return pageData(code, data);
    },
    [caseId],
  );

  const columns: ProColumns<IUIResult>[] = [
    {
      title: 'uid',
      dataIndex: 'uid',
      valueType: 'text',
      copyable: true,
      hideInSearch: caseId !== undefined,
      width: '10%',
    },
    {
      title: '用例名称',
      dataIndex: 'ui_case_name',
      hideInSearch: caseId !== undefined,
      valueType: 'text',
      render: (_, record) => {
        if (caseId !== undefined) {
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
      title: '开始时间',
      dataIndex: 'start_time',
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
      dataIndex: 'starter_name',
      valueType: 'text',
      hideInSearch: true,
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
    <ProCard
      title={'DeBug His'}
      bordered={true}
      defaultCollapsed={true}
      style={{ marginTop: 200, height: 'auto' }}
      collapsible={true}
      extra={
        <Button
          type={'primary'}
          onClick={async () => {
            if (caseId) {
              clearUICaseResult({ caseId: caseId }).then(({ code, msg }) => {
                if (code === 0) {
                  message.success(msg);
                  actionRef.current?.reload();
                }
              });
            }
          }}
        >
          Clear All His
        </Button>
      }
    >
      <MyDrawer name={'测试详情'} open={open} width={'80%'} setOpen={setOpen}>
        <PlayCaseResultDetail resultId={currentUid} />
      </MyDrawer>
      <MyProTable
        rowKey={'uid'}
        actionRef={actionRef}
        x={1000}
        columns={columns}
        request={fetchDebugResult}
      />
    </ProCard>
  );
};

export default PlayCaseResultTable;
