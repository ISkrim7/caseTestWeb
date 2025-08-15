import CaseSubSteps from '@/pages/CaseHub/CaseStep/CaseSubSteps';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { useState } from 'react';

const Index = () => {
  const [collapsible, setCollapsible] = useState<boolean>(true);

  const CardTitle = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{ marginRight: 8, cursor: 'pointer' }}
        onClick={() => setCollapsible(!collapsible)}
      >
        {collapsible ? <RightOutlined /> : <DownOutlined />}
      </div>
      <Space size={'large'} style={{ marginLeft: 10 }}>
        <ProFormText
          style={{ fontWeight: 'bold' }}
          fieldProps={{
            style: {
              borderRadius: 20,
              height: 'auto',
              width: '500px', // 添加宽度限制
            },
          }}
          allowClear
          noStyle={true}
          name={'case_title'}
          initialValue={'标题'}
          placeholder={'请输入用例标题'}
          required={true}
          tooltip={'最长20位'}
          rules={[{ required: true, message: '标题不能为空' }]}
        />
        <ProFormRadio.Group
          noStyle
          style={{ borderRadius: 20 }}
          name="radio-group"
          radioType="button"
          required={true}
          fieldProps={{
            buttonStyle: 'solid',
          }}
          initialValue={'P1'}
          options={[
            {
              label: 'P0',
              value: 'P0',
            },
            {
              label: 'P1',
              value: 'P1',
            },
            {
              label: 'P2',
              value: 'P2',
            },
            {
              label: 'P3',
              value: 'P3',
            },
          ]}
        />
        <ProFormSelect
          noStyle
          style={{
            borderRadius: 20,
            height: 'auto',
          }}
          name={'fieldA'}
          initialValue={'A'}
          options={[
            {
              label: 'A',
              value: 'A',
            },
            {
              label: 'B',
              value: 'B',
            },
          ]}
        />
        <ProFormSelect
          allowClear={true}
          noStyle
          style={{
            borderRadius: 20,
            height: 'auto',
          }}
          name={'fieldB'}
          initialValue={'A'}
          options={[
            {
              label: 'A',
              value: 'A',
            },
            {
              label: 'B',
              value: 'B',
            },
          ]}
        />
      </Space>
    </div>
  );

  const ExtraOpt = (
    <Space>
      <Button>+ 添加步骤</Button>
      <Button>复制</Button>
      <Button>删除</Button>
    </Space>
  );
  return (
    <>
      <ProCard
        title={CardTitle}
        extra={ExtraOpt}
        subTitle={null}
        split="vertical"
        bordered
        boxShadow={true}
        bodyStyle={{
          padding: 10,
        }}
        collapsible={false}
        collapsed={collapsible}
        defaultCollapsed={true}
        headerBordered
        headStyle={{
          height: 80,
        }}
      >
        <CaseSubSteps />
      </ProCard>
    </>
  );
};

export default Index;
