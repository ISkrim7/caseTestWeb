import {
  pageInterApiNoModule,
  pageInterApiNoPart,
  removeInterApiById, setInterApisModule,
  setInterApisPart,
} from '@/api/inter';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { fetchCaseParts } from '@/pages/Play/componets/someFetch';
import { CasePartEnum } from '@/pages/Play/componets/uiTypes';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { fetchModulesEnum, pageData } from '@/utils/somefunc';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, Popconfirm, Space, Tag, TreeSelect } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { IModuleEnum } from '@/api';

interface SelfProps {
  currentProjectId?: number;
  perKey: string;
}

const Index: FC<SelfProps> = (props) => {
  const { currentProjectId, perKey } = props;
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [selectModuleId, setSelectModuleId] = useState<number>();
  useEffect(() => {
    if (currentProjectId) {
      actionRef.current?.reload();
      fetchModulesEnum(currentProjectId, ModuleEnum.API, setModuleEnum).then();
    }
  }, [currentProjectId]);

  const fetchInterface = useCallback(
    async (params: any, sort: any) => {
      const { code, data } = await pageInterApiNoModule({
        ...params,
        project_id: currentProjectId,
        //只查询公共api
        is_common: 1,
        sort: sort,
      });
      return pageData(code, data);
    },
    [currentProjectId],
  );
  const columns: ProColumns<IInterfaceAPI>[] = [
    {
      title: '接口编号',
      dataIndex: 'uid',
      key: 'uid',
      fixed: 'left',
      copyable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
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
      width: '10%',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <a
              onClick={() => {
                window.open(`/interface/interApi/detail/interId=${record.id}`);
              }}
            >
              详情
            </a>
            <Popconfirm
              title={'确认删除？'}
              okText={'确认'}
              cancelText={'点错了'}
              onConfirm={async () => {
                const { code } = await removeInterApiById(record.id);
                if (code === 0) {
                  actionRef.current?.reload();
                }
              }}
            >
              <Divider type={'vertical'} />
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const rowSelection: TableRowSelection<IInterfaceAPI> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  return (
    <MyProTable
      // @ts-ignore
      tableAlertOptionRender={() => (
        <Space wrap={true}>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select Part"
            fieldNames={{ label: 'title' }}
            allowClear
            filterTreeNode
            treeDefaultExpandAll
            onChange={(value: number) => {
              setSelectModuleId(value);
            }}
            treeData={moduleEnum}
          />
          <Button
            type={'primary'}
            onClick={async () => {
              if (selectModuleId && selectedRowKeys.length > 0) {
                const { code, msg } = await setInterApisModule({
                  module_id: selectModuleId,
                  interfaces: selectedRowKeys as number[],
                });
                if (code === 0) {
                  actionRef.current?.reload();
                  setSelectedRowKeys([]);
                  setSelectModuleId(undefined);
                }
              }
            }}
          >
            确认添加
          </Button>
        </Space>
      )}
      rowSelection={rowSelection}
      persistenceKey={perKey}
      columns={columns}
      rowKey={'id'}
      x={1000}
      actionRef={actionRef}
      request={fetchInterface}
    />
  );
};

export default Index;
