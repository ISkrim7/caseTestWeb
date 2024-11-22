import { IFinance } from '@/api';
import { financeJob } from '@/api/cbsAPI/signAPI';
import TitleName from '@/components/TitleName';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import {
  ProCard,
  ProForm,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const TypeENUM = [
  { label: '收款', value: '1' },
  { label: '付款', value: '3' },
  { label: '退款', value: '2' },
];
const Finance: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const [financeForm] = Form.useForm<IFinance>();
  const [type, setType] = useState('1');
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const finish = async () => {
    const value = await financeForm.validateFields();
    const { code, data, msg } = await financeJob(value);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };

  return (
    <ProCard
      title={TitleName('合同费用款项收付退')}
      bordered
      hoverable
      style={{ borderRadius: '40px', marginBottom: '16px' }}
      subTitle={
        <a
          style={{ marginLeft: 20 }}
          onClick={() => {
            window.open(
              'https://doc.weixin.qq.com/doc/w3_ATgAwQZeAHkEdOGeJcqTU06rfVJaZ?scode=APwAJgfkAHAJqdz8eRATgAwQZeAHk&journal_source=chat',
            );
          }}
        >
          使用说明
        </a>
      }
    >
      <ProForm form={financeForm} onFinish={finish}>
        <ProForm.Group>
          <CityForm
            form={financeForm}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="conId"
            label="合同conId编号"
            width={'md'}
            required={true}
            rules={[{ required: true, message: '合同conId必填' }]}
          />
          <ProFormSelect
            label={'操作类型'}
            width={'md'}
            name={'type'}
            required
            initialValue={type}
            options={TypeENUM}
            rules={[{ required: true, message: '操作类型必选！' }]}
            fieldProps={{
              onChange: (value: string) => setType(value),
            }}
          />
        </ProForm.Group>
        <ProForm.Group>
          <UsernameForm
            form={financeForm}
            tag={1}
            name={'username'}
            label={'经纪人'}
            currentCityID={selectedCityId}
          />
          <UsernameForm
            form={financeForm}
            tag={3}
            name={'finance_username'}
            label={'财务经理'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormMoney
            width={'md'}
            name={'amount'}
            label={'金额'}
            required
            rules={[{ required: true, message: '金额必填！' }]}
          />
          <ProFormText
            label={'款项'}
            name={'fundName'}
            width={'md'}
            placeholder={'履约服务费 & 赔偿金'}
            required
            rules={[{ required: true, message: '款项必填！' }]}
          />
          <ProFormSelect
            label={'付款/收款方类型'}
            name={'payer'}
            width={'md'}
            options={[
              { label: '客户', value: '1' },
              { label: '业主', value: '2' },
              { label: '员工', value: '3' },
              { label: '其他', value: '4' },
            ]}
          />
        </ProForm.Group>
        {['2', '3'].includes(type) ? (
          <ProForm.Group>
            <ProFormText label={'姓名'} name={'accountHolder'} width={'md'} />
            <ProFormText label={'卡号'} name={'bankAccount'} width={'md'} />
            {type === '2' ? (
              <ProFormText label={'退款批次ID'} name={'batchId'} width={'md'} />
            ) : null}
          </ProForm.Group>
        ) : null}
      </ProForm>
    </ProCard>
  );
};
export default Finance;
