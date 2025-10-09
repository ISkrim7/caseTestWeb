import { HeadersEnum } from '@/pages/Httpx/componets/APIEditEnum';
import ApiVariableFunc from '@/pages/Httpx/componets/ApiVariableFunc';
import {
  FormEditableOnValueChange,
  FormEditableOnValueRemove,
} from '@/pages/Httpx/componets/FormEditableOnValueChange';
import { IHeaders, IInterfaceAPI } from '@/pages/Httpx/types';
import {
  EditableFormInstance,
  EditableProTable,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { FormInstance, Modal, Select, Tag } from 'antd';
import React, { FC, useRef, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  readonly?: boolean;
}

const InterHeader: FC<SelfProps> = ({ form, readonly = false }) => {
  const [headersEditableKeys, setHeadersEditableRowKeys] =
    useState<React.Key[]>();
  const [headerData, setHeaderData] = useState<
    {
      value: string;
      text: any;
    }[]
  >([]);
  const editorFormRef = useRef<EditableFormInstance<IHeaders>>();

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
      title: 'Key',
      key: 'key',
      dataIndex: 'key',
      fixed: 'left',
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: 'Key 必填',
          },
        ],
      },
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
      title: 'Value',
      key: 'value',
      dataIndex: 'value',
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: 'Value 必填',
          },
        ],
      },
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
      title: 'Desc',
      key: 'desc',
      dataIndex: 'desc',
    },
    {
      title: 'Opt',
      valueType: 'option',
      fixed: 'right',
      render: (_, record, __, action) => {
        if (!readonly) {
          return (
            <a
              onClick={() => {
                action?.startEditable?.(record.id);
              }}
            >
              编辑
            </a>
          );
        }
      },
    },
  ];

  return (
    <>
      <ProForm.Item name={'headers'} trigger={'onValuesChange'}>
        <EditableProTable<IHeaders>
          editableFormRef={editorFormRef}
          rowKey={'id'}
          toolBarRender={false}
          columns={headerColumns}
          recordCreatorProps={
            !readonly && {
              newRecordType: 'dataSource',
              record: () => ({
                id: Date.now() + Math.random().toString(36).slice(2),
              }),
            }
          }
          editable={{
            type: 'multiple',
            editableKeys: headersEditableKeys,
            onChange: setHeadersEditableRowKeys, // Update editable keys
            //onSave: async () => {
            //  await FormEditableOnValueChange(form, 'headers');
            //},
            onSave: async (key, row) => {
              let newRow = { ...row };
              const trimmedKey = newRow.key?.trim();
              const trimmedValue = newRow.value?.trim();
              const hasWhitespace =
                newRow.key !== trimmedKey || newRow.value !== trimmedValue;
              if (hasWhitespace) {
                const confirmed = await new Promise((resolve) => {
                  Modal.confirm({
                    title: '提示',
                    content: '检测到首尾空格，是否自动去除？',
                    okText: '是',
                    cancelText: '否',
                    onOk: () => resolve(true),
                    onCancel: () => resolve(false),
                  });
                });
                if (confirmed) {
                  newRow = {
                    ...newRow,
                    key: trimmedKey,
                    value: trimmedValue,
                  };
                  // 正确使用row.id作为行唯一标识
                  editorFormRef.current?.setRowData?.(row.id, newRow);
                  // 同步更新表单数据
                  const headers = form.getFieldValue('headers') || [];
                  const newHeaders = headers.map((item: IHeaders) =>
                    item.id === row.id ? newRow : item,
                  );
                  form.setFieldsValue({ headers: newHeaders });
                }
              }
              await FormEditableOnValueChange(form, 'headers');
            },
            onDelete: async (key) => {
              await FormEditableOnValueRemove(form, 'headers', key);
            },
            actionRender: (_, __, dom) => {
              return [dom.save, dom.cancel, dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </>
  );
};

export default InterHeader;
