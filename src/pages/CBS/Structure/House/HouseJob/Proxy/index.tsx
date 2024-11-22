import { addProxy, AddProxyType } from '@/api/cbsAPI/houseAPI';
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
  const { BusinessType, SelectCity } = Utils();
  const [grid, setGrid] = useState(true);
  const [selectedCityId, setSelectedCityId] = useState<number>();
  const [selectedCity, setSelectedCity] = useState<string>();

  const onProxyFinish = async () => {
    const value = form.getFieldsValue();
    const { time, businessType, approve, ...rest } = value;
    const [start_time, end_time] = time.map(
      (date: any) => date.toISOString().split('T')[0],
    );
    const body: AddProxyType = {
      start_time,
      end_time,
      businessType,
      approve,
      ...rest,
    };
    const { code, data, msg } = await addProxy(body);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };

  return (
    <ProCard
      title={TitleName('委托书')}
      style={{ borderRadius: '40px', marginBottom: '16px', marginTop: '16px' }}
      bordered
      hoverable
    >
      <ProForm form={form} onFinish={onProxyFinish}>
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

          <ProFormRadio.Group
            radioType={'button'}
            name="businessType"
            width={'md'}
            layout="horizontal"
            initialValue={'2'}
            label="房源类型"
            required={true}
            options={BusinessType}
          />
          <ProFormSwitch
            fieldProps={{
              onChange: setGrid,
            }}
            initialValue={grid}
            label="是否需要完成审批"
            name="approve"
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText
            name="area"
            label="面积"
            width={'md'}
            initialValue={'100'}
            required={true}
            rules={[{ required: true, message: '面积必填' }]}
          />
          <ProFormText
            name="floor"
            label="楼层"
            width={'md'}
            initialValue={'1'}
            required={true}
            rules={[{ required: true, message: '楼层必填' }]}
          />
          <ProFormText
            name="price"
            label="委托价格"
            width={'md'}
            initialValue={'100'}
            addonAfter={'万'}
            required={true}
            rules={[{ required: true, message: '委托价格必填' }]}
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
            label={'委托录入人'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
