import { queryInterfaceGroupApis } from '@/api/inter/interGroup';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { CONFIG } from '@/utils/config';
import { queryData } from '@/utils/somefunc';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { FC, useCallback, useRef } from 'react';
import { history } from 'umi';

interface SelfProps {
  groupId: number;
}

const GroupInterfaceTable: FC<SelfProps> = (props) => {
  const { groupId } = props;
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const fetchInterface = useCallback(async () => {
    if (groupId) {
      const { code, data } = await queryInterfaceGroupApis(groupId);
      return queryData(code, data);
    }
  }, [groupId]);
  const columns: ProColumns<IInterfaceAPI>[] = [
    {
      title: '接口编号',
      dataIndex: 'uid',
      key: 'uid',
      fixed: 'left',
      width: '10%',
      render: (_, record) => {
        return (
          <a
            onClick={() =>
              //window.open(`/interface/interApi/detail/interId=${record.id}`)
              // 添加接口按钮修改（原 window.open 改为路由跳转）
              history.push(`/interface/interApi/detail/interId=${record.id}`)
            }
          >
            {record.uid}
          </a>
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: '15%',
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: CONFIG.API_LEVEL_ENUM,
      width: '10%',
      render: (_, record) => {
        return <Tag color={'blue'}>{record.level}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      width: '10%',
      valueEnum: CONFIG.API_STATUS_ENUM,
      render: (_, record) => {
        return CONFIG.API_STATUS_ENUM[record.status].tag;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      width: '10%',
      render: (_, record) => {
        return <Tag>{record.creatorName}</Tag>;
      },
    },
  ];

  return (
    <>
      <MyProTable
        columns={columns}
        search={false}
        rowKey={'id'}
        x={1000}
        actionRef={actionRef}
        request={fetchInterface}
      />
    </>
  );
};

export default GroupInterfaceTable;
