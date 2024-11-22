import { IPerfApprove, perfApprove } from '@/api/cbsAPI/appriveAPI';
import TitleName from '@/components/TitleName';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const PerfAdJust: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<IPerfApprove>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const approve_finish = async () => {
    const value = await form.validateFields();
    const { code, data, msg } = await perfApprove(value);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };

  return (
    <ProCard
      title={TitleName('业绩调整申请单审批流')}
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
          <ProFormRadio.Group
            radioType={'button'}
            fieldProps={{
              buttonStyle: 'solid',
            }}
            name="businessType"
            initialValue={'2'}
            width={'md'}
            label="合同类型"
            required={true}
            options={[
              {
                label: '租赁',
                value: '1',
              },
              {
                label: '买卖',
                value: '2',
              },
              {
                label: '意向',
                value: '3',
              },
            ]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText
            name="applyNo"
            label="审批流ID"
            width={'md'}
            required={true}
            rules={[{ required: true, message: '审批编号必填' }]}
          />
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

export default PerfAdJust;
