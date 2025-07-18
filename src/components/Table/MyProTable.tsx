import titleName from '@/components/TitleName';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { SearchConfig } from '@ant-design/pro-table/es/components/Form/FormRender';
import { OptionsFunctionType } from '@ant-design/pro-table/es/components/ToolBar';
import type { ActionType, ProColumns } from '@ant-design/pro-table/lib/typing';
import { TablePaginationConfig, TableProps } from 'antd';
import { TableProps as RcTableProps } from 'rc-table/lib/Table';
import { FC, MutableRefObject } from 'react';

interface SelfProps {
  headerTitle?: string;
  columns: ProColumns[];
  request?: (params: any, sort: any) => Promise<any>;
  dataSource?: RcTableProps<any>['data'];
  onSave?: (_: any, record: any) => Promise<any>;
  onDelete?: (_: any, record: any) => Promise<any>;
  rowKey: string;
  toolBarRender?: () => any | boolean;
  actionRef?: MutableRefObject<ActionType | undefined>;
  height?: string;
  rowSelection?: TableProps<any>['rowSelection']; // 添加rowSelection属性
  search?: boolean;
  reload?: OptionsFunctionType;
  form?: any;
  pagination?: TablePaginationConfig;
  x?: number;
  persistenceKey?: string;
  loading?: boolean;
}

const MyProTable: FC<SelfProps> = (props) => {
  const {
    form,
    columns,
    height = 'auto',
    search = true,
    rowKey,
    dataSource,
    request,
    onSave,
    onDelete,
    headerTitle,
    toolBarRender,
    actionRef,
    rowSelection,
    reload,
    pagination,
    x = 1000,
    persistenceKey,
    ...otherProps
  } = props;

  // 默认分页配置
  const defaultPagination: TablePaginationConfig = {
    showQuickJumper: true,
    defaultPageSize: 20,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
  };

  // 默认搜索配置
  const defaultSearchConfig: SearchConfig = {
    labelWidth: 'auto',
    showHiddenNum: true,
  };
  return (
    <ProCard style={{ height: height }}>
      <ProTable
        {...otherProps}
        form={form}
        dataSource={dataSource}
        columns={columns}
        actionRef={actionRef}
        // cardBordered
        scroll={{ x: x }}
        request={request}
        editable={{
          //可编辑表格的相关配置
          type: 'single', // 编辑单行
          onSave: onSave,
          onDelete: onDelete,
        }}
        columnsState={{
          persistenceKey: persistenceKey ?? 'pro-table',
          persistenceType: 'localStorage', //持久化列的类类型， localStorage 设置在关闭浏览器后也是存在的，sessionStorage 关闭浏览器后会丢失 sessionStorage
        }}
        rowKey={rowKey}
        rowSelection={rowSelection || false}
        search={search ? defaultSearchConfig : false}
        options={{
          density: true,
          setting: {
            listsHeight: 400,
          },
          reload: reload || true,
        }}
        pagination={pagination || defaultPagination}
        dateFormatter="string"
        headerTitle={headerTitle ? titleName(headerTitle) : null}
        toolBarRender={toolBarRender}
      />
    </ProCard>
  );
};

export default MyProTable;
