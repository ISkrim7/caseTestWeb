import { addLease, IAddLease } from '@/api/cbsAPI/signAPI';
import TitleName from '@/components/TitleName';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import {
  ProCard,
  ProForm,
  ProFormMoney,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const Index: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<IAddLease>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const onFinish = async () => {
    const value = await form.validateFields();
    const { code, data, msg } = await addLease(value);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };

  return (
    <ProCard
      title={TitleName('租赁草签合同构造')}
      style={{ borderRadius: '40px', marginBottom: '16px' }}
      bordered
      hoverable
    >
      <ProForm form={form} onFinish={onFinish}>
        <ProForm.Group>
          <CityForm
            form={form}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
            tag={'lease'}
          />
          <UsernameForm
            form={form}
            tag={1}
            name={'username'}
            label={'录入人'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="houseId"
            label="租赁房源ID"
            required={true}
            width={'md'}
            rules={[{ required: true, message: '房源ID必填' }]}
          />
          <ProFormMoney
            name="amount"
            width={'md'}
            label="全款成交价"
            initialValue={10000}
            addonAfter={'元'}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
