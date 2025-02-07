import {
  AssertOpt,
  ExtraOpt,
  TYPE_ENUM,
} from '@/pages/Httpx/componets/assertEnum';
import { IAsserts } from '@/pages/Httpx/types';
import { IUICaseStepAPI } from '@/pages/Play/componets/uiTypes';
import {
  EditableFormInstance,
  EditableProTable,
  ProColumns,
  ProForm,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
interface SelfProps {
  apiForm: FormInstance<any>;
  apiData?: IUICaseStepAPI;
}

const Index: FC<SelfProps> = ({ apiForm, apiData }) => {
  const [assertsDataSource, setAssertsSource] = useState<IAsserts[]>([]);
  const [assertsEditableKeys, setAssertsEditableRowKeys] = useState<
    React.Key[]
  >(assertsDataSource.map((item) => item.id));
  const editableFormRef = useRef<EditableFormInstance>();

  useEffect(() => {
    if (apiData) {
      setAssertsEditableRowKeys(apiData.asserts?.map((item) => item.id) || []);
    }
  }, [apiData]);
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
            <a
              onClick={() => {
                setAssertsEditableRowKeys([record.id]);
              }}
            >
              编辑
            </a>
          </>
        );
      },
    },
  ];

  return (
    <ProForm form={apiForm} submitter={false}>
      <ProForm.Item name={'asserts'} trigger={'onValuesChange'}>
        <EditableProTable<IAsserts>
          rowKey={'id'}
          editableFormRef={editableFormRef}
          dataSource={assertsDataSource}
          toolBarRender={false}
          scroll={{ x: 1000 }}
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
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};

export default Index;
