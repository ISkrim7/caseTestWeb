import {
  pageInterCaseResult,
  removeCaseAPIResult,
  removeCaseAPIResults,
} from '@/api/inter/interCase';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import InterfaceApiCaseResultDrawer from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultDrawer';
import { IInterfaceCaseResult } from '@/pages/Interface/types';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Tag } from 'antd';
import { FC, useCallback, useRef, useState } from 'react';

interface SelfProps {
  apiCaseId?: number | string;
}

const InterfaceApiCaseResultTable: FC<SelfProps> = (props) => {
  const { apiCaseId } = props;
  const [open, setOpen] = useState(false);
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [currentCaseResultId, setCurrentCaseResultId] = useState<number>();
  const fetchResults = useCallback(
    async (params: any, sort: any) => {
      const searchData = {
        ...params,
        //只查询公共api
        interfaceCaseID: apiCaseId,
        sort: sort,
      };
      const { code, data } = await pageInterCaseResult(searchData);
      if (code === 0) {
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
    [apiCaseId],
  );
  const columns: ProColumns<IInterfaceCaseResult>[] = [
    {
      title: '用例ID',
      dataIndex: 'interfaceCaseUid',
      hidden: true,
    },
    {
      title: '执行用例',
      dataIndex: 'interfaceCaseName',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '测试结果',
      dataIndex: 'result',
      valueType: 'select',
      valueEnum: { SUCCESS: { text: '成功' }, ERROR: { text: '失败' } },
    },
    {
      title: '执行人',
      dataIndex: 'starterName',
      key: 'starterId',
      render: (_, record) => <Tag color={'blue'}>{record.starterName}</Tag>,
    },
    {
      title: '执行时间',
      dataIndex: 'create_time',
      render: (_, record) => <Tag color={'blue'}>{record.create_time}</Tag>,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setCurrentCaseResultId(record.id);
              setOpen(true);
            }}
          >
            详情
          </a>
          <Divider type={'vertical'} />
          <a onClick={async () => removeCaseResult(record.uid)}>删除</a>
        </>
      ),
    },
  ];
  const removeCaseResult = async (caseResultUid: string) => {
    const { code, msg } = await removeCaseAPIResult(caseResultUid);
    if (code === 0) {
      message.success(msg);
      actionRef.current?.reload();
    }
  };
  const removeCaseResults = async () => {
    if (apiCaseId) {
      const { code, msg } = await removeCaseAPIResults(apiCaseId);
      if (code === 0) {
        message.success(msg);
        actionRef.current?.reload();
      }
    }
  };

  const RemoveAllButton = (
    <>
      <Button type={'primary'} onClick={removeCaseResults}>
        Remove All
      </Button>
    </>
  );
  return (
    <div style={{ marginTop: 20 }}>
      <MyDrawer name={''} open={open} setOpen={setOpen}>
        <InterfaceApiCaseResultDrawer
          currentCaseResultId={currentCaseResultId}
        />
      </MyDrawer>
      <MyProTable
        rowKey={'uid'}
        actionRef={actionRef}
        request={fetchResults}
        search={false}
        toolBarRender={() => [RemoveAllButton]}
        pagination={{
          showQuickJumper: true,
          defaultPageSize: 6,
          showSizeChanger: true,
        }}
        columns={columns}
        x={1000}
      />
    </div>
  );
};

export default InterfaceApiCaseResultTable;
