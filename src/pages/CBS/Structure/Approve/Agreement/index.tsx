import { agreementApprove, IAgreementApprove } from '@/api/cbsAPI/appriveAPI';
import TitleName from '@/components/TitleName';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const Index: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<IAgreementApprove>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();
  const onFinish = async () => {
    const body = await form.validateFields();
    const { code, data, msg } = await agreementApprove(body);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };
  return (
    <ProCard
      title={TitleName('协议审批流')}
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
          <ProFormText
            name="agreementId"
            label="协议编号"
            width={'md'}
            required={true}
            rules={[{ required: true, message: '协议编号agreementId必填' }]}
          />
        </ProForm.Group>
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
