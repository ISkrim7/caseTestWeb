import { insertHouse, InsertHouseType } from '@/api/cbsAPI/houseAPI';
import TitleName from '@/components/TitleName';
import BuildingForm from '@/pages/CBS/component/BuildingForm';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import Utils from '@/pages/CBS/component/utils';
import HouseOwn from '@/pages/CBS/Structure/House/InsertHouse/houseOwn';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const Index: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<InsertHouseType>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();
  const { generateChinesePhoneNumber, BusinessType } = Utils();
  const [houseOwnOption, setHouseOwnOption] = useState<
    { label: string; value: number }[]
  >([]);
  const [initSynchronous, setSynchronous] = useState(false);

  useEffect(() => {
    if (selectedCity) {
      setHouseOwnOption(HouseOwn(selectedCity));
    }
  }, [selectedCity]);
  useEffect(() => {
    if (initSynchronous) {
      form.setFieldValue('businessType', ['1', '2']);
    } else {
      form.resetFields(['businessType']);
    }
  }, [initSynchronous]);
  /**
   * 表单提交
   */
  const onFinish = async () => {
    const values = form.getFieldsValue();
    if (values.businessType.length === 2) {
      values.businessType = '3';
    } else {
      values.businessType = values.businessType[0];
    }
    const { code, data, msg } = await insertHouse(values);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };

  return (
    <ProCard
      title={TitleName('创建房源')}
      bordered
      hoverable
      style={{ borderRadius: '40px', marginBottom: '16px', marginTop: '16px' }}
    >
      <ProForm form={form} onFinish={onFinish}>
        <ProForm.Group>
          <CityForm
            form={form}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
          <BuildingForm form={form} currentCityID={selectedCityId} />
          <ProFormSelect
            name="houseOwn"
            label="房屋性质"
            width={'md'}
            colProps={{ md: 8, xl: 5 }}
            showSearch={true}
            fieldProps={{
              labelInValue: false,
              defaultValue: '1',
              style: {
                minWidth: 200,
              },
            }}
            required={true}
            initialValue={'1'}
            options={houseOwnOption}
            rules={[{ required: true, message: '房屋性质必选' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormRadio.Group
            name="synchronous"
            width={'md'}
            label="创建与同步实勘"
            tooltip={
              '同步：买卖实勘同步租赁房源场景，且楼盘实勘类型需为经纪人实勘\n' +
              '不同步：仅构建房源'
            }
            initialValue={initSynchronous}
            fieldProps={{
              defaultValue: initSynchronous,
              onChange: ({ target }) => {
                console.log('===', target.value);
                setSynchronous(target.value);
              },
            }}
            options={[
              {
                label: '同步',
                value: true,
              },
              {
                label: '不同步',
                value: false,
              },
            ]}
          />
          <ProFormSelect
            disabled={initSynchronous}
            name="businessType"
            width={'md'}
            label="房屋类型"
            colProps={{ md: 8, xl: 5 }}
            fieldProps={{
              labelInValue: false,
              defaultValue: '1',
              style: {
                minWidth: 200,
              },
            }}
            required={true}
            initialValue={'2'}
            mode={'multiple'}
            options={BusinessType}
            rules={[{ required: true, message: '房屋类型必选' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <UsernameForm
            form={form}
            tag={1}
            name={'username'}
            label={'房源录入人'}
            currentCityID={selectedCityId}
          />
          <UsernameForm
            form={form}
            tag={2}
            name={'builder'}
            label={'楼盘专员'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="name"
            label="业主名称"
            width={'md'}
            colProps={{ md: 8, xl: 5 }}
            initialValue="大娃"
            required={true}
            rules={[{ required: true, message: '业主称必填' }]}
          />
          <ProFormText
            name="phone"
            label="业主电话"
            width={'md'}
            colProps={{ md: 8, xl: 5 }}
            initialValue={generateChinesePhoneNumber()}
            required={true}
            rules={[{ required: true, message: '业主电话必填' }]}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
