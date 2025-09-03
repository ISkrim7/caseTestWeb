import { CaseHubConfig } from '@/pages/CaseHub/CaseConfig';
import { CaseSearchForm } from '@/pages/CaseHub/type';
import { SearchOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, Space } from 'antd';
import React, { FC } from 'react';

interface Props {
  showCheckButton: boolean;
  setSearchForm: React.Dispatch<React.SetStateAction<CaseSearchForm>>;
  tags: { label: string; value: string }[];
}

const CaseStepSearchForm: FC<Props> = ({
  tags,
  setSearchForm,
  showCheckButton,
}) => {
  const [form] = Form.useForm();
  const { CASE_LEVEL_OPTION, CASE_TYPE_OPTION } = CaseHubConfig;

  const onSearch = async () => {
    const values = await form.getFieldsValue();
    console.log(values);
    if (values) {
      setSearchForm(values);
    }
  };

  const onReset = () => {
    form.resetFields();
    setSearchForm({});
  };
  return (
    <ProCard
      title={'搜索'}
      defaultCollapsed={true}
      collapsible={true}
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
            name="case_name"
            placeholder="请输入步骤名称"
            fieldProps={{
              allowClear: true,
              prefix: <SearchOutlined />,
            }}
          />
          <ProFormSelect
            width="sm"
            name={'case_tag'}
            placeholder="选择标签"
            mode="single"
            allowClear
            options={tags}
          />
          <ProFormSelect
            width="sm"
            name={'case_level'}
            placeholder="选择等级"
            mode="single"
            allowClear
            options={CASE_LEVEL_OPTION}
          />
          <ProFormSelect
            width="sm"
            name={'case_type'}
            placeholder="选择类型"
            mode="single"
            allowClear
            options={CASE_TYPE_OPTION}
          />
          <Space
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button onClick={onSearch}>搜索</Button>
            <Button onClick={onReset}>重置</Button>
          </Space>
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default CaseStepSearchForm;
