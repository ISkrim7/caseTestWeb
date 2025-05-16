import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import AssertColumns from '@/pages/Httpx/componets/AssertColumns';
import RequestHeaders from '@/pages/Httpx/InterfaceApiResponse/RequestHeaders';
import ResponseExtractColumns from '@/pages/Httpx/InterfaceApiResponse/ResponseExtract';
import RespProTable from '@/pages/Httpx/InterfaceApiResponse/RespProTable';
import { IInterfaceResultByCase } from '@/pages/Httpx/types';
import { CONFIG } from '@/utils/config';
import { ProCard } from '@ant-design/pro-components';
import { Badge, Divider, Space, Tabs, Tag, Tooltip, Typography } from 'antd';
import { FC, useState } from 'react';

const { Text } = Typography;

interface SelfProps {
  responses?: any[];
}

const InterfaceApiResponseDetail: FC<SelfProps> = ({ responses }) => {
  const { API_STATUS } = CONFIG;
  const [activeKeys, setActiveKeys] = useState(
    Array(responses?.length).fill('3'),
  );

  const tabExtra = (response: IInterfaceResultByCase) => {
    if (!response.response_status) return null;
    const { response_status, useTime, startTime } = response;
    const { color, text = '' } = API_STATUS[response_status!] || {
      color: '#F56C6C',
      text: '',
    };
    return (
      <Space
        size={12}
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 8,
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          borderRadius: 6,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 14,
          }}
        >
          {/* Method 标签 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                color: '#6c757d',
                fontWeight: 500,
                marginRight: 4,
              }}
            >
              Method:
            </span>
            <span
              style={{
                color: color,
                fontWeight: 600,
                padding: '2px 8px',
                backgroundColor: `${color}10`,
                borderRadius: 4,
              }}
            >
              {response.request_method}
            </span>
          </div>

          {/* Status Code 标签 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                color: '#6c757d',
                fontWeight: 500,
                marginRight: 4,
              }}
            >
              Status:
            </span>
            <span
              style={{
                color: color,
                fontWeight: 600,
                padding: '2px 8px',
                backgroundColor: `${color}10`,
                borderRadius: 4,
              }}
            >
              {response_status}
              {text && <span style={{ marginLeft: 4 }}>{text}</span>}
            </span>
          </div>

          {/* Time 标签组 */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            {/* Request Time */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  color: '#6c757d',
                  fontWeight: 500,
                  marginRight: 4,
                }}
              >
                Request_Time:
              </span>
              <span
                style={{
                  color: '#67C23A',
                  fontWeight: 600,
                }}
              >
                {startTime}
              </span>
            </div>

            {/* Use Time */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  color: '#6c757d',
                  fontWeight: 500,
                  marginRight: 4,
                }}
              >
                Latency:
              </span>
              <span
                style={{
                  color: '#67C23A',
                  fontWeight: 600,
                }}
              >
                {useTime}ms
              </span>
            </div>
          </div>
        </div>
      </Space>
    );
  };

  const TabTitle = (title: string) => (
    <span style={{ color: 'orange' }}>{title}</span>
  );
  const renderResponseBody = (item: IInterfaceResultByCase) => {
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
  // 在文件顶部添加类型检测函数
  const detectContentType = (content: string) => {
    if (/^{.*}$/.test(content) || /^\[.*\]$/.test(content)) return 'json';
    if (/(<html|<!DOCTYPE html>)/i.test(content)) return 'html';
    if (/(<xml|<?xml)/i.test(content)) return 'xml';
    return 'text';
  };

  const renderRequestBody = (item: IInterfaceResultByCase) => {
    const { request_txt } = item;
    // 在renderRequestBody中添加二进制内容判断
    if (request_txt?.startsWith('[Binary Content')) {
      return (
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
          <Text type="secondary">{request_txt}</Text>
        </div>
      );
    }
    // 在renderRequestBody开始处添加
    if (!request_txt) {
      return (
        <div style={{ padding: 16 }}>
          <Text type="secondary">No request body</Text>
        </div>
      );
    }
    // 在解析前添加长度判断
    const MAX_LENGTH = 50000;
    if (request_txt.length > MAX_LENGTH) {
      return (
        <AceCodeEditor
          value={`${request_txt.substring(
            0,
            MAX_LENGTH,
          )}\n\n[内容过长已截断，完整内容长度：${request_txt.length}字节]`}
          _mode="text"
          readonly={true}
        />
      );
    }
    try {
      const jsonValue = JSON.parse(request_txt);
      const value = JSON.stringify(jsonValue, null, 2);
      return <AceCodeEditor value={value} readonly={true} />;
    } catch (e) {
      return (
        <AceCodeEditor
          value={request_txt}
          _mode={detectContentType(request_txt)}
          readonly={true}
        />
      );
    }
  };

  const setDesc = (text: string) => {
    return text?.length > 8 ? text?.slice(0, 8) + '...' : text;
  };
  // 添加组状态计算函数全错组才标记ERROR
  const calculateGroupStatus = (groupData: IInterfaceResultByCase[]) => {
    if (groupData.every((i) => i.result === 'ERROR')) return 'ERROR';
    if (groupData.some((i) => i.result === 'SUCCESS')) return 'SUCCESS';
    return 'WARNING';
  };
  // 新增组状态判断函数
  const getGroupStatus = (groupData: IInterfaceResultByCase[]) => {
    // 只要有一个ERROR即视为失败
    return groupData.some((item) => item.result === 'ERROR')
      ? 'ERROR'
      : 'SUCCESS';
  };
  return (
    <div>
      {responses?.map((item: any, index: number) => {
        if (item.groupId) {
          return (
            <ProCard
              key={index}
              bodyStyle={{ padding: 10 }}
              extra={tabExtra(item)}
              bordered
              //style={{ borderRadius: '5px', marginTop: 5 }}
              /*
              title={
                <>
                  <Tag color={'blue'}>组</Tag>
                  <Tag
                    color={
                      //item.result?.toLowerCase() === 'error'
                      //calculateGroupStatus(item.data) === 'ERROR'
                      getGroupStatus(item.data) === 'ERROR' ? '#f50' : '#87d068'
                    }
                  >
                    {item.groupName}
                  </Tag>
                  <Text type={'secondary'}>{setDesc(item.groupDesc)}</Text>
                </>
              }
              */

              style={{
                borderRadius: '5px',
                marginTop: 5,
                overflow: 'visible', // 防止内容被裁剪
              }}
              headStyle={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px 16px',
              }}
              title={
                <div className="group-header-container">
                  {/* 组标识 */}
                  <Tag color="blue" className="group-tag">
                    组
                  </Tag>

                  {/* 组名称 */}
                  <Tooltip title={item.groupName}>
                    <Tag
                      className="group-name-tag"
                      color={
                        getGroupStatus(item.data) === 'ERROR'
                          ? '#f50'
                          : '#87d068'
                      }
                    >
                      <span className="truncate-text">{item.groupName}</span>
                    </Tag>
                  </Tooltip>

                  {/* 组描述 */}
                  <Tooltip title={item.groupDesc}>
                    <Text type="secondary" className="group-description">
                      {item.groupDesc}
                    </Text>
                  </Tooltip>

                  {/* 添加视觉分隔线 */}
                  <Divider type="vertical" className="header-divider" />

                  {/* 状态指示器 */}
                  <Badge
                    status={
                      getGroupStatus(item.data) === 'ERROR'
                        ? 'error'
                        : 'success'
                    }
                    text={`状态：${getGroupStatus(item.data)}`}
                  />
                </div>
              }
              headerBordered
              collapsible
              defaultCollapsed
            >
              <InterfaceApiResponseDetail responses={item.data} />
            </ProCard>
          );
        } else {
          return (
            <ProCard
              extra={tabExtra(item)}
              bordered
              style={{ borderRadius: '5px', marginTop: 5 }}
              /*
              title={
                <>
                  <Tag color={'blue'}>API</Tag>
                  <Tag
                    color={
                      item.result?.toLowerCase() === 'error'
                        ? '#f50'
                        : '#87d068'
                    }
                  >
                    {item.interfaceName}
                  </Tag>
                  <Text type={'secondary'}>{setDesc(item.interfaceDesc)}</Text>
                </>
              }
              */
              // 修改位置：单个API对应的ProCard组件
              title={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                    rowGap: 4,
                  }}
                >
                  {/* API标识 */}
                  <Tag color={'blue'} style={{ marginRight: 0 }}>
                    API
                  </Tag>

                  {/* API名称带状态颜色 */}
                  <Tooltip title={item.interfaceName}>
                    <Tag
                      color={
                        item.result?.toLowerCase() === 'error'
                          ? '#f50'
                          : '#87d068'
                      }
                      style={{
                        maxWidth: 180,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.interfaceName}
                    </Tag>
                  </Tooltip>

                  {/* 描述信息 */}
                  <Tooltip title={item.interfaceDesc}>
                    <Text
                      type={'secondary'}
                      style={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {setDesc(item.interfaceDesc)}
                    </Text>
                  </Tooltip>
                </div>
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
                // 在Tabs组件内添加新的TabPane（放在请求头之后）
                <Tabs.TabPane tab={TabTitle('请求体')} key={'6'}>
                  {renderRequestBody(item)}
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
        }
      })}
    </div>
  );
};

export default InterfaceApiResponseDetail;
