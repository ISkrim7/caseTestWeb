import {
  queryInterGlobalFunc,
  queryInterGlobalVariable,
} from '@/api/inter/interGlobal';
import MyTabs from '@/components/MyTabs';
import VarModalForm from '@/pages/Httpx/InterfaceConfig/VarModalForm';
import {
  IInterfaceGlobalFunc,
  IInterfaceGlobalVariable,
} from '@/pages/Httpx/types';
import { GoogleSquareFilled, SearchOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Button, Popover, Select, Space, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { FC, useEffect, useState } from 'react';

interface ISelfProps {
  value?: string | undefined;
  setValue?: ((rowIndex: string | number, data: any) => void) | undefined;
  index?: React.Key | undefined;
}

const ApiVariableFunc: FC<ISelfProps> = ({ value, index, setValue }) => {
  const [open, setOpen] = useState(false);
  const [currentActiveKey, setCurrentActiveKey] = useState<string>('1');
  const [currentValue, setCurrentValue] = useState<IInterfaceGlobalFunc>();
  const [currentData, setCurrentData] = useState<IInterfaceGlobalVariable>();
  const [selectValue, setSelectValue] = useState<string>();
  const [funcData, setFuncData] = useState<any[]>([]);
  const [varData, setVarData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const fetch_func_data = async () => {
    queryInterGlobalFunc().then(async ({ code, data }) => {
      if (code === 0) {
        const func = data.map((item: IInterfaceGlobalFunc) => {
          return {
            label: (
              <span
                onMouseEnter={() => {
                  setCurrentValue(item);
                }}
              >
                <GoogleSquareFilled style={{ color: 'blue' }} />
                {item.label}
              </span>
            ),
            value: item.value,
            desc: item.description,
          };
        });
        setFuncData(func);
      }
    });
  };
  const fetch_var_data = async () => {
    queryInterGlobalVariable().then(async ({ code, data }) => {
      if (code === 0) {
        const var_data = data.map((item: IInterfaceGlobalVariable) => {
          return {
            label: (
              <span
                onMouseEnter={(event) => {
                  event.stopPropagation();
                  setCurrentData(item);
                }}
              >
                <Space>
                  <GoogleSquareFilled style={{ color: 'blue' }} />
                  {item.key}
                </Space>
              </span>
            ),
            value: `{{${item.key}}}`,
          };
        });
        setVarData(var_data);
      }
    });
  };

  useEffect(() => {
    Promise.all([fetch_func_data(), fetch_var_data()]).then(() => {});
  }, [refresh]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const items = [
    {
      key: '1',
      label: 'Func',
      children: (
        <ProCard split={'horizontal'} bodyStyle={{ minHeight: 100 }}>
          <ProCard bodyStyle={{ padding: 5 }}>
            <Select
              allowClear
              showSearch
              autoFocus
              onChange={(value) => {
                setSelectValue(value);
              }}
              onClear={() => {
                setSelectValue(undefined);
                setCurrentValue(undefined);
              }}
              options={funcData}
              dropdownRender={(menu) => (
                <>
                  <ProCard split={'vertical'}>
                    <ProCard bodyStyle={{ padding: 0 }}>{menu}</ProCard>
                    <ProCard bodyStyle={{ padding: 5 }}>
                      {currentValue && (
                        <Space direction="vertical">
                          <Typography.Text type={'secondary'}>
                            变量名
                          </Typography.Text>
                          <Typography.Text code>
                            {currentValue.label}
                          </Typography.Text>
                          <Typography.Text type={'secondary'}>
                            变量值
                          </Typography.Text>
                          <Typography.Text code>
                            {currentValue?.value}
                          </Typography.Text>
                          <Typography.Text type={'secondary'}>
                            预览
                          </Typography.Text>
                          <Typography.Text code>
                            {currentValue?.demo}
                          </Typography.Text>
                        </Space>
                      )}
                    </ProCard>
                  </ProCard>
                </>
              )}
            />
          </ProCard>
          <ProCard bodyStyle={{ padding: 5 }}>
            <Space direction={'vertical'}>
              {currentValue && (
                <>
                  <Typography.Text type={'secondary'}>表达式</Typography.Text>
                  <Typography.Text code copyable>
                    {' '}
                    {selectValue}{' '}
                  </Typography.Text>
                  <Typography.Text type={'secondary'}>描述</Typography.Text>
                  <Typography.Text>{currentValue?.description}</Typography.Text>
                  <Typography.Text type={'secondary'}>预览</Typography.Text>
                  <Typography.Text code>{currentValue?.demo}</Typography.Text>
                </>
              )}
            </Space>
          </ProCard>
        </ProCard>
      ),
    },
    {
      key: '2',
      label: 'Var',
      children: (
        <ProCard split={'horizontal'} bodyStyle={{ minHeight: 100 }}>
          <ProCard bodyStyle={{ padding: 5 }}>
            <Select
              allowClear
              showSearch
              autoFocus
              onChange={(value) => {
                setSelectValue(value);
              }}
              onClear={() => {
                setSelectValue(undefined);
                setCurrentData(undefined);
              }}
              options={varData}
              dropdownRender={(menu) => (
                <>
                  <ProCard split={'vertical'}>
                    <ProCard bodyStyle={{ padding: 0 }}>{menu}</ProCard>
                    <ProCard bodyStyle={{ padding: 5 }}>
                      {currentData && (
                        <Space direction="vertical">
                          <Typography.Text type={'secondary'}>
                            变量名
                          </Typography.Text>
                          <Typography.Text code>
                            {currentData.key}
                          </Typography.Text>
                          <Typography.Text type={'secondary'}>
                            变量值
                          </Typography.Text>
                          <Typography.Text code>
                            {currentData?.value &&
                            currentData?.value.length > 15
                              ? currentData?.value.substring(0, 15) + '...'
                              : currentData?.value}
                          </Typography.Text>
                        </Space>
                      )}
                    </ProCard>
                  </ProCard>
                </>
              )}
            />
          </ProCard>
          <ProCard bodyStyle={{ padding: 5 }}>
            <Space direction={'vertical'}>
              {currentData && (
                <>
                  <Typography.Text type={'secondary'}>表达式</Typography.Text>
                  <Typography.Text code copyable>
                    {selectValue}
                  </Typography.Text>
                  <Typography.Text type={'secondary'}>变量值</Typography.Text>
                  <Typography.Text code>
                    {currentData?.value && currentData?.value.length > 40
                      ? currentData?.value.substring(0, 40) + '...'
                      : currentData?.value}
                  </Typography.Text>
                </>
              )}
            </Space>
          </ProCard>
        </ProCard>
      ),
    },
  ];
  const Content = (
    <ProCard split={'horizontal'} style={{ height: 370, width: 400 }}>
      <MyTabs
        items={items}
        defaultActiveKey={currentActiveKey}
        onChangeKey={(key) => setCurrentActiveKey(key)}
      />
      <ProCard style={{ marginTop: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {selectValue && (
            <Space>
              <Button
                onClick={() => {
                  if (selectValue && index) {
                    setValue?.(index, { value: selectValue });
                  }
                  setOpen(false);
                }}
              >
                添加
              </Button>
              <Button
                onClick={() => {
                  if (selectValue && index) {
                    if (value) {
                      setValue?.(index, { value: value + selectValue });
                    } else {
                      setValue?.(index, { value: selectValue });
                    }
                  }
                  setOpen(false);
                }}
              >
                插入
              </Button>
            </Space>
          )}
          {currentActiveKey === '2' && (
            <Button
              type="primary"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              新增
            </Button>
          )}
        </div>
      </ProCard>
    </ProCard>
  );

  return (
    <>
      <VarModalForm
        open={isModalOpen}
        setOpen={setIsModalOpen}
        callBack={() => setRefresh(!refresh)}
      />
      <Popover
        content={Content}
        title={<Title level={5}>引用变量</Title>}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <SearchOutlined />
      </Popover>
    </>
  );
};
export default ApiVariableFunc;
