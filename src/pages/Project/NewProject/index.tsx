import { IProject } from '@/api';
import { newProject, searchUser } from '@/api/base';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';

interface SearchUser {
  value: number | undefined;
  label: string | undefined;
}

interface selfProps {
  reload: Function | undefined;
}

const Index: React.FC<selfProps> = (props) => {
  let { reload } = props;

  const queryUser: any = async (value: any) => {
    const { keyWords } = value;
    if (keyWords) {
      const { code, data } = await searchUser({ username: keyWords });
      if (code === 0) {
        return data.map((item) => ({
          label: item.username,
          value: item.id,
        }));
      }
    }
  };

  return (
    <ModalForm<IProject>
      title="新建项目"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建项目
        </Button>
      }
      autoFocusFirstInput
      // 关闭执录入执行
      modalProps={{
        onCancel: () => console.log('close'),
      }}
      onFinish={async (values) => {
        const res = await newProject({ ...values });
        message.success(res.msg);
        reload!(true);
        return true;
      }}
    >
      <ProFormText
        name="title"
        label="项目名称"
        placeholder="input your project name"
        required={true}
      />
      <ProFormText
        name="desc"
        label="项目描述"
        placeholder="input your project desc"
      />
      <ProFormSelect
        showSearch
        name="chargeId"
        label="项目负责人"
        placeholder="input your admin name to search"
        rules={[{ required: true, message: 'Please select !' }]}
        debounceTime={1000}
        request={queryUser}
      />
    </ModalForm>
  );
};

export default Index;
