import ApiVariableFunc from '@/pages/Httpx/componets/ApiVariableFunc';
import { IBeforeParams, IInterfaceAPI } from '@/pages/Httpx/types';
import {
  EditableProTable,
  ProCard,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { FormInstance, Tag, Typography } from 'antd';
import React, { FC, useState } from 'react';

const { Text } = Typography;

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterBeforeParams: FC<SelfProps> = ({ form, mode }) => {
  const [beforeParamsEditableKeys, setBeforeParamsEditableRowKeys] =
    useState<React.Key[]>();
  const beforeColumns: ProColumns<IBeforeParams>[] = [
    {
      title: '变量名',
      dataIndex: 'key',
      render: (text, record) => <Text strong>{record.key}</Text>,
    },
    {
      title: '变量值',
      dataIndex: 'value',
      render: (text, record) => {
        if (record?.value?.includes('{{$')) {
          return <Tag color="orange">{text}</Tag>;
        } else {
          return <Tag color={'blue'}>{text}</Tag>;
        }
      },
      renderFormItem: (dom, { record }) => {
        return (
          <ProFormText
            noStyle
            name={'value'}
            fieldProps={{
              suffix: <ApiVariableFunc />,
              value: record?.value,
            }}
          />
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: 'Opt',
      valueType: 'option',
      render: (_: any, record: any) => {
        return (
          <>
            {mode !== 1 ? (
              <a
                onClick={() => {
                  setBeforeParamsEditableRowKeys([record.id]);
                }}
              >
                编辑
              </a>
            ) : null}
          </>
        );
      },
    },
  ];

  return (
    <ProCard>
      <ProForm form={form} submitter={false}>
        <ProForm.Item name={'before_params'} trigger={'onValuesChange'}>
          <EditableProTable<IBeforeParams>
            rowKey={'id'}
            search={false}
            columns={beforeColumns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              record: () => ({
                id: Date.now(),
              }),
            }}
            editable={{
              type: 'multiple',
              editableKeys: beforeParamsEditableKeys,
              onChange: setBeforeParamsEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.save, dom.delete, dom.cancel];
              },
            }}
          />
        </ProForm.Item>
      </ProForm>
    </ProCard>
  );
};

export default InterBeforeParams;
