import { IObjGet } from '@/api';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import RespProTable from '@/pages/Httpx/InterfaceApiResponse/RespProTable';
import AssertColumns from '@/pages/Interface/InterResponse/AssertInfo/AssertColumns';
import { IExtracts, ITryResponse } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
import { ProCard } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Tabs, Tag } from 'antd';
import { FC, useState } from 'react';

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
      return (
        <Tag bordered={false} color={'green'}>
          {text}
        </Tag>
      );
    },
  },
  {
    title: '提取目标',
    dataIndex: 'target',
    render: (text) => {
      return (
        <Tag bordered={false} color={'blue'}>
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
    width: '60%',
    render: (_text, record) => {
      if (typeof record.value !== 'object' || record.value === null) {
        return <span>{record.value}</span>;
      } else {
        return (
          <AceCodeEditor
            value={JSON.stringify(record.value, null, 2)}
            readonly={true}
            height={'80px'}
          />
        );
      }
    },
  },
];

interface SelfResponse {
  responseInfos?: ITryResponse[];
}

const TryResponse: FC<SelfResponse> = ({ responseInfos }) => {
  const [activeKeys, setActiveKeys] = useState(
    Array(responseInfos?.length).fill('3'),
  );
  const tabExtra = (response: ITryResponse) => {
    if (!response || !response.response) return null;
    const { status_code, useTime } = response;
    const { color, text = '' } = STATUS[status_code!] || {
      color: '#F56C6C',
      text: '',
    };
    return (
      <div className="tab-extra">
        <span>
          Method:
          <span
            className={'status'}
            style={{ color: color, marginLeft: 8, marginRight: 8 }}
          >
            {response.request.method}
          </span>
          Status_Code:
          <span
            className="status"
            style={{ color, marginLeft: 8, marginRight: 8 }}
          >
            {status_code}
            {text}
          </span>
          <span style={{ marginLeft: 8, marginRight: 8 }}>
            Use_Time: <span style={{ color: '#67C23A' }}>{useTime}s</span>
          </span>
        </span>
      </div>
    );
  };
  const renderResponseBody = (item: ITryResponse) => {
    if (typeof item.response.body !== 'object' || item.response.body === null) {
      console.log('==');
      return (
        <AceCodeEditor value={item.response.body} readonly _mode={'html'} />
      );
    } else {
      return (
        <AceCodeEditor
          value={JSON.stringify(item.response.body, null, 2)}
          readonly
        />
      );
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      {responseInfos?.map((item: ITryResponse, index: number) => {
        return (
          <ProCard
            extra={tabExtra(item)}
            bordered
            style={{ borderRadius: '5px', marginTop: 5 }}
            title={
              <>
                <Tag color={item.status?.toLowerCase()}>{item.name}</Tag>
                <span>{item.desc}</span>
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
              <Tabs.TabPane tab={'请求信息'} key={'1'}>
                <AceCodeEditor
                  value={JSON.stringify(item.request, null, 2)}
                  readonly={true}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={'响应头'} key={'2'}>
                <AceCodeEditor
                  value={JSON.stringify(item.response.headers, null, 2)}
                  readonly={true}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={'响应体'} key={'3'}>
                {renderResponseBody(item)}
              </Tabs.TabPane>
              <Tabs.TabPane tab={'步骤变量与响应参数提取'} key={'4'}>
                <RespProTable
                  columns={extractColumns}
                  dataSource={item.extracts}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={'断言'} key={'5'}>
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
export default TryResponse;
