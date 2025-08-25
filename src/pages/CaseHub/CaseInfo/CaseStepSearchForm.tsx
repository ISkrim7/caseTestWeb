import { CaseHubConfig } from '@/pages/CaseHub/CaseConfig';
import { SearchOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, Space } from 'antd';
import { FC, useState } from 'react';

interface Props {
  showCheckButton: boolean;
}

const CaseStepSearchForm: FC<Props> = ({ showCheckButton }) => {
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
  const [form] = Form.useForm();
  const { CASE_LEVEL_OPTION, CASE_TYPE_OPTION } = CaseHubConfig;
  return (
    <ProCard
      extra={
        showCheckButton && (
          <Space>
            <Button>操作</Button>
          </Space>
        )
      }
    >
      <ProForm form={form} submitter={false}>
        <ProForm.Group
          style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
        >
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
            options={CASE_LEVEL_OPTION}
          />
          <ProFormSelect
            width="sm"
            name={'caseStepType'}
            placeholder="选择类型"
            mode="multiple"
            allowClear
            options={CASE_TYPE_OPTION}
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
