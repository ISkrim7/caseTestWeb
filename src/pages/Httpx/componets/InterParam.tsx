import ApiVariableFunc from '@/pages/Httpx/componets/ApiVariableFunc';
import SetKv2Query from '@/pages/Httpx/componets/setKv2Query';
import { IInterfaceAPI, IParams } from '@/pages/Httpx/types';
import {
  EditableFormInstance,
  EditableProTable,
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

const InterParam: FC<SelfProps> = ({ form, mode }) => {
  const [paramsEditableKeys, setParamsEditableRowKeys] =
    useState<React.Key[]>();
  const editorFormRef = useRef<EditableFormInstance<IParams>>();

  const columns: ProColumns<IParams>[] = [
    {
      title: 'key',
      dataIndex: 'key',
      render: (_, record) => <Text strong>{record.key}</Text>,
    },
    {
      title: 'value',
      dataIndex: 'value',
      render: (text, record) => {
        if (record?.value?.includes('{{$')) {
          return <Tag color={'orange'}>{text}</Tag>;
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
      title: 'desc',
      dataIndex: 'desc',
    },
    {
      title: 'opt',
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
    <ProForm form={form} submitter={false}>
      <SetKv2Query
        callBack={(resultArray: any) => {
          form.setFieldValue('params', resultArray);
          setParamsEditableRowKeys(
            resultArray.map((item: any) => item.id) || [],
          );
        }}
      />
      <ProForm.Item name={'params'} trigger={'onValuesChange'}>
        <EditableProTable<IParams>
          editableFormRef={editorFormRef}
          rowKey={'id'}
          toolBarRender={false}
          columns={columns}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            record: () => ({
              id: Date.now(),
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys: paramsEditableKeys,
            onChange: setParamsEditableRowKeys, // Update editable keys
            actionRender: (_, __, dom) => {
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};

export default InterParam;
