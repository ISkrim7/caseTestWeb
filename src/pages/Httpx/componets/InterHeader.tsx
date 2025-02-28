import { HeadersEnum } from '@/pages/Httpx/componets/APIEditEnum';
import ApiVariableFunc from '@/pages/Httpx/componets/ApiVariableFunc';
import { IHeaders, IInterfaceAPI } from '@/pages/Httpx/types';
import {
  EditableFormInstance,
  EditableProTable,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { FormInstance, Select, Tag } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterHeader: FC<SelfProps> = ({ form, mode }) => {
  const [headersEditableKeys, setHeadersEditableRowKeys] =
    useState<React.Key[]>();
  const [headerData, setHeaderData] = useState<
    {
      value: string;
      text: any;
    }[]
  >([]);
  const editorFormRef = useRef<EditableFormInstance<IHeaders>>();
  useEffect(() => {
    if (mode === 3) {
      setHeadersEditableRowKeys(
        form.getFieldValue('headers')?.map((item: any) => item.id),
      );
    } else {
      setHeadersEditableRowKeys([]);
    }
  }, [mode]);
  const handleHeaderSearch = (newValue: string) => {
    if (newValue) {
      const filteredOptions = Object.keys(HeadersEnum)
        .filter((item) =>
          HeadersEnum[item].text.toLowerCase().includes(newValue.toLowerCase()),
        )
        .map((key) => ({ value: key, text: HeadersEnum[key].text }));
      setHeaderData(
        filteredOptions.length > 0
          ? filteredOptions
          : [{ value: newValue, text: newValue }],
      );
    } else {
      setHeaderData([]);
    }
  };
  const headerColumns: ProColumns<IHeaders>[] = [
    {
      title: 'key',
      key: 'key',
      dataIndex: 'key',
      fixed: 'left',
      renderFormItem: () => {
        return (
          <Select
            showSearch
            defaultActiveFirstOption={false}
            filterOption={true}
            onSearch={handleHeaderSearch}
            notFoundContent={null}
            options={(headerData || []).map((d) => ({
              value: d.value,
              label: d.text,
            }))}
          />
        );
      },
    },
    {
      title: 'value',
      key: 'value',
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
                      headers: form
                        .getFieldValue('headers')
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
      key: 'desc',
      dataIndex: 'desc',
    },
    {
      title: 'opt',
      valueType: 'option',
      fixed: 'right',
      render: () => {
        return null;
      },
    },
  ];

  return (
    <ProForm form={form} submitter={false}>
      <ProForm.Item name={'headers'} trigger={'onValuesChange'}>
        <EditableProTable<IHeaders>
          editableFormRef={editorFormRef}
          rowKey={'id'}
          toolBarRender={false}
          columns={headerColumns}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            record: () => ({
              id: Date.now(),
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys: headersEditableKeys,
            onChange: setHeadersEditableRowKeys, // Update editable keys
            actionRender: (_, __, dom) => {
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};

export default InterHeader;
