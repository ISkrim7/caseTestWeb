import { IUserLeaveModify, userLeaveModify } from '@/api/cbsAPI/modifyAPI';
import TitleName from '@/components/TitleName';
import Utils from '@/pages/CBS/component/utils';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useState } from 'react';
const jobEnum = [
  {
    label: '钥匙协议',
    value: 1,
  },
  {
    label: '委托书',
    value: 2,
  },
  {
    label: '经纪人实勘',
    value: 3,
  },
];
const tagEnum = [
  {
    label: '人员离职',
    value: 'leave',
  },
];

const UserLeave = () => {
  const [form] = Form.useForm<IUserLeaveModify>();
  const { cityList, CityUser, BusinessType } = Utils();
  const [city, setCity] = useState('beijing');

  const onFinish = async () => {
    const body = await form.validateFields();
    console.log(body);
    const { code, data, msg } = await userLeaveModify(body);
    if (code == 0) {
      message.success(msg);
      return;
    }
  };
  return (
    <ProCard
      title={TitleName('人员离职异动')}
      style={{
        borderRadius: '40px',
        marginBottom: '16px',
        marginTop: '16px',
      }}
      bordered
      hoverable
    >
      <ProForm form={form} onFinish={onFinish}>
        <ProForm.Group>
          <ProFormRadio.Group
            name="city"
            initialValue={city}
            label="城市"
            required
            options={cityList}
            fieldProps={{
              onChange: ({ target }) => {
                setCity(target.value);
              },
            }}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="username"
            width={'md'}
            label={'目标人员ID'}
            required
            rules={[{ required: true, message: '目标人员ID必填' }]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText name="buy_houseId" width={'md'} label="买卖房源ID" />
          <ProFormSelect
            mode={'multiple'}
            width="md"
            label="买卖房源动作"
            name="buy_houseJobs"
            showSearch
            tooltip={'请确认目标房源支持经纪人实勘'}
            options={jobEnum}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText name="lease_houseId" width={'md'} label="租赁房源ID" />
          <ProFormSelect
            mode={'multiple'}
            width="md"
            label="租赁房源动作"
            name="lease_houseJobs"
            showSearch
            tooltip={'请确认目标房源支持经纪人实勘'}
            options={jobEnum}
          />
        </ProForm.Group>
        {city === 'hangzhou' ? (
          <ProForm.Group>
            <ProFormSwitch width="md" label="报意向" name="ine" />
          </ProForm.Group>
        ) : null}
      </ProForm>
    </ProCard>
  );
};

export default UserLeave;
