import { collect } from '@/api/cbsAPI/signAPI';
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

const Collected: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [financeForm] = Form.useForm<any>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const finish = async () => {
    const value = await financeForm.validateFields();
    const { code, data, msg } = await collect(value);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };

  return (
    <ProCard
      title={TitleName('正式合同 应收收齐')}
      bordered
      hoverable
      style={{ borderRadius: '40px', marginBottom: '16px' }}
    >
      <ProForm form={financeForm} onFinish={finish}>
        <ProForm.Group>
          <CityForm
            form={financeForm}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
          <ProFormText
            name="conId"
            label="合同conId编号"
            width={'md'}
            required={true}
            rules={[{ required: true, message: '合同conId必填' }]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <UsernameForm
            form={financeForm}
            tag={1}
            name={'username'}
            label={'经纪人'}
            currentCityID={selectedCityId}
          />
          <UsernameForm
            form={financeForm}
            tag={3}
            name={'approve_by'}
            label={'财务审批人ID'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Collected;
