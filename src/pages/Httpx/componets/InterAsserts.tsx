import {
  AssertOpt,
  ExtraOpt,
  TYPE_ENUM,
} from '@/pages/Httpx/componets/assertEnum';
import { IAsserts, IInterfaceAPI } from '@/pages/Interface/types';
import {
  EditableProTable,
  ProColumns,
  ProForm,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterAsserts: FC<SelfProps> = ({ form, mode }) => {
  const [assertsEditableKeys, setAssertsEditableRowKeys] = useState<
    React.Key[]
  >([]);

  const assertColumns: ProColumns[] = [
    {
      title: '提取方式',
      dataIndex: 'extraOpt',
      valueEnum: ExtraOpt,
      valueType: 'select',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'text',
    },
    {
      title: '提取语法',
      dataIndex: 'extraValue',
      valueType: 'textarea',
      fieldProps: {
        rows: 1,
      },
    },
    {
      title: '断言方法',
      dataIndex: 'assertOpt',
      valueType: 'select',
      valueEnum: AssertOpt,
    },
    {
      title: '预期结果',
      dataIndex: 'expect',
      valueType: 'code',
      fieldProps: {
        rows: 2,
      },
    },
    {
      title: '预期类型',
      dataIndex: 'extraValueType',
      valueType: 'select',
      valueEnum: TYPE_ENUM,
      fieldProps: { style: { color: 'greenyellow', borderRadius: '10px' } },
    },

    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <>
            {mode !== 1 ? (
              <a
                onClick={() => {
                  setAssertsEditableRowKeys([record.id]);
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
      <ProForm.Item name={'asserts'} trigger={'onValuesChange'}>
        <EditableProTable<IAsserts>
          rowKey={'id'}
          toolBarRender={false}
          columns={assertColumns}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            record: () => ({
              id: Date.now(),
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys: assertsEditableKeys,
            onChange: setAssertsEditableRowKeys,
            actionRender: (row, _, dom) => {
              return [dom.save, dom.cancel, dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};

export default InterAsserts;
