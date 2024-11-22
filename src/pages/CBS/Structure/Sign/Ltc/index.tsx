import { addLtc, ILtcValue } from '@/api/cbsAPI/signAPI';
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

const { RangePicker } = DatePicker;

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const Index: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<any>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();
  const { BusinessType } = Utils();
  const dateFormat = 'YYYY-MM-DD';

  const onFinish = async () => {
    const value = form.getFieldsValue();
    const body: ILtcValue = {
      city: value.city,
      username: value.username,
      password: value.password,
      houseId: value.houseId,
      businessType: value.businessType,
    };

    body.start_time = value.time[0]?.toISOString().split('T')[0];
    body.end_time = value.time[1]?.toISOString().split('T')[0];
    const { code, data, msg } = await addLtc(body);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };

  return (
    <ProCard
      title={TitleName('限递草签合同构造')}
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
            tag={'ltc'}
          />
          <UsernameForm
            form={form}
            tag={1}
            name={'username'}
            label={'限递录入人'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="houseId"
            label="房源ID"
            width={'md'}
            required={true}
            rules={[{ required: true, message: '房源ID必填' }]}
          />
          <ProFormRadio.Group
            radioType={'button'}
            name="businessType"
            fieldProps={{
              buttonStyle: 'solid',
            }}
            initialValue={'2'}
            label="房源类型"
            required={true}
            options={BusinessType}
          />
        </ProForm.Group>
        <ProForm.Group></ProForm.Group>
        <ProForm.Group>
          <Form.Item
            label={'起始时间'}
            name="time"
            rules={[{ required: true, message: '时间必选' }]}
            required={true}
          >
            {/*// @ts-ignore*/}
            <RangePicker format={dateFormat} />
          </Form.Item>
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
