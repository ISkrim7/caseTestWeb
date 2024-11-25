import { asyncTryInterApi, pageInterApi } from '@/api/inter';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPI } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Tag } from 'antd';
import { useCallback } from 'react';
import { history } from 'umi';

const Index = () => {
  const columns: ProColumns<IInterfaceAPI>[] = [
    {
      title: '接口编号',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: CONFIG.API_LEVEL_ENUM,
      render: (text, record) => {
        return <Tag>{record.level}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.CASE_STATUS_ENUM,
      render: (text, record) => {
        return <Tag>{record.status}</Tag>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _) => {
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
            <a
              onClick={async () => {
                await asyncTryInterApi({ id: record.id }).then(
                  ({ code, msg }) => {
                    if (code === 0) {
                      message.success(msg);
                    }
                  },
                );
              }}
            >
              执行
            </a>
            <Divider type={'vertical'} />
            <a>复制</a>

            <Popconfirm
              title={'确认删除？'}
              okText={'确认'}
              cancelText={'点错了'}
              onConfirm={async () => {}}
            >
              <Divider type={'vertical'} />

              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const fetchInterface = useCallback(async (params: any, sort: any) => {
    const searchData = { ...params, sort: sort };
    const { code, data } = await pageInterApi(searchData);
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
  }, []);
  return (
    <>
      <MyProTable
        columns={columns}
        rowKey={'id'}
        request={fetchInterface}
        toolBarRender={() => [
          <Button
            onClick={() => {
              history.push('/interface/interApi/detail');
            }}
          >
            添加
          </Button>,
        ]}
      />
    </>
  );
};

export default Index;
