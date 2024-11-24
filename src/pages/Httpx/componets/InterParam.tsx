import { IInterfaceAPI, IParams } from '@/pages/Interface/types';
import {
  EditableProTable,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { FormInstance, Mentions } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterParam: FC<SelfProps> = ({ form, mode }) => {
  const [paramsEditableKeys, setParamsEditableRowKeys] =
    useState<React.Key[]>();

  const columns: ProColumns<IParams>[] = [
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
      renderFormItem: (_, { record }) => {
        if (record?.value?.includes('{{') && record.value?.includes('}}')) {
          return (
            <Mentions
              allowClear
              prefix={['{{']}
              value={record?.value}
              options={[]}
              style={{ color: 'orange' }}
              className={'ant_input'}
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
                  setParamsEditableRowKeys([record.id]);
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
      <ProForm.Item name={'params'} trigger={'onValuesChange'}>
        <EditableProTable<IParams>
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
              return [dom.delete, dom.cancel];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};

export default InterParam;
