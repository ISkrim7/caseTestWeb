import { addShowing, IAddShowing } from '@/api/cbsAPI/customAPI';
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
import { Form, message } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const Index: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<IAddShowing>();
  const { BusinessType } = Utils();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const onFinish = async () => {
    const value = await form.validateFields();
    const { code, data, msg } = await addShowing(value);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };
  return (
    <ProCard
      title={TitleName('添加客源与带看')}
      bordered
      hoverable
      style={{ borderRadius: '40px', marginBottom: '24px' }}
    >
      <ProForm form={form} onFinish={onFinish} title={'添加客源与带看'}>
        <ProForm.Group>
          <CityForm
            form={form}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
          <UsernameForm
            form={form}
            tag={1}
            name={'username'}
            label={'经纪人'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="houseId"
            label="房源ID"
            width={'md'}
            tooltip={'传递就是带看，不传递就是单纯得添加客源'}
          />
          <ProFormRadio.Group
            radioType={'button'}
            fieldProps={{
              buttonStyle: 'solid',
            }}
            name="businessTypeID"
            required={true}
            initialValue={'2'}
            label={'类型'}
            options={BusinessType}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
