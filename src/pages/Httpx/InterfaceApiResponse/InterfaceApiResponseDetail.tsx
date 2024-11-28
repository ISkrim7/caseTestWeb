import { IObjGet } from '@/api';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import AssertColumns from '@/pages/Httpx/componets/AssertColumns';
import RequestHeaders from '@/pages/Httpx/InterfaceApiResponse/RequestHeaders';
import RespProTable from '@/pages/Httpx/InterfaceApiResponse/RespProTable';
import { IExtracts, ITryResponseInfo } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
import { ProCard } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Tabs, Tag } from 'antd';
import { FC, useState } from 'react';

interface SelfProps {
  responses: ITryResponseInfo[];
}

const STATUS: IObjGet = {
  200: { color: '#67C23A', text: 'OK' },
  401: { color: '#F56C6C', text: 'unauthorized' },
  400: { color: '#F56C6C', text: 'Bad Request' },
};

const extractColumns: ProColumns<IExtracts>[] = [
  {
    title: '变量名',
    copyable: true,
    dataIndex: 'key',
    render: (text) => {
      return <Tag color={'green'}>{text}</Tag>;
    },
  },
  {
    title: '提取目标',
    dataIndex: 'target',
    render: (text) => {
      return (
        <Tag color={'blue'}>
          {/*// @ts-ignore*/}
          {CONFIG.EXTRACT_RESPONSE_TARGET_ENUM[text]?.text}
        </Tag>
      );
    },
  },
  {
    title: '提取值',
    dataIndex: 'value',
    valueType: 'text',
    copyable: true,
    width: '60%',
    render: (_text, record) => {
      const { value } = record;

      // 判断值的类型
      if (typeof value === 'object' && value !== null) {
        // 如果是对象类型，使用 AceCodeEditor 展示 JSON
        return (
          <AceCodeEditor
            value={JSON.stringify(value, null, 2)}
            readonly={true}
            height="80px"
          />
        );
      }

      if (typeof value === 'boolean') {
        // 如果是布尔类型，使用勾选框或者“是/否”来展示
        return <span>{value ? 'true' : 'false'}</span>;
      }

      if (typeof value === 'number' || typeof value === 'string') {
        // 如果是数字或者字符串，直接返回文本
        return <span>{value}</span>;
      }

      // 其他情况默认返回空
      return null;
    },
  },
];

const InterfaceApiResponseDetail: FC<SelfProps> = ({ responses }) => {
  const [activeKeys, setActiveKeys] = useState(
    Array(responses?.length).fill('3'),
  );

  const tabExtra = (response: ITryResponseInfo) => {
    if (!response.response_status) return null;
    const { response_status, useTime } = response;
    const { color, text = '' } = STATUS[response_status!] || {
      color: '#F56C6C',
      text: '',
    };
    return (
      <div>
        <span>
          Method:
          <span style={{ color: color, marginLeft: 8, marginRight: 8 }}>
            {/*{response.request.method}*/}
            GET
          </span>
          Status_Code:
          <span style={{ color, marginLeft: 8, marginRight: 8 }}>
            {response_status}
            <span> {text}</span>
          </span>
          <span style={{ marginLeft: 8, marginRight: 8 }}>
            Use_Time: <span style={{ color: '#67C23A' }}>{useTime}</span>
          </span>
        </span>
      </div>
    );
  };

  const TabTitle = (title: string) => (
    <span style={{ color: 'orange' }}>{title}</span>
  );
  const renderResponseBody = (item: ITryResponseInfo) => {
    const { response_txt } = item;
    try {
      const jsonValue = JSON.parse(response_txt);
      const value = JSON.stringify(jsonValue, null, 2);
      return <AceCodeEditor value={value} readonly={true} />;
    } catch (e) {
      return <AceCodeEditor value={response_txt} readonly={true} />;
    }
  };

  return (
    <div>
      {responses?.map((item: ITryResponseInfo, index: number) => {
        return (
          <ProCard
            extra={tabExtra(item)}
            bordered
            style={{ borderRadius: '5px', marginTop: 5 }}
            title={
              <>
                <Tag color={item.result?.toLowerCase()}>
                  {item.interfaceName}
                </Tag>
                <span>{item.interfaceDesc}</span>
              </>
            }
            headerBordered
            collapsible
            defaultCollapsed
          >
            <Tabs
              activeKey={activeKeys[index]}
              onChange={(key) => {
                const newActiveKeys = [...activeKeys];
                newActiveKeys[index] = key;
                setActiveKeys(newActiveKeys);
              }}
            >
              <Tabs.TabPane tab={TabTitle('请求头')} key={'1'}>
                <RequestHeaders header={item.request_head} />
              </Tabs.TabPane>
              <Tabs.TabPane tab={TabTitle('响应头')} key={'2'}>
                <RequestHeaders header={item.response_head} />
              </Tabs.TabPane>
              <Tabs.TabPane tab={TabTitle('响应体')} key={'3'}>
                {renderResponseBody(item)}
              </Tabs.TabPane>
              <Tabs.TabPane tab={TabTitle('变量与响应参数提取')} key={'4'}>
                <RespProTable
                  columns={extractColumns}
                  dataSource={item.extracts}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={TabTitle('断言')} key={'5'}>
                <RespProTable
                  columns={AssertColumns}
                  dataSource={item.asserts}
                />
              </Tabs.TabPane>
            </Tabs>
          </ProCard>
        );
      })}
    </div>
  );
};

export default InterfaceApiResponseDetail;
