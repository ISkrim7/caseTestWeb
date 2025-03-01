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
import React, { FC, useEffect, useRef, useState } from 'react';

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
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: 'Opt',
      valueType: 'option',
      render: () => {
        return null;
      },
    },
  ];
  useEffect(() => {
    if (mode === 3) {
      setBeforeParamsEditableRowKeys(
        form.getFieldValue('before_params')?.map((item: any) => item.id),
      );
    } else {
      setBeforeParamsEditableRowKeys([]);
    }
  }, [mode]);
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
