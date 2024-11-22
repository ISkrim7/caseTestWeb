import { IOperateBuilding, operateBuilding } from '@/api/cbsAPI/houseAPI';
import TitleName from '@/components/TitleName';
import BuildingForm from '@/pages/CBS/component/BuildingForm';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const operateOpt = [
  {
    label: '立即入库',
    value: 1,
  },
  {
    label: '发起采集',
    value: 2,
  },
];
const Index: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [form] = Form.useForm<IOperateBuilding>();
  const [operateValue, setOperateValue] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const onFinish = async () => {
    const body = form.getFieldsValue();
    const { code, data, msg } = await operateBuilding(body);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };

  return (
    <ProCard
      title={TitleName('楼盘库纠错')}
      style={{ borderRadius: '40px', marginBottom: '36px', marginTop: '36px' }}
      bordered
      hoverable
    >
      <ProForm form={form} onFinish={onFinish}>
        <ProForm.Group>
          <CityForm
            form={form}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
          <BuildingForm form={form} currentCityID={selectedCityId} />
        </ProForm.Group>

        <ProForm.Group>
          <UsernameForm
            form={form}
            tag={2}
            name={'builder'}
            label={'楼盘专员'}
            currentCityID={selectedCityId}
          />
          <ProFormSelect
            tooltip={'采集目前只支持北京'}
            colProps={{ md: 8, xl: 4 }}
            name="operate"
            width={'md'}
            label="纠错类型"
            fieldProps={{
              labelInValue: false,
              onSelect: (value: number) => {
                if (value === 2) {
                  setSelectedCity('beijing');
                }
                setOperateValue(value);
              },
            }}
            required={true}
            initialValue={operateValue}
            options={operateOpt}
            rules={[{ required: true, message: '操作类型' }]}
          />
          {operateValue === 2 ? (
            <>
              <ProFormText
                colProps={{ md: 8, xl: 4 }}
                name="signee"
                width={'md'}
                label="签收人"
                initialValue={'569969'}
                tooltip="写死苏超"
                readonly
              />
              <ProFormText
                colProps={{ md: 8, xl: 4 }}
                name="assignee"
                label="采集人"
                width={'md'}
                initialValue={'67910'}
                tooltip="写死张慧"
                readonly
              />
            </>
          ) : null}
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText
            name="buildId"
            width={'md'}
            colProps={{ md: 3, xl: 4 }}
            label="楼栋ID"
          />
          <ProFormText
            name="unitId"
            width={'md'}
            colProps={{ md: 3, xl: 4 }}
            label="单元ID"
          />
          <ProFormText
            width={'md'}
            colProps={{ md: 3, xl: 4 }}
            name="floorId"
            label="楼层ID"
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
