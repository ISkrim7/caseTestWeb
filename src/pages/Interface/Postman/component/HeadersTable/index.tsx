import { HeadersEnum } from '@/pages/Interface/Postman/component/HeadersTable/HeadersEnum';
import { IHeaders, ISteps } from '@/pages/Interface/types';
import { EditableProTable, ProForm } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { FormInstance, Mentions, Select } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface SelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
  variables?: any;
}

const Index: FC<SelfProps> = ({ stepForm, stepInfo, variables }) => {
  const [headersDataSource, setHeadersDataSource] = useState<IHeaders[]>(
    stepInfo?.headers || [],
  );
  const [headersEditableKeys, setHeadersEditableRowKeys] = useState<
    React.Key[]
  >(headersDataSource.map((item) => item.id));

  const [headerData, setHeaderData] = useState<
    {
      value: string;
      text: any;
    }[]
  >([]);

  const [headerValue, setHeaderValue] = useState<string>();
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
  const handleHeaderChange = (newValue: string) => {
    setHeaderValue(newValue);
  };

  useEffect(() => {
    if (stepInfo) {
      setHeadersEditableRowKeys(stepInfo.headers?.map((item) => item.id) || []);
    }
  }, [stepInfo]);

  const headerColumns: ProColumns<IHeaders>[] = [
    {
      title: 'key',
      key: 'key',
      dataIndex: 'key',
      renderFormItem: () => {
        return (
          <Select
            showSearch
            value={headerValue}
            defaultActiveFirstOption={false}
            filterOption={false}
            onSearch={handleHeaderSearch}
            onChange={handleHeaderChange}
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
              options={variables}
            />
          );
        }
        return (
          <Mentions prefix={['{{']} value={record?.value} options={variables} />
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
    <ProForm form={stepForm} submitter={false}>
      <ProForm.Item name={'headers'} trigger={'onValuesChange'}>
        <EditableProTable<IHeaders>
          rowKey={'id'}
          toolBarRender={false}
          dataSource={headersDataSource}
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
            onChange: setHeadersEditableRowKeys,
            actionRender: (row, _, dom) => {
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};

export default Index;
