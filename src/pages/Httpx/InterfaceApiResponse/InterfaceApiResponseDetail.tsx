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
  keyPrefix?: string; // 新增key前缀prop
}

const SQL_RESULT_STYLE = {
  header: {
    background: '#f8f9fa',
    padding: '8px 12px',
    borderRadius: 6,
    marginBottom: 12,
  },
  content: {
    border: '1px solid #e8e8e8',
    borderRadius: 4,
    marginTop: 8,
  },
};

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

  // const renderRequestBody = (item: IInterfaceResultByCase) => {
  //   //const { request_txt } = item;
  //   let { request_txt } = item;
  //   // 新增：解码URL编码内容
  //   try {
  //     // 尝试解析为JSON
  //     const jsonValue = JSON.parse(request_txt);
  //     // 对JSON内特定字段进行解码（这里以url字段为例）
  //     if (jsonValue.url) {
  //       jsonValue.url = decodeURIComponent(jsonValue.url);
  //     }
  //     const value = JSON.stringify(jsonValue, null, 2);
  //     return <AceCodeEditor value={value} readonly={true} />;
  //   } catch (e) {
  //     // 保留原始内容当解码失败时
  //     // 非JSON内容整体解码
  //     request_txt = decodeURIComponent(request_txt);
  //   }
  //   // 在renderRequestBody中添加二进制内容判断
  //   if (request_txt?.startsWith('[Binary Content')) {
  //     return (
  //       <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
  //         <Text type="secondary">{request_txt}</Text>
  //       </div>
  //     );
  //   }
  //   // 在renderRequestBody开始处添加
  //   if (!request_txt) {
  //     return (
  //       <div style={{ padding: 16 }}>
  //         <Text type="secondary">No request body</Text>
  //       </div>
  //     );
  //   }
  //   // 在解析前添加长度判断
  //   const MAX_LENGTH = 50000;
  //   if (request_txt.length > MAX_LENGTH) {
  //     return (
  //       <AceCodeEditor
  //         value={`${request_txt.substring(
  //           0,
  //           MAX_LENGTH,
  //         )}\n\n[内容过长已截断，完整内容长度：${request_txt.length}字节]`}
  //         _mode="text"
  //         readonly={true}
  //       />
  //     );
  //   }
  //   try {
  //     const jsonValue = JSON.parse(request_txt);
  //     const value = JSON.stringify(jsonValue, null, 2);
  //     return <AceCodeEditor value={value} readonly={true} />;
  //   } catch (e) {
  //     return (
  //       <AceCodeEditor
  //         value={request_txt}
  //         _mode={detectContentType(request_txt)}
  //         readonly={true}
  //       />
  //     );
  //   }
  // };
  const renderRequestBody = (item: IInterfaceResultByCase) => {
    const request_txt = item.request_txt || '';

    // 1. 空内容处理
    if (!request_txt.trim()) {
      return (
        <div style={{ padding: 16 }}>
          <Text type="secondary">无请求体内容</Text>
        </div>
      );
    }

    // 2. 二进制内容处理
    if (request_txt.startsWith('[Binary Content')) {
      return (
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
          <Text type="secondary">{request_txt}</Text>
        </div>
      );
    }

    // 3. 大文件截断处理
    // const MAX_LENGTH = 50000;
    // if (request_txt.length > MAX_LENGTH) {
    //   return (
    //     <AceCodeEditor
    //       value={`${request_txt.substring(0, MAX_LENGTH)}\n\n[内容过长，已截断前${MAX_LENGTH}字符，完整长度: ${
    //         request_txt.length
    //       }字节]`}
    //       _mode="text"
    //       readonly={true}
    //     />
    //   );
    // }

    // 4. JSON内容处理（核心优化）
    try {
      // 尝试直接解析原始JSON
      const jsonValue = JSON.parse(request_txt);

      // 深度遍历解码可能的URL编码字段
      const decodeUrlFields = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(decodeUrlFields);
        } else if (obj && typeof obj === 'object') {
          return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
              key,
              decodeUrlFields(value),
            ]),
          );
        } else if (typeof obj === 'string') {
          // 只解码符合URL编码模式的字符串
          if (/%[0-9A-Fa-f]{2}/.test(obj)) {
            try {
              return decodeURIComponent(obj);
            } catch (e) {
              // 解码失败保留原值
              return obj;
            }
          }
        }
        return obj;
      };

      // 处理可能的URL编码字段
      const decodedValue = decodeUrlFields(jsonValue);

      // 格式化输出
      return (
        <AceCodeEditor
          value={JSON.stringify(decodedValue, null, 2)}
          readonly={true}
        />
      );
    } catch (e) {
      // 5. 非JSON内容处理
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
  // 添加在组件内部（render之前）
  const formatSqlResult = (data: any) => {
    if (!data) return '';

    try {
      // 尝试解析为JSON
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;

      // 创建按原始键顺序排序的新对象
      const orderedData = Array.isArray(parsed)
        ? parsed.map((item) => {
            const orderedItem: Record<string, any> = {};
            // 保持原始键顺序
            Object.keys(item).forEach((key) => {
              orderedItem[key] = item[key];
            });
            return orderedItem;
          })
        : parsed;

      return JSON.stringify(orderedData, null, 2);
    } catch (e) {
      return typeof data === 'string' ? data : JSON.stringify(data);
    }
  };

  return (
    <div>
      {responses?.map((item: any, index: number) => {
        const uniqueKey = item.groupId
          ? `group-${item.groupId}`
          : `api-${item.interfaceId || index}`;
        if (item.groupId) {
          return (
            <ProCard
              //key={index}
              key={uniqueKey} // 使用组合key
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
              <InterfaceApiResponseDetail
                responses={item.data}
                keyPrefix={uniqueKey} // 添加key前缀以保证嵌套key唯一性
              />
            </ProCard>
          );
        } else {
          return (
            <ProCard
              key={uniqueKey}
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
                items={[
                  {
                    key: '1',
                    label: TabTitle('请求头'),
                    children: (
                      <RequestHeaders
                        key={`${uniqueKey}-req-headers`}
                        header={item.request_head}
                      />
                    ),
                  },
                  {
                    key: '6',
                    label: TabTitle('请求体'),
                    children: renderRequestBody(item),
                  },
                  {
                    key: '2',
                    label: TabTitle('响应头'),
                    children: <RequestHeaders header={item.response_head} />,
                  },
                  {
                    key: '3',
                    label: TabTitle('响应体'),
                    children: renderResponseBody(item),
                  },
                  {
                    key: '4',
                    label: TabTitle('变量与响应参数提取'),
                    children: (
                      <RespProTable
                        columns={ResponseExtractColumns}
                        dataSource={item.extracts}
                      />
                    ),
                  },
                  {
                    key: '5',
                    label: TabTitle('断言'),
                    children: (
                      <RespProTable
                        columns={AssertColumns}
                        dataSource={item.asserts}
                      />
                    ),
                  },
                  // 在Tabs的items数组中新增以下两个Tab项（放在断言Tab之后）
                  {
                    key: '7',
                    label: TabTitle('前置SQL'),
                    children: (
                      <div style={SQL_RESULT_STYLE.content}>
                        {item.before_sql_result ? (
                          <>
                            <div style={SQL_RESULT_STYLE.header}>
                              <Text strong>原始数据</Text>
                            </div>
                            <AceCodeEditor
                              // value={JSON.stringify(
                              //   item.before_sql_result,
                              //   null,
                              //   2,
                              // )}
                              value={formatSqlResult(item.before_sql_result)}
                              readonly
                              _mode="json"
                            />
                            {item.before_sql_extracts?.length > 0 && (
                              <>
                                <Divider style={{ margin: '16px 0' }} />
                                <div style={SQL_RESULT_STYLE.header}>
                                  <Text strong>变量提取</Text>
                                </div>
                                <RespProTable
                                  columns={[
                                    { title: 'Key', dataIndex: 'key' },
                                    {
                                      title: 'Value',
                                      dataIndex: 'value',
                                      render: (v) => <Text code>{v}</Text>,
                                    },
                                  ]}
                                  dataSource={item.before_sql_extracts.map(
                                    (e: { key: string | number }) => ({
                                      key: e.key,
                                      value: item.before_vars?.[e.key],
                                    }),
                                  )}
                                />
                              </>
                            )}
                            {/* 变量提取部分 */}
                            {item.before_vars && (
                              <>
                                <Divider style={{ margin: '16px 0' }} />
                                <div style={SQL_RESULT_STYLE.header}>
                                  <Text strong>变量提取</Text>
                                </div>
                                <RespProTable
                                  columns={[
                                    { title: 'Key', dataIndex: 'key' },
                                    {
                                      title: 'Value',
                                      dataIndex: 'value',
                                      render: (v) => (
                                        <Text code>
                                          {v === null ? 'null' : v}
                                        </Text>
                                      ),
                                    },
                                  ]}
                                  dataSource={
                                    typeof item.before_vars === 'string'
                                      ? Object.entries(
                                          JSON.parse(item.before_vars),
                                        ).map(([key, value]) => ({
                                          key,
                                          value,
                                        }))
                                      : Object.entries(item.before_vars).map(
                                          ([key, value]) => ({ key, value }),
                                        )
                                  }
                                />
                              </>
                            )}
                          </>
                        ) : (
                          <div style={{ padding: 16, textAlign: 'center' }}>
                            <Text type="secondary">未配置前置SQL</Text>
                          </div>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: '8',
                    label: TabTitle('后置SQL'),
                    children: (
                      <div style={SQL_RESULT_STYLE.content}>
                        {/* 判断是否有配置后置SQL */}
                        {item.after_sql_result !== undefined ||
                        item.after_vars !== undefined ? (
                          <>
                            {/* 原始数据部分 */}
                            <div style={SQL_RESULT_STYLE.header}>
                              <Text strong>原始数据</Text>
                            </div>

                            {item.after_sql_result ? (
                              <AceCodeEditor
                                value={formatSqlResult(item.after_sql_result)}
                                readonly
                                _mode="json"
                              />
                            ) : (
                              <div style={{ padding: 16, textAlign: 'center' }}>
                                <Text type="secondary">
                                  {item.after_sql_result === null
                                    ? 'SQL执行成功但无返回数据'
                                    : 'SQL执行结果为空'}
                                </Text>
                              </div>
                            )}

                            {/* 变量提取部分 */}
                            <Divider style={{ margin: '16px 0' }} />
                            <div style={SQL_RESULT_STYLE.header}>
                              <Text strong>变量提取</Text>
                            </div>

                            {item.after_vars &&
                            Object.keys(item.after_vars).length > 0 ? (
                              <RespProTable
                                columns={[
                                  { title: 'Key', dataIndex: 'key' },
                                  {
                                    title: 'Value',
                                    dataIndex: 'value',
                                    render: (v) => (
                                      <Text code>
                                        {v === null ? 'null' : v}
                                      </Text>
                                    ),
                                  },
                                ]}
                                dataSource={
                                  typeof item.after_vars === 'string'
                                    ? Object.entries(
                                        JSON.parse(item.after_vars),
                                      ).map(([key, value]) => ({ key, value }))
                                    : Object.entries(item.after_vars).map(
                                        ([key, value]) => ({ key, value }),
                                      )
                                }
                              />
                            ) : (
                              <div style={{ padding: 16, textAlign: 'center' }}>
                                <Text type="secondary">
                                  {item.after_vars === null
                                    ? 'SQL执行成功但未提取到变量'
                                    : '未配置变量提取规则'}
                                </Text>
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{ padding: 16, textAlign: 'center' }}>
                            <Text type="secondary">未配置后置SQL</Text>
                          </div>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </ProCard>
          );
        }
      })}
    </div>
  );
};

export default InterfaceApiResponseDetail;
