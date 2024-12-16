import { pageInterApiResult } from '@/api/inter/interCase';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import InterfaceApiResponseDetail from '@/pages/Httpx/InterfaceApiResponse/InterfaceApiResponseDetail';
import { ITryResponseInfo } from '@/pages/Httpx/types';
import { ActionType, ProCard, ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { FC, useCallback, useRef, useState } from 'react';

interface SelfProps {
  taskResultId?: number | string;
}

const InterfaceApiResultTable: FC<SelfProps> = ({ taskResultId }) => {
  const [open, setOpen] = useState(false);
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [responseInfo, setResponseInfo] = useState<ITryResponseInfo[]>();
  const fetchResults = useCallback(
    async (params: any, sort: any) => {
      const searchData = {
        ...params,
        //只查询公共api
        interface_task_result_Id: taskResultId,
        sort: sort,
      };
      const { code, data } = await pageInterApiResult(searchData);
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
    [taskResultId],
  );

  const columns: ProColumns<ITryResponseInfo>[] = [
    {
      title: '结果uid',
      dataIndex: 'interfaceID',
      render: (_, record) => <Tag color={'blue'}>{record.uid}</Tag>,
    },
    {
      title: '执行用例',
      dataIndex: 'interfaceName',
      render: (_, record) => <Tag color={'blue'}>{record.interfaceName}</Tag>,
    },

    {
      title: '测试结果',
      dataIndex: 'result',
      valueType: 'select',
      valueEnum: { SUCCESS: { text: '成功' }, ERROR: { text: '失败' } },
      render: (_, record) => (
        <Tag color={record.result === 'SUCCESS' ? 'green' : 'warning'}>
          {record.result}
        </Tag>
      ),
    },
    {
      title: '执行人',
      dataIndex: 'starterName',
      key: 'starterId',
      render: (_, record) => <Tag color={'blue'}>{record.starterName}</Tag>,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setResponseInfo([record]);
              setOpen(true);
            }}
          >
            详情
          </a>
        </>
      ),
    },
  ];
  return (
    <ProCard bordered={false}>
      <MyDrawer name={''} open={open} setOpen={setOpen}>
        <InterfaceApiResponseDetail responses={responseInfo} />
      </MyDrawer>
      <MyProTable
        rowKey={'uid'}
        actionRef={actionRef}
        request={fetchResults}
        search={false}
        pagination={{
          showQuickJumper: true,
          defaultPageSize: 6,
          showSizeChanger: true,
        }}
        columns={columns}
        x={1000}
      />
    </ProCard>
  );
};

export default InterfaceApiResultTable;
