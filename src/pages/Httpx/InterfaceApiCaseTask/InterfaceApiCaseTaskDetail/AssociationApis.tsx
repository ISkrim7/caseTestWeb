import {
  queryAssociationApisByTaskId,
  removeAssociationApisByTaskId,
  reorderAssociationApisByTaskId,
} from '@/api/inter/interTask';
import MyDrawer from '@/components/MyDrawer';
import InterfaceCaseChoiceApiTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceCaseChoiceApiTable';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { CONFIG } from '@/utils/config';
import { history } from '@@/core/history';
import {
  ActionType,
  DragSortTable,
  ProColumns,
} from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Tag } from 'antd';
import { FC, useCallback, useRef, useState } from 'react';

interface IAssociationApisProps {
  currentTaskId?: string;
}

const AssociationApis: FC<IAssociationApisProps> = ({ currentTaskId }) => {
  const actionRef = useRef<ActionType>();
  const [choiceApiOpen, setChoiceApiOpen] = useState<boolean>(false);
  const queryApisByTask = useCallback(async () => {
    if (currentTaskId) {
      const { code, data } = await queryAssociationApisByTaskId(currentTaskId);
      if (code === 0) {
        return {
          data: data,
          total: data.length,
          success: true,
        };
      }
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  }, [currentTaskId]);
  const handleDragSortEnd = async (
    _: number,
    __: number,
    newDataSource: IInterfaceAPI[],
  ) => {
    const reorderIds: number[] = newDataSource.map((item) => item.id);
    console.log('排序后的数据', newDataSource);
    if (currentTaskId) {
      const { code, msg } = await reorderAssociationApisByTaskId({
        taskId: currentTaskId,
        apiIds: reorderIds,
      });
      if (code === 0) {
        // 请求成功之后刷新列表
        actionRef.current?.reload();
        message.success(msg);
      }
    }
  };

  const columns: ProColumns<IInterfaceAPI>[] = [
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '接口编号',
      dataIndex: 'uid',
      key: 'uid',
      copyable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => <Tag color={'success'}>{record.name}</Tag>,
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: CONFIG.API_LEVEL_ENUM,
      render: (_, record) => {
        return <Tag color={'blue'}>{record.level}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.API_STATUS_ENUM,
      render: (_, record) => {
        return CONFIG.API_STATUS_ENUM[record.status].tag;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      render: (_, record) => {
        return <Tag>{record.creatorName}</Tag>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <a
              onClick={() => {
                history.push(`/interface/interApi/detail/interId=${record.id}`);
              }}
            >
              详情
            </a>
            <Divider type={'vertical'} />
            <Popconfirm
              title={'确认删除？'}
              okText={'确认'}
              cancelText={'点错了'}
              onConfirm={async () => {
                if (currentTaskId) {
                  const { code } = await removeAssociationApisByTaskId({
                    taskId: currentTaskId,
                    apiId: record.id,
                  });
                  if (code === 0) {
                    actionRef.current?.reload();
                  }
                }
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <>
      <MyDrawer name={''} open={choiceApiOpen} setOpen={setChoiceApiOpen}>
        <InterfaceCaseChoiceApiTable
          currentTaskId={currentTaskId}
          refresh={actionRef.current?.reload}
        />
      </MyDrawer>
      <DragSortTable
        toolBarRender={() => [
          <Button type={'primary'} onClick={() => setChoiceApiOpen(true)}>
            Choice Apis
          </Button>,
        ]}
        actionRef={actionRef}
        // @ts-ignore
        columns={columns}
        rowKey="id"
        search={false}
        pagination={{
          showQuickJumper: true,
          defaultPageSize: 10,
          showSizeChanger: true,
        }} // @ts-ignore
        request={queryApisByTask}
        dragSortKey="sort"
        onDragSortEnd={handleDragSortEnd}
      />
    </>
  );
};

export default AssociationApis;
