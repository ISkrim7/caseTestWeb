import { ProList } from '@ant-design/pro-components';
import { Space, Tag } from 'antd';
import type { Key } from 'react';
import { useState } from 'react';

interface IFuncMap {
  title: string;
  args?: string[];
  returnContent?: string;
  subTitle: string;
  description?: any;
  example?: string;
  url?: string;
}

const dataSource: IFuncMap[] = [
  {
    title: 'timestamp(day:str = None)-> str 获取时间戳',
    subTitle: 'Func',
    args: ['+1s', '-1s', '+1m', '-1m', '+1h', '-1h'],
    description: '获取不同时间的时间戳',
    example:
      "例子: ts = timestamp() 返回当前时间戳 ts = timestamp('+1s') 返回1秒后的时间戳",
    returnContent: ':return 1705114614000',
  },
  {
    title: 'date(day:str = None) -> str 获取日期',
    subTitle: 'Func',
    args: ['+1d', '-1d', '+1m', '-1m', '+1y', '-1y'],
    example:
      "例子: _time = date() 返回当前时间 _time = date('+1d') 返回明天时间",
    description: '获取 YYYY-MM-DD 格式时间',
    returnContent: ':return 2024-01-13',
  },
  {
    title: 'execute_sql(db:str,sql:str) -> sql执行',
    subTitle: 'Func',
    example:
      "例子: execute_sql(db='beijing',sql:'insert ...')  data = execute_sql(db='beijing',sql:'select ...')",
    description: '执行SQL',
    returnContent: ':return Any',
  },
  {
    title: 'log() -> 打印日志',
    subTitle: 'Func',
    example: '例子: log("hello")  log(f"hello {obj}"))',
    description: '日志输出',
    returnContent: ':return NoReturn',
  },
  {
    title: 'response 响应体',
    subTitle: 'Object',
    example: '例子：text = response.text , jsonBody = response.json()',
    description: `当前步骤返回响应体对象 用于后置操作 `,
    returnContent: ':return Any',
  },
  {
    title: 'faker 生成伪数据',
    subTitle: 'Object',
    returnContent: ':return Any',
    description: (
      <span>
        使用第三方库生成伪数据、{' '}
        <a
          onClick={() => {
            window.open(
              'https://www.coonote.com/python-note/python-faker.html',
            );
          }}
        >
          具体查看
        </a>
      </span>
    ),
    example: `例子：name = faker.name() , address = faker.address()`,
  },
  {
    title: 'do_assert(actual:any,opt:string,expect:any) 结果断言',
    subTitle: 'Func',
    returnContent: ':return Any',
    description: <text>用于后置动作、对响应体 进行代码层面断言</text>,
    example:
      "例子：do_assert('OK','=','OK') do_assert(response.json().get('code'),'=',0)",
  },
  {
    title: 'getVar(key:str) 结果断言',
    subTitle: 'Func',
    returnContent: ':return Any',
    description: (
      <text>用于在编辑模式中设置或获取的变量 如果获取不到 返回None</text>
    ),
    example: "例子：newCOOKIE = getVar('cookie') + ‘123321’ ",
  },
];

export default () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);

  return (
    <ProList<IFuncMap>
      rowKey="title"
      expandable={{ expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }}
      dataSource={dataSource}
      metas={{
        title: {
          dataIndex: 'title',
          render: (text) => {
            return <Space>{text}</Space>;
          },
        },
        subTitle: {
          dataIndex: 'subTitle',
          render: (_, row) => {
            return (
              <Space size={0}>
                <Tag color="#5BD8A6">{_}</Tag>
              </Space>
            );
          },
        },
        description: {
          render: (_, row) => {
            return (
              <span>
                {row.description || ''}
                <br />
                {row.example}
                <br />
                {row.args ? `:param : ${row.args?.map((item) => item)}` : null}
                <br />
                {row.returnContent || null}
              </span>
            );
          },
        },
      }}
    />
  );
};
