import { HeadersEnum } from '@/pages/Httpx/componets/APIEditEnum';
import { IHeaders, IInterfaceAPI } from '@/pages/Httpx/types';
import { EditableProTable, ProForm } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { FormInstance, Mentions, Select } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
}

const InterHeader: FC<SelfProps> = ({ form }) => {
  const [headersEditableKeys, setHeadersEditableRowKeys] =
    useState<React.Key[]>();
  const [headerData, setHeaderData] = useState<
    {
      value: string;
      text: any;
    }[]
  >([]);
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
      renderFormItem: (_, { record }) => {
        if (record?.value?.includes('{{') && record.value?.includes('}}')) {
          return (
            <Mentions
              prefix={['{{']}
              value={record?.value}
              style={{ color: 'orange' }}
              options={[]}
            />
          );
        }
        return <Mentions prefix={['{{']} value={record?.value} options={[]} />;
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
      render: (_: any, record: any) => {
        return (
          <a
            onClick={() => {
              setHeadersEditableRowKeys([record.id]);
            }}
          >
            编辑
          </a>
        );
      },
    },
  ];

  return (
    <ProForm form={form} submitter={false}>
      <ProForm.Item name={'headers'} trigger={'onValuesChange'}>
        <EditableProTable<IHeaders>
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
