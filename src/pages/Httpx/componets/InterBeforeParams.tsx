import ApiVariableFunc from '@/pages/Httpx/componets/ApiVariableFunc';
import {
  FormEditableOnValueChange,
  FormEditableOnValueRemove,
} from '@/pages/Httpx/componets/FormEditableOnValueChange';
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
      title: 'Key',
      dataIndex: 'key',
      width: '30%',
      render: (_, record) => <Text strong>{record.key}</Text>,
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: 'Key 必填',
          },
        ],
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '30%',
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: 'value 必填',
          },
        ],
      },
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
                  setValue={(index, newData) => {
                    editorFormRef.current?.setRowData?.(index, newData);
                    // 更新表单数据
                    form.setFieldsValue({
                      before_params: form
                        .getFieldValue('before_params')
                        .map((item: any) =>
                          item.id === index
                            ? { ...item, value: newData.value }
                            : item,
                        ),
                    });
                  }}
                />
              ),
              value: record?.value,
            }}
          />
        );
      },
    },
    {
      title: 'Desc',
      dataIndex: 'desc',
      width: '20%',
    },
    {
      title: 'Opt',
      valueType: 'option',
      width: '20%',
      render: (_, record, __, action) => {
        return [
          <a
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>,
        ];
      },
    },
  ];

  return (
    <ProCard>
      <ProForm form={form} disabled={false} submitter={false}>
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
              onDelete: async (key) => {
                await FormEditableOnValueRemove(form, 'before_params', key);
              },
              onChange: setBeforeParamsEditableRowKeys,
              onSave: async () => {
                await FormEditableOnValueChange(form, 'before_params');
              },
              actionRender: (row, _, dom) => {
                return [dom.save, dom.cancel, dom.delete];
              },
            }}
          />
        </ProForm.Item>
      </ProForm>
    </ProCard>
  );
};

export default InterBeforeParams;
