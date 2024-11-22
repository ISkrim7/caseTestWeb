import { addCProxy, IAddCProxy } from '@/api/cbsAPI/customAPI';
import TitleName from '@/components/TitleName';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import Utils from '@/pages/CBS/component/utils';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { DatePicker, Form, message } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const CustomProxy: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [proxyForm] = Form.useForm<any>();
  const { BusinessType } = Utils();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const onProxyFinish = async () => {
    const value = await proxyForm.validateFields();
    const start_time = value.time[0].toISOString().split('T')[0];
    const end_time = value.time[1].toISOString().split('T')[0];
    const body: IAddCProxy = {
      city: value.city,
      clientId: value.clientId,
      username: value.username,
      password: value.password,
      start_time: start_time,
      end_time: end_time,
      businessType: value.businessType,
    };
    console.log(body);
    const { code, data, msg } = await addCProxy(body);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };
  return (
    <ProCard
      title={TitleName('添加草拟委托')}
      style={{ borderRadius: '40px', marginBottom: '24px' }}
      bordered
      hoverable
    >
      <ProForm form={proxyForm} onFinish={onProxyFinish}>
        <ProForm.Group>
          <CityForm
            form={proxyForm}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
          <UsernameForm
            form={proxyForm}
            tag={1}
            name={'username'}
            label={'经纪人'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="clientId"
            label="客户ID"
            width={'md'}
            tooltip={'不传就新造一个客户'}
            required={false}
          />
          <ProFormRadio.Group
            radioType={'button'}
            fieldProps={{
              buttonStyle: 'solid',
            }}
            name="businessType"
            required={true}
            initialValue={'2'}
            label={'类型'}
            options={BusinessType}
          />
        </ProForm.Group>
        <Form.Item label={'起始时间'} name="time" required={true}>
          {/*// @ts-ignore*/}
          <DatePicker.RangePicker />
        </Form.Item>
      </ProForm>
    </ProCard>
  );
};

export default CustomProxy;
