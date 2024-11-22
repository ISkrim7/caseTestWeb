import React from 'react';
import { ProColumns } from '@ant-design/pro-components';
import { IExtracts } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
import { Tag } from 'antd';

const ExtractColumns = () => {
  const extractColumns: ProColumns<IExtracts>[] = [
    {
      title: '变量名',
      dataIndex: 'key',
      width: '30%',
    },
    {
      title: '提取目标',
      dataIndex: 'target',
      valueType: 'select',
      width: '20%',
      valueEnum: CONFIG.EXTRACT_TARGET_ENUM,
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '提取语法',
      dataIndex: 'value',
      valueType: 'textarea',
      width: '50%',
      fieldProps: {
        rows: 1,
      },
    },
    {
      title: 'Opt',
      valueType: 'option',
      width: '10%',
    },
  ];

  return {
    extractColumns,
  };
};
export default ExtractColumns;
