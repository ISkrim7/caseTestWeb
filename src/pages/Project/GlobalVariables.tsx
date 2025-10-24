import {
  pageInterGlobalVariable,
  removeInterGlobalVariable,
  updateInterGlobalVariable,
} from '@/api/inter/interGlobal';
import { queryProjectEnum } from '@/components/CommonFunc';
import MyProTable from '@/components/Table/MyProTable';
import VarModalForm from '@/pages/Httpx/InterfaceConfig/VarModalForm';
import { IInterfaceGlobalVariable } from '@/pages/Httpx/types';
import { pageData } from '@/utils/somefunc';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProCard, ProColumns } from '@ant-design/pro-components';
import { Button, message, Space, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useAccess } from 'umi';

interface IProps {
  projectId?: string;
}

const GlobalVariables: FC<IProps> = ({ projectId }) => {
  const { isAdmin } = useAccess();
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectEnum, setProjectEnum] = useState<any>([]);
  useEffect(() => {
    queryProjectEnum(setProjectEnum).then();
  }, []);

  const columns: ProColumns<IInterfaceGlobalVariable>[] = [
    {
      title: 'Key',
      dataIndex: 'key',
      copyable: true,
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      copyable: true,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: 'desc',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: 'creatorName',
      editable: false,
      dataIndex: 'creatorName',
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },

    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      render: (__, record, _, action) => {
        return (
          isAdmin && (
            <Space>
              <a
                onClick={async () => {
                  action?.startEditable?.(record.uid);
                }}
              >
                编辑
              </a>
              <a
                onClick={async () => {
                  await removeInterGlobalVariable(record.uid).then(
                    ({ code, msg }) => {
                      if (code === 0) {
                        message.success(msg);
                        actionRef.current?.reload();
                      }
                    },
                  );
                }}
              >
                删除
              </a>
            </Space>
          )
        );
      },
    },
  ];

  const fetchInterApiVariables = useCallback(async (values: any, sort: any) => {
    const { code, data } = await pageInterGlobalVariable({
      ...values,
      sort: sort,
      project_id: projectId,
    });
    return pageData(code, data);
  }, []);

  const setInterApiVariables = async (
    _: any,
    values: IInterfaceGlobalVariable,
  ) => {
    const { code, msg } = await updateInterGlobalVariable(values);
    if (code === 0) {
      actionRef.current?.reload();
      message.success(msg);
    }
  };

  return (
    <ProCard>
      <VarModalForm
        open={isModalOpen}
        setOpen={setIsModalOpen}
        callBack={() => actionRef.current?.reload()}
      />
      <MyProTable
        actionRef={actionRef}
        columns={columns}
        request={fetchInterApiVariables}
        x={1000}
        toolBarRender={() => [
          <Button type={'primary'} onClick={() => setIsModalOpen(true)}>
            <PlusOutlined />
            添加变量
          </Button>,
        ]}
        rowKey={'uid'}
        onSave={setInterApiVariables}
      />
    </ProCard>
  );
};

export default GlobalVariables;
