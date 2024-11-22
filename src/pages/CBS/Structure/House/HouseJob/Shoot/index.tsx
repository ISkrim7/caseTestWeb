import { addShoot, IShoot } from '@/api/cbsAPI/houseAPI';
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
import { Form, message } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const Index: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<IShoot>();
  const { BusinessType, SelectCity } = Utils();
  const [grid, setGrid] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const onFinish = async () => {
    const body = form.getFieldsValue();
    const { code, data, msg } = await addShoot(body);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };

  return (
    <ProCard
      title={TitleName('添加经纪人实勘')}
      style={{ borderRadius: '40px', marginBottom: '16px', marginTop: '16px' }}
      bordered
      hoverable
    >
      <ProForm title={'添加经纪人实勘'} form={form} onFinish={onFinish}>
        <ProForm.Group>
          <CityForm
            form={form}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
          <ProFormRadio.Group
            radioType={'button'}
            name="businessType"
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
            name="houseId"
            label="房源ID"
            width={'md'}
            required={true}
            rules={[{ required: true, message: '房源ID必填' }]}
          />
          <UsernameForm
            form={form}
            tag={1}
            name={'username'}
            label={'实勘录入人'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
