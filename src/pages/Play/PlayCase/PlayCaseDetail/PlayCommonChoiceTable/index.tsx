import { choiceAddUIStep, choiceAddUIStepWithCopy } from '@/api/play';
import { pageSteps } from '@/api/play/step';
import MyProTable from '@/components/Table/MyProTable';
import { IUICaseSteps } from '@/pages/Play/componets/uiTypes';
import { pageData } from '@/utils/somefunc';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Button, message, Tag } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { FC, useState } from 'react';

interface ISelfProps {
  caseId?: string;
  callBackFunc: () => void;
}

const Index: FC<ISelfProps> = ({ caseId, callBackFunc }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchCommonStepPage = async (values: any, sort: any) => {
    const { code, data } = await pageSteps({
      ...values,
      is_common_step: 1,
      sort: sort,
    });
    return pageData(code, data);
  };

  const commonColumns: ProColumns<IUICaseSteps>[] = [
    {
      title: 'id',
      valueType: 'text',
      dataIndex: 'uid',
      render: (_, record) => <Tag color={'blue'}>{record.uid}</Tag>,
    },
    {
      title: 'name',
      valueType: 'text',
      dataIndex: 'name',
    },
    {
      title: 'desc',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: 'create time',
      dataIndex: 'create_time',
      valueType: 'date',
      search: false,
      sorter: true,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      valueType: 'text',
    },
  ];

  const rowSelection: TableRowSelection<IUICaseSteps> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <MyProTable
      // @ts-ignore
      tableAlertOptionRender={() => {
        return (
          <>
            <Button
              type={'primary'}
              onClick={async () => {
                if (caseId) {
                  const { code } = await choiceAddUIStepWithCopy({
                    caseId: caseId,
                    choices: selectedRowKeys as number[],
                  });
                  if (code === 0) {
                    message.success('添加成功');
                    callBackFunc();
                  }
                }
              }}
            >
              复制添加
            </Button>

            <Button
              style={{ marginLeft: 5 }}
              onClick={async () => {
                if (caseId) {
                  const { code } = await choiceAddUIStep({
                    caseId: caseId,
                    choices: selectedRowKeys as number[],
                  });
                  if (code === 0) {
                    message.success('添加成功、过滤重复Step');
                    callBackFunc();
                  }
                }
              }}
            >
              引用添加
            </Button>
          </>
        );
      }}
      rowSelection={rowSelection}
      headerTitle={'UI Step Common'}
      columns={commonColumns}
      rowKey={'id'}
      request={fetchCommonStepPage}
    />
  );
};

export default Index;
