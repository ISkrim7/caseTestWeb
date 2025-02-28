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
import React, { FC, useEffect, useRef, useState } from 'react';

const { Text } = Typography;

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterParam: FC<SelfProps> = ({ form, mode }) => {
  const [paramsEditableKeys, setParamsEditableRowKeys] = useState<React.Key[]>(
    [],
  );
  const editorFormRef = useRef<EditableFormInstance<IParams>>();

  useEffect(() => {
    if (mode === 3) {
      setParamsEditableRowKeys(
        form.getFieldValue('params')?.map((item: any) => item.id),
      );
    } else {
      setParamsEditableRowKeys([]);
    }
  }, [mode]);

  const columns: ProColumns<IParams>[] = [
    {
      title: 'key',
      dataIndex: 'key',
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
                  setValue={(index, newData) => {
                    editorFormRef.current?.setRowData?.(index, newData);
                    // 更新表单数据
                    form.setFieldsValue({
                      params: form
                        .getFieldValue('params')
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
      title: 'desc',
      dataIndex: 'desc',
    },
    {
      title: 'opt',
      valueType: 'option',
      render: () => {
        return null;
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
