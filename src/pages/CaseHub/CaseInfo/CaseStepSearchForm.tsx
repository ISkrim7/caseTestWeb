import { SearchOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, Space } from 'antd';
import { useState } from 'react';

const caseLevel = [
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
  {
    label: 'P0',
    value: 'P0',
  },
];

const caseType = [
  {
    label: '冒烟',
    value: '冒烟',
  },
  {
    label: '普通',
    value: '普通',
  },
];
const CaseStepSearchForm = () => {
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
  const [form] = Form.useForm();

  return (
    <ProCard
      extra={
        <Space>
          <Button>搜索</Button>
          <Button>重置</Button>
        </Space>
      }
    >
      <ProForm form={form} submitter={false}>
        <ProForm.Group>
          <ProFormText
            width="sm"
            name="caseStepName"
            placeholder="请输入步骤名称"
            fieldProps={{
              allowClear: true,
              prefix: <SearchOutlined />,
            }}
          />
          <ProFormSelect
            width="sm"
            name={'caseStepTag'}
            placeholder="选择标签"
            mode="multiple"
            allowClear
            options={tags}
          />
          <ProFormSelect
            width="sm"
            name={'caseStepLevel'}
            placeholder="选择等级"
            mode="multiple"
            allowClear
            options={caseLevel}
          />
          <ProFormSelect
            width="sm"
            name={'caseStepType'}
            placeholder="选择类型"
            mode="multiple"
            allowClear
            options={caseType}
          />
          <Space
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button>搜索</Button>
            <Button>重置</Button>
          </Space>
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default CaseStepSearchForm;
