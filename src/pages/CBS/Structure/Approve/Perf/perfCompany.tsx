import {
  IPerfCompanyApprove,
  perfCompanyApprove,
} from '@/api/cbsAPI/appriveAPI';
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

const PerfCompany: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<IPerfCompanyApprove>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const buy_finish = async () => {
    const value = await form.validateFields();
    const { code, data, msg } = await perfCompanyApprove(value);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };
  return (
    <ProCard
      title={TitleName('公司平台补业绩审批流')}
      bordered
      hoverable
      style={{ borderRadius: '40px', marginBottom: '16px' }}
    >
      <ProForm form={form} onFinish={buy_finish}>
        <ProForm.Group>
          <CityForm
            form={form}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
          <ProFormText
            name="conId"
            width={'md'}
            label="合同conId编号"
            required={true}
            rules={[{ required: true, message: '合同conId必填' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="applyId"
            width={'md'}
            label="审批编号"
            required={true}
            rules={[{ required: true, message: '审批编号必填' }]}
          />
          <UsernameForm
            form={form}
            tag={1}
            name={'username'}
            label={'发起人ID'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default PerfCompany;
