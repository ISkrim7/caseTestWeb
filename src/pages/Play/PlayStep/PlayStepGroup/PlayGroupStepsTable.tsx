import { queryPlayGroupSubSteps } from '@/api/play/playCase';
import MyProTable from '@/components/Table/MyProTable';
import { IUICaseSteps } from '@/pages/Play/componets/uiTypes';
import { ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface Props {
  groupId: number;
  groupName: string;
}

const PlayGroupStepsTable: FC<Props> = ({ groupId, groupName }) => {
  const [subSteps, setSubSteps] = useState<IUICaseSteps[]>([]);

  useEffect(() => {
    if (groupId) {
      queryPlayGroupSubSteps(groupId).then(async ({ code, data }) => {
        if (code === 0) {
          setSubSteps(data);
        }
      });
    }
  }, [groupId]);
  const columns: ProColumns<IUICaseSteps>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      ellipsis: true,
      width: '20%',
      render: (_, record) => {
        return <Tag color={'blue'}>{record.method}</Tag>;
      },
    },
  ];
  return (
    <MyProTable
      headerTitle={
        <a
          onClick={() => {
            window.open(`/ui/group/detail/groupId=${groupId}`);
          }}
        >
          {groupName}
        </a>
      }
      columns={columns}
      search={false}
      rowKey={'id'}
      dataSource={subSteps}
    />
  );
};

export default PlayGroupStepsTable;
