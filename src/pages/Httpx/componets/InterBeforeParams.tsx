import { IBeforeParams, IInterfaceAPI } from '@/pages/Interface/types';
import { EditableProTable, ProCard, ProForm } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { FormInstance } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}
const InterBeforeParams: FC<SelfProps> = ({ form, mode }) => {
  const [beforeParamsEditableKeys, setBeforeParamsEditableRowKeys] =
    useState<React.Key[]>();
  const beforeColumns: ProColumns[] = [
    {
      title: '变量名',
      dataIndex: 'key',
    },
    {
      title: '变量值',
      dataIndex: 'value',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: 'Opt',
      valueType: 'option',
      render: (_: any, record: any) => {
        return (
          <>
            {mode !== 1 ? (
              <a
                onClick={() => {
                  setBeforeParamsEditableRowKeys([record.id]);
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
    <ProCard>
      <ProForm form={form} submitter={false}>
        <ProForm.Item name={'beforeParams'} trigger={'onValuesChange'}>
          <EditableProTable<IBeforeParams>
            rowKey={'id'}
            search={false}
            // toolBarRender={() => [searchVariableButton]}
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
                return [dom.save, dom.delete, dom.cancel];
              },
            }}
          />
        </ProForm.Item>
      </ProForm>
    </ProCard>
  );
};

export default InterBeforeParams;
