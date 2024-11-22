import { signApprove } from '@/api/cbsAPI/appriveAPI';
import TitleName from '@/components/TitleName';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import {
  ProCard,
  ProForm,
  ProFormGroup,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const Index: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<{
    conId: string;
    username: string;
    city: string;
    conCode: string;
  }>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const onFinish = async () => {
    const value = await form.validateFields();
    const { code, data, msg } = await signApprove(value);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };
  return (
    <ProCard
      title={TitleName('正式合同审批')}
      bordered
      hoverable
      style={{ borderRadius: '40px', marginBottom: '16px' }}
    >
      <ProForm form={form} onFinish={onFinish}>
        <ProForm.Group>
          <CityForm
            form={form}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
        </ProForm.Group>
        <ProFormGroup>
          <ProFormText
            name="conId"
            label="合同ConId"
            width={'md'}
            required={true}
            rules={[{ required: true, message: 'conId必填' }]}
          />
          <ProFormText
            name="conCode"
            label="合同编号"
            width={'md'}
            required={true}
            rules={[{ required: true, message: 'conCode必填' }]}
          />
        </ProFormGroup>
        <ProForm.Group>
          <UsernameForm
            form={form}
            tag={1}
            name={'username'}
            label={'发起人'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
