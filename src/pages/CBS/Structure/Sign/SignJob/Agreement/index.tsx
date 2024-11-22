import {
  addAgreement,
  IAddAgreement,
  queryAgreementCode,
} from '@/api/cbsAPI/signAPI';
import TitleName from '@/components/TitleName';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import Utils from '@/pages/CBS/component/utils';
import {
  ProCard,
  ProForm,
  ProFormDigit,
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
  const [agreementForm] = Form.useForm<IAddAgreement>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const [currentNode, setCurrentNode] = useState<string[]>([]);
  const [currentCode, setCurrentCode] = useState<string>();
  const [codeEnum, setCodeEnum] = useState<{ label: string; value: string }[]>(
    [],
  );
  const { AgreementNode } = Utils();
  const submit = async () => {
    const body = await agreementForm.validateFields();
    const { code, data, msg } = await addAgreement(body);
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    } else {
      message.error(msg);
    }
  };
  const fetchCode = async () => {
    const { code, data, msg } = await queryAgreementCode();
    if (code === 0) {
      return data;
    } else {
      message.error(msg);
      return [];
    }
  };
  useEffect(() => {
    fetchCode().then((data) => {
      setCodeEnum(data);
    });
  }, []);

  return (
    <ProCard
      title={TitleName('协议')}
      bordered
      hoverable
      style={{ marginTop: 10, borderRadius: '40px', marginBottom: '16px' }}
    >
      <ProForm form={agreementForm} onFinish={submit}>
        <ProForm.Group>
          <CityForm
            form={agreementForm}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
          <UsernameForm
            form={agreementForm}
            tag={1}
            name={'username'}
            label={'合同录入人ID'}
            currentCityID={selectedCityId}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            mode={'multiple'}
            width={'md'}
            label={'预期节点'}
            name={'node'}
            initialValue={currentNode}
            options={AgreementNode}
            required
            rules={[{ required: true, message: '请选择预期节点' }]}
            fieldProps={{
              onChange: (_: any) => {
                setCurrentNode(_);
                console.log(currentNode);
              },
            }}
          />
        </ProForm.Group>
        <ProForm.Group>
          {currentNode.includes('create') && (
            <>
              <ProFormText
                width="md"
                label="合同ID"
                name="conId"
                placeholder="conId"
                rules={[{ required: true, message: '请录入合同ID' }]}
                required
              />
              <ProFormSelect
                width="md"
                label="协议类型"
                name="code"
                required
                showSearch
                rules={[{ required: true, message: '请选择协议' }]}
                options={codeEnum}
                fieldProps={{
                  onSelect: (value: any) => {
                    setCurrentCode(value);
                  },
                }}
              />
            </>
          )}
          {currentNode.length > 0 && !currentNode.includes('create') && (
            <ProFormText
              width="md"
              label="协议ID"
              name="agreementId"
              placeholder="agreementId"
              required
            />
          )}
        </ProForm.Group>

        {currentCode &&
        ['E003', 'ZL001'].includes(currentCode) &&
        currentNode.includes('create') ? (
          <ProForm.Group>
            <ProFormDigit
              min={0}
              width={'md'}
              label={'客户合同约定佣金'}
              name={'cusBrokerageReceived'}
              fieldProps={{ precision: 2 }}
            />
            <ProFormDigit
              min={0}
              width={'md'}
              label={'业主合同约定佣金'}
              name={'ownBrokerageReceived'}
              fieldProps={{ precision: 2 }}
            />
            <ProFormSelect
              mode={'multiple'}
              width={'md'}
              label={'收佣方'}
              name={'chargeObject'}
              required
              rules={[{ required: true, message: '请选择收佣方' }]}
              options={[
                { label: '客户', value: '1' },
                { label: '业主', value: '2' },
              ]}
            />
          </ProForm.Group>
        ) : null}
        {currentCode &&
        ['B001', 'B002', 'B014'].includes(currentCode) &&
        currentNode.includes('create') ? (
          <ProForm.Group>
            <ProFormText width={'md'} label={'姓名'} name={'fullname'} />
            <ProFormText width={'md'} label={'身份证件号'} name={'idcardNo'} />
            <ProFormText width={'md'} label={'电话'} name={'phoneNumber'} />
          </ProForm.Group>
        ) : null}
      </ProForm>
    </ProCard>
  );
};

export default Index;
