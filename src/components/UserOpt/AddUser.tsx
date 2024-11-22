import { IDepartment, IUser } from '@/api';
import { departmentQuery, UserOpt, userTagQuery } from '@/api/user';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  RequestOptionsType,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';

interface selfProps {
  reload: Function | undefined;
}

const Index: React.FC<selfProps> = (props) => {
  let { reload } = props;

  return (
    <ModalForm<IUser>
      title="添加用户"
      trigger={
        <Button type={'primary'}>
          <PlusOutlined />
          添加用户
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        onCancel: () => {
          console.log('oncancel');
        },
      }}
      onFinish={async (values: IUser) => {
        const res = await UserOpt('POST', values);
        message.success(res.msg);
        reload!(true);
        return true;
      }}
    >
      <ProFormText
        name="username"
        label="用户名"
        placeholder="input username"
        required={true}
      />
      <ProFormText name="phone" label="电话" placeholder="input phone" />
      <ProFormSelect
        name="gender"
        label="性别"
        placeholder="input gender"
        valueEnum={{
          1: '男',
          0: '女',
        }}
      />
      <ProFormSelect
        showSearch
        name="departmentID"
        label="部门"
        placeholder="input department"
        request={async () => {
          let data: any;
          ({ data } = await departmentQuery('GET'));
          const res: RequestOptionsType[] = [];
          data.forEach((item: IDepartment) => {
            res.push({
              label: item.name,
              value: item.id,
            });
          });
          return res;
        }}
      />
      <ProFormSelect
        name="tagName"
        label="标签"
        placeholder="select tag"
        required={false}
        dependencies={['departmentID']}
        request={async (params) => {
          const res: RequestOptionsType[] = [];
          if (params.departmentID) {
            const form = {
              id: params.departmentID,
            };
            let { data } = await userTagQuery(form);
            data.forEach((item: any) => {
              res.push({
                label: item.name,
                value: item.name,
              });
            });
          }

          return res;
        }}
      />
    </ModalForm>
  );
};

export default Index;
