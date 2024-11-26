import titleName from '@/components/TitleName';
import { ActionType, ProCard, ProTable } from '@ant-design/pro-components';
import { OptionsFunctionType } from '@ant-design/pro-table/es/components/ToolBar';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { TablePaginationConfig, TableProps } from 'antd';
import { TableProps as RcTableProps } from 'rc-table/lib/Table';
import { FC, MutableRefObject } from 'react';

// @ts-ignore
interface SelfProps extends ProTableProps<any> {
  headerTitle?: string;
  columns: ProColumns[];
  request?: (params: any, sort: any) => Promise<any>;
  dataSource?: RcTableProps<any>['data'];
  onSave?: (_: any, record: any) => Promise<any>;
  onDelete?: (_: any, record: any) => Promise<any>;
  rowKey: string;
  toolBarRender?: () => any;
  actionRef?: MutableRefObject<ActionType | undefined>;
  height?: string;
  rowSelection?: TableProps<any>['rowSelection']; // 添加rowSelection属性
  search?: boolean;
  reload?: OptionsFunctionType;
  form?: any;
  pagination?: TablePaginationConfig;
  x?: number;
  persistenceKey?: string;
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
        search={
          search
            ? {
                // layout: 'vertical',
                // split: true,
                // filterType: 'query',
                labelWidth: 'auto',
                // span: 6,
                showHiddenNum: true,
                // defaultCollapsed: false,
              }
            : false
        }
        options={{
          density: true,
          setting: {
            listsHeight: 400,
          },
          reload: reload || true,
        }}
        pagination={
          pagination || {
            showQuickJumper: true,
            defaultPageSize: 20,
            showSizeChanger: true,
          }
        }
        dateFormatter="string"
        headerTitle={headerTitle ? titleName(headerTitle) : null}
        toolBarRender={toolBarRender}
      />
    </ProCard>
  );
};

export default MyProTable;
