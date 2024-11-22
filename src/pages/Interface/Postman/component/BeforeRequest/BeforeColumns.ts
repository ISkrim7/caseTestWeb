import { IVariable } from '@/pages/Interface/types';
import { ProColumns } from '@ant-design/pro-table/lib/typing';

export const beforeColumns: ProColumns[] = [
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
  },
];

export const beforeFuncColumns: ProColumns[] = [
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
];

export const VariableColumns: ProColumns<IVariable>[] = [
  {
    dataIndex: 'target',
    valueType: 'text',
    hideInTable: true,
    hideInSearch: true,
  },
  {
    title: 'key',
    dataIndex: 'key',
    valueType: 'text',
    ellipsis: true,
    copyable: true,
  },
  {
    title: 'value',
    dataIndex: 'value',
    valueType: 'code',
    width: '30%',
    fieldProps: {
      rows: 3,
      width: '100%',
    },
    search: false,
  },
  {
    title: 'desc',
    dataIndex: 'desc',
    valueType: 'textarea',
    fieldProps: { rows: 1 },
    search: false,
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    valueType: 'text',
    editable: false,
  },
];
