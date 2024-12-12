import { FormDataTypeEnum } from '@/pages/Httpx/componets/APIEditEnum';
import { IFromData, IInterfaceAPI } from '@/pages/Interface/types';
import {
  EditableProTable,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { FormInstance } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const FormData: FC<SelfProps> = ({ form, mode }) => {
  const [dataEditableKeys, setDataEditableRowKeys] = useState<React.Key[]>();
  const [formDataType, setFormDataType] = useState<
    {
      value: string;
      text: any;
    }[]
  >([]);
  const handleHeaderSearch = (newValue: string) => {
    if (newValue) {
      const filteredOptions = Object.keys(FormDataTypeEnum)
        .filter((item) =>
          FormDataTypeEnum[item].text
            .toLowerCase()
            .includes(newValue.toLowerCase()),
        )
        .map((key) => ({ value: key, text: FormDataTypeEnum[key].text }));
      setFormDataType(
        filteredOptions.length > 0
          ? filteredOptions
          : [{ value: newValue, text: newValue }],
      );
    } else {
      setFormDataType([]);
    }
  };
  const columns: ProColumns<IFromData>[] = [
    {
      title: 'key',
      key: 'key',
      dataIndex: 'key',
      width: '30%',
      renderFormItem: (_, { record }) => {
        return (
          <ProFormText
            name={'key'}
            noStyle={true}
            fieldProps={{ value: record?.key }}
          />
        );
      },
    },
    {
      title: 'value',
      key: 'value',
      dataIndex: 'value',
      width: '30%',
    },
    {
      title: 'content-type',
      key: 'content_type',
      dataIndex: 'content_type',
      width: '30%',
      valueType: 'select',
      valueEnum: FormDataTypeEnum,
      // renderFormItem: () => {
      //   return (
      //     <Select
      //       showSearch
      //       defaultActiveFirstOption={false}
      //       filterOption={true}
      //       onSearch={handleHeaderSearch}
      //       notFoundContent={null}
      //       options={(formDataType).map((d) => ({
      //         value: d.value,
      //         label: d.text,
      //       }))}
      //     />
      //   );
      // }
    },
    {
      title: 'desc',
      key: 'desc',
      dataIndex: 'desc',
      width: '30%',
    },
    {
      title: 'opt',
      valueType: 'option',
      render: (_: any, record: any) => {
        return (
          <>
            {mode !== 1 ? (
              <a
                onClick={() => {
                  setDataEditableRowKeys([record.id]);
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
    <ProForm.Item name={'params'} trigger={'onValuesChange'}>
      <EditableProTable<IFromData>
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
          editableKeys: dataEditableKeys,
          onChange: setDataEditableRowKeys, // Update editable keys
          actionRender: (_, __, dom) => {
            return [dom.save, dom.delete, dom.cancel];
          },
        }}
      />
    </ProForm.Item>
  );
};

export default FormData;
