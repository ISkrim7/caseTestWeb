import { caseAddStepWithGroup, pageStepGroup } from '@/api/ui';
import MyProTable from '@/components/Table/MyProTable';
import { IUICaseSteps, IUIStepGroup } from '@/pages/UIPlaywright/uiTypes';
import { pageData } from '@/utils/somefunc';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Button, message, TableProps, Tag } from 'antd';
import React, { FC, useCallback, useState } from 'react';

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

interface SelfProps {
  caseId: number;
  dataSource: IUICaseSteps[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  edit: number;
  setEdit: React.Dispatch<React.SetStateAction<number>>;
}

const Index: FC<SelfProps> = ({
  caseId,
  setOpen,
  edit,
  setEdit,
  dataSource,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [confirmButtonStatus, setConfirmButtonStatus] = useState(true);

  const pageGroup = useCallback(async (params: any, sort: any) => {
    const search_data = {
      ...params,
      sort: sort,
    };
    const { code, data } = await pageStepGroup(search_data);
    return pageData(code, data);
  }, []);

  const columns: ProColumns<IUIStepGroup>[] = [
    {
      title: '步骤ID',
      dataIndex: 'id',
      valueType: 'text',
      width: '8%',
      fixed: 'left',
    },
    {
      title: '步骤名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '步骤描述',
      dataIndex: 'desc',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '步骤数量',
      dataIndex: 'stepNum',
      editable: false,
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      editable: false,
      fixed: 'right',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
  ];

  const onSelect = async (record: IUIStepGroup, selected: boolean) => {
    const selectRow: IUIStepGroup = record;
    if (selected) {
      if (dataSource?.some((item) => item.group_Id === selectRow.id)) {
        message.warning(`用例组 ${record.name} 已经存在！`);
        setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.id));
        // // 更新确认按钮状态
        // setConfirmButtonStatus(true);
        // message.warning(`用例组  ${record.name} 已经存在！`).then(async () => {
        //   setSelectedRowKeys(
        //     selectedRowKeys.filter((key) => key !== record.id),
        //   );
        //   setConfirmButtonStatus(true);
        // });
        return;
      } else {
        setConfirmButtonStatus(false);
      }
    }
  };
  const rowSelection: TableRowSelection<IUIStepGroup> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      console.log('===', newSelectedRowKeys);
      if (
        dataSource?.some((item) => newSelectedRowKeys.includes(item.group_Id))
      ) {
        message.warning('该用例组已存在');
        console.log('===');
        setConfirmButtonStatus(true);
      } else {
        setConfirmButtonStatus(false);
        setSelectedRowKeys(newSelectedRowKeys);
      }
    },
  };

  /**
   * 确认添加用例
   */
  const confirmAddCase = async () => {
    if (selectedRowKeys.length > 0) {
      const data = {
        caseId: caseId!,
        // caseIdList: selectedRowKeys as number[],
        groupIds: selectedRowKeys as number[],
      };
      const { code, msg } = await caseAddStepWithGroup(data);
      if (code === 0) {
        message.success(msg);
        setSelectedRowKeys([]);
        setConfirmButtonStatus(true);
        setOpen(false);
        setEdit(edit + 1);
      }
    }
  };
  return (
    <MyProTable
      rowSelection={rowSelection}
      // @ts-ignore
      tableAlertOptionRender={() => {
        return (
          <>
            <Button
              style={{ marginLeft: 10 }}
              onClick={confirmAddCase}
              disabled={confirmButtonStatus}
              type={'primary'}
            >
              确认添加
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              onClick={() => setSelectedRowKeys([])}
              disabled={confirmButtonStatus}
              type={'primary'}
            >
              取消
            </Button>
          </>
        );
      }}
      columns={columns}
      request={pageGroup}
      rowKey={'id'}
    />
  );
};

export default Index;
