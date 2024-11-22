import { IFinanceApprove } from '@/api';
import { financeApprove } from '@/api/cbsAPI/appriveAPI';
import TitleName from '@/components/TitleName';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const typeEnum = [
  { label: '付&退款申请单', value: '1' },
  { label: '付&退款失败审批', value: '2' },
  { label: '付款单风控审批', value: '3' },
];

const Index: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<IFinanceApprove>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const approve_finish = async () => {
    const value = await form.validateFields();
    const { code, data } = await financeApprove(value);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    }
  };

  return (
    <ProCard
      title={TitleName('财务审批流')}
      bordered
      hoverable
      style={{ borderRadius: '40px', marginBottom: '16px' }}
    >
      <ProForm form={form} onFinish={approve_finish}>
        <ProForm.Group>
          <CityForm
            form={form}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
          <ProFormSelect
            width={'md'}
            label={'操作类型'}
            initialValue={'1'}
            options={typeEnum}
            name={'type'}
            required
            rules={[{ required: true, message: '操作类型必选' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <UsernameForm
            form={form}
            tag={1}
            name={'username'}
            label={'经纪人'}
            currentCityID={selectedCityId}
          />
          <ProFormText
            width={'md'}
            name={'id'}
            label={'单号'}
            required
            rules={[{ required: true, message: '单号必填' }]}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
