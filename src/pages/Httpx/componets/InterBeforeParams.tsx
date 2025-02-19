import ApiVariableFunc from '@/pages/Httpx/componets/ApiVariableFunc';
import { IBeforeParams, IInterfaceAPI } from '@/pages/Httpx/types';
import {
  EditableFormInstance,
  EditableProTable,
  ProCard,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { FormInstance, Tag, Typography } from 'antd';
import React, { FC, useRef, useState } from 'react';

const { Text } = Typography;

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterBeforeParams: FC<SelfProps> = ({ form, mode }) => {
  const [beforeParamsEditableKeys, setBeforeParamsEditableRowKeys] =
    useState<React.Key[]>();
  const editorFormRef = useRef<EditableFormInstance<IBeforeParams>>();
  const beforeColumns: ProColumns<IBeforeParams>[] = [
    {
      title: '变量名',
      dataIndex: 'key',
      render: (_, record) => <Text strong>{record.key}</Text>,
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
      renderFormItem: (_, { record }) => {
        return (
          <ProFormText
            noStyle
            name={'value'}
            fieldProps={{
              suffix: (
                <ApiVariableFunc
                  value={record?.value}
                  index={record?.id}
                  setValue={editorFormRef.current?.setRowData}
                />
              ),
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
      render: (text, record, _, action) => {
        return (
          <>
            {mode !== 1 ? (
              <a
                onClick={() => {
                  action?.startEditable?.(record.id);
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
            editableFormRef={editorFormRef}
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
                return [dom.delete];
              },
            }}
          />
        </ProForm.Item>
      </ProForm>
    </ProCard>
  );
};

export default InterBeforeParams;
