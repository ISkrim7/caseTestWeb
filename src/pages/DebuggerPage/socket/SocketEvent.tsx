import {
  EditableFormInstance,
  EditableProTable,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Tag } from 'antd';
import React, { FC, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface ISocketEventProps {
  event: string;
  listen: boolean;
  desc?: string;
}

interface SelfProps {
  socket: Socket | null;
}

const SocketEvent: FC<SelfProps> = ({ socket }) => {
  const [dataSource, setDataSource] = React.useState<
    readonly ISocketEventProps[]
  >([]);
  const [eventEditableRowKeys, setEventEditableRowKeys] =
    useState<React.Key[]>();
  const editorFormRef = useRef<EditableFormInstance<ISocketEventProps>>();

  const columns: ProColumns<ISocketEventProps>[] = [
    {
      title: '事件名',
      dataIndex: 'event',
      key: 'event',
      width: '40%',
      render: (text: any, record: any, index: number) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '监听',
      dataIndex: 'listen',
      key: 'listen',
      valueType: 'switch',
      width: '20%',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      width: '40%',
    },
  ];
  return (
    <EditableProTable<ISocketEventProps>
      editableFormRef={editorFormRef}
      dataSource={dataSource}
      rowKey={'id'}
      columns={columns}
      recordCreatorProps={{
        newRecordType: 'dataSource',
        record: () => ({
          id: Date.now(),
        }),
      }}
      onChange={setDataSource}
      editable={{
        type: 'multiple',
        editableKeys: eventEditableRowKeys,
        onChange: setEventEditableRowKeys,
      }}
    />
  );
};

export default SocketEvent;
