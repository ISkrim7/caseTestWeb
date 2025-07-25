import {
  copyInterApiById,
  outPutInter2Yaml,
  pageInterApi,
  removeInterApiById,
} from '@/api/inter';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { pageData } from '@/utils/somefunc';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef } from 'react';
import { history } from 'umi';

interface SelfProps {
  currentProjectId?: number;
  currentModuleId?: number;
  perKey: string;
}

const Index: FC<SelfProps> = ({
  currentModuleId,
  currentProjectId,
  perKey,
}) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

  useEffect(() => {
    actionRef.current?.reload();
  }, [currentModuleId, currentProjectId]);

  const fetchInterface = useCallback(
    async (params: any, sort: any) => {
      const { code, data } = await pageInterApi({
        ...params,
        module_id: currentModuleId,
        module_type: ModuleEnum.API,
        //只查询公共api
        is_common: 1,
        sort: sort,
      });
      return pageData(code, data);
    },
    [currentModuleId],
  );
  const columns: ProColumns<IInterfaceAPI>[] = [
    {
      title: '接口编号',
      dataIndex: 'uid',
      key: 'uid',
      fixed: 'left',
      width: '12%',
      copyable: true,
      render: (_, record) => {
        return <Tag color={'blue'}>{record.uid}</Tag>;
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: '方法',
      dataIndex: 'method',
      valueType: 'select',
      key: 'method',
      valueEnum: CONFIG.API_METHOD_ENUM,
      search: false,
      filters: true,
      onFilter: true,
      render: (_, record) => {
        return <Tag color={'blue'}>{record.method}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'level',
      key: 'level',
      valueType: 'select',
      valueEnum: CONFIG.API_LEVEL_ENUM,
      search: false,
      filters: true,
      onFilter: true,
      render: (_, record) => {
        return <Tag color={'blue'}>{record.level}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      key: 'status',
      search: false,
      filters: true,
      onFilter: true,
      valueEnum: CONFIG.API_STATUS_ENUM,
      render: (_, record) => {
        return CONFIG.API_STATUS_ENUM[record.status].tag;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      key: 'creatorName',
      render: (_, record) => {
        return <Tag color={'orange'}>{record.creatorName}</Tag>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: '14%',
      fixed: 'right',
      render: (_, record) => [
        <a
          onClick={() => {
            history.push(`/interface/interApi/detail/interId=${record.id}`);
          }}
        >
          详情
        </a>,
        <a
          onClick={async () => {
            const { code } = await copyInterApiById(record.id);
            if (code === 0) {
              actionRef.current?.reload();
            }
          }}
        >
          复制
        </a>,
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
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <MyProTable
      persistenceKey={perKey}
      columns={columns}
      rowKey={'id'}
      x={1000}
      actionRef={actionRef}
      request={fetchInterface}
      toolBarRender={() => [
        <Button
          type={'primary'}
          onClick={() => {
            /*window.open('/interface/interApi/detail');*/
            // 添加接口按钮修改（原 window.open 改为路由跳转）
            history.push({
              pathname: '/interface/interApi/detail',
              search: `?projectId=${currentProjectId?.toString()}&moduleId=${currentModuleId?.toString()}`,
            });
          }}
        >
          <PlusOutlined />
          添加接口
        </Button>,
        <Button
          type={'primary'}
          onClick={async () => {
            if (currentModuleId) {
              await outPutInter2Yaml(currentModuleId);
            } else {
              message.warning('请选择模块');
            }
          }}
        >
          <DownOutlined />
          接口导出
        </Button>,
      ]}
    />
  );
};

export default Index;
