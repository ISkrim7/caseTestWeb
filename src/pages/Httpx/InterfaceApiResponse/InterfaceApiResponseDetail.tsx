import { getEnvById } from '@/api/base';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import AssertColumns from '@/pages/Httpx/componets/AssertColumns';
import RequestHeaders from '@/pages/Httpx/InterfaceApiResponse/RequestHeaders';
import ResponseExtractColumns from '@/pages/Httpx/InterfaceApiResponse/ResponseExtract';
import RespProTable from '@/pages/Httpx/InterfaceApiResponse/RespProTable';
import { ITryResponseInfo } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
import { ProCard } from '@ant-design/pro-components';
import { Tabs, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  responses: ITryResponseInfo[];
}

const InterfaceApiResponseDetail: FC<SelfProps> = ({ responses }) => {
  const [envNames, setEnvNames] = useState<string[]>([]);
  const { API_STATUS } = CONFIG;
  useEffect(() => {
    if (responses) {
      const fetchAllEnvNames = async () => {
        const newEnvNames = [];
        for (const item of responses) {
          const name = await fetchEnvName(item.interfaceEnvId);
          newEnvNames.push(name);
        }
        setEnvNames(newEnvNames);
      };

      if (responses) {
        fetchAllEnvNames();
      }
    }
  }, [responses]);
  const [activeKeys, setActiveKeys] = useState(
    Array(responses?.length).fill('3'),
  );

  const tabExtra = (response: ITryResponseInfo) => {
    if (!response.response_status) return null;
    const { response_status, useTime } = response;
    const { color, text = '' } = API_STATUS[response_status!] || {
      color: '#F56C6C',
      text: '',
    };
    return (
      <div>
        <span>
          Method:
          <span style={{ color: color, marginLeft: 8, marginRight: 8 }}>
            {response.request_method}
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
      return (
        <AceCodeEditor value={response_txt} _mode={'html'} readonly={true} />
      );
    }
  };
  const fetchEnvName = async (envId: number) => {
    const { code, data } = await getEnvById(envId);
    if (code === 0) {
      return data.name;
    }
    return '';
  };
  const setDesc = (text: string) => {
    return text.length > 10 ? text.slice(0, 10) + '...' : text;
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
                <Tag color={'blue'}>{envNames[index]}</Tag>
                <Tag
                  color={
                    item.result?.toLowerCase() === 'error' ? '#f50' : '#87d068'
                  }
                >
                  {item.interfaceName}
                </Tag>
                <span style={{ color: 'gray' }}>
                  {setDesc(item.interfaceDesc)}
                </span>
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
                  columns={ResponseExtractColumns}
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
