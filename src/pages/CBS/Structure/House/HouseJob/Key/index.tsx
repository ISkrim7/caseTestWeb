import { addKey, AddKeyType } from '@/api/cbsAPI/houseAPI';
import TitleName from '@/components/TitleName';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import Utils from '@/pages/CBS/component/utils';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { DatePicker, Form, message } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const Index: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<any>();
  const { BusinessType, KeyTypes, SelectCity } = Utils();
  const [grid, setGrid] = useState(true);
  const [selectedCityId, setSelectedCityId] = useState<number>();
  const [selectedCity, setSelectedCity] = useState<string>();

  const onKeyFinish = async () => {
    const { time, city, username, houseId, keyType, approve, businessType } =
      await form.validateFields();
    const start_time = time[0].toISOString().split('T')[0];
    const end_time = time[1].toISOString().split('T')[0];
    const body: AddKeyType = {
      city,
      username,
      houseId,
      keyType,
      start_time,
      end_time,
      approve,
      businessType,
    };
    console.log(body);
    const { code, data, msg } = await addKey(body);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };

  return (
    <ProCard
      title={TitleName('钥匙协议')}
      style={{ borderRadius: '40px', marginBottom: '16px', marginTop: '16px' }}
      bordered
      hoverable
    >
      <ProForm form={form} onFinish={onKeyFinish}>
        <ProForm.Group>
          <CityForm
            form={form}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
          <ProFormText
            name="houseId"
            label="房源ID"
            width={'md'}
            required={true}
            rules={[{ required: true, message: '房源ID必填' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormRadio.Group
            radioType={'button'}
            name="businessType"
            initialValue={'2'}
            label="房源类型"
            required={true}
            options={BusinessType}
          />
          <ProFormRadio.Group
            name={'keyType'}
            radioType={'button'}
            initialValue={'1'}
            label={'钥匙类型'}
            required={true}
            options={KeyTypes}
          />
          <ProFormSwitch
            fieldProps={{
              onChange: setGrid,
            }}
            initialValue={grid}
            label="是否需要完成一二审"
            name="approve"
          />
        </ProForm.Group>
        <ProForm.Group>
          <Form.Item label={'起始时间'} name="time" required={true}>
            {/*// @ts-ignore*/}
            <DatePicker.RangePicker />
          </Form.Item>
          <UsernameForm
            form={form}
            tag={1}
            name={'username'}
            label={'钥匙录入人'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
