import { ProColumns } from '@ant-design/pro-components';

const AssertOpt = {
  '==': {
    text: '预期相等实际',
  },
  '!=': {
    text: '预期不等实际',
  },
  '>': {
    text: '预期大于实际',
  },
  '<': {
    text: '预期小于实际',
  },
  '>=': {
    text: '预期大于等于实际',
  },
  '<=': {
    text: '预期小于等于实际',
  },
  in: {
    text: '预期存在实际中',
  },
  notIn: {
    text: '预期不存在实际中',
  },
};
const ExtraOpt = {
  jsonpath: {
    text: 'jsonpath',
  },
  re: {
    text: 're',
    disabled: true,
  },
};
const TYPE_ENUM = {
  string: {
    text: 'Sting',
  },
  integer: {
    text: 'Integer',
  },
  bool: {
    text: 'Bool',
  },
  object: {
    text: 'Object',
  },
};

export const assertColumns: ProColumns[] = [
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
  },
];
