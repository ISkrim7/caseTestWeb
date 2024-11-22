import Utils from '@/pages/CBS/component/utils';
import { ISteps, IStructure } from '@/pages/Interface/types';
import {
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Checkbox, FormInstance } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface ISelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
  currentProjectId: string;
}

const KEY = 'key';

const citySelect = ['beijing', 'tianjin', 'hangzhou'];
const InsertKey: FC<ISelfProps> = ({ stepInfo, stepForm }) => {
  const keyFormRef = useRef<ProFormInstance>();
  const [keyCheck, setKeyCheck] = useState(
    !!stepInfo?.beforeStructure?.find((item) => item.name === KEY),
  );
  const { BusinessType, KeyTypes } = Utils();

  useEffect(() => {
    if (stepInfo) {
      const form = stepInfo.beforeStructure?.find((item) => item.name === KEY);
      if (form) {
        keyFormRef.current?.setFieldsValue(form);
      }
    }
  }, [stepInfo]);

  const handleFormValuesChange = useCallback(
    (_, allValues) => {
      // 注意：这里直接使用 allValues，它包含了表单的当前全部值
      if (keyCheck) {
        const existsValue = stepForm.getFieldValue('beforeStructure') ?? [];
        const index = existsValue.findIndex(
          (item: IStructure) => item.name === KEY,
        );
        // 直接使用 allValues 更新，而不是等待 validateFields 的结果
        if (index !== -1) {
          existsValue[index] = allValues;
        } else {
          existsValue.push(allValues);
        }
        stepForm.setFieldValue('beforeStructure', existsValue);
      }
    },
    [keyCheck, stepForm],
  );

  const onCheckboxChange = async (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setKeyCheck(isChecked); // 更新复选框的状态

    if (isChecked) {
      // 当checked为true时，尝试校验表单
      try {
        const existsValue = stepForm.getFieldValue('beforeStructure') ?? [];
        const index = existsValue.findIndex(
          (item: IStructure) => item.name === KEY,
        );
        const allValues = await keyFormRef.current?.validateFields();
        console.log('表单校验成功', allValues);
        if (index !== -1) {
          existsValue[index] = allValues;
        } else {
          existsValue.push(allValues);
        }
        stepForm.setFieldValue('beforeStructure', existsValue);
        // 这里可以添加校验成功后的逻辑，如果需要
      } catch (error) {
        console.error('存在为空字段');
        // 校验失败时可能需要处理的逻辑，例如保持复选框未选中
        setKeyCheck(false);
      }
    } else {
      // 当checked为false时，执行特定逻辑
      const existsValue = stepForm.getFieldValue('beforeStructure') ?? [];
      const index = existsValue.findIndex(
        (item: IStructure) => item.name === KEY,
      );
      if (index !== -1) {
        existsValue.splice(index, 1);
        stepForm.setFieldValue('beforeStructure', existsValue);
      }
    }
  };

  return (
    <ProCard
      title={'录入一个审批通过的钥匙协议'}
      collapsible
      style={{ marginLeft: 20 }}
      subTitle={'返回钥匙协议ID  赋值到填写的变量中'}
      extra={
        <Checkbox onChange={onCheckboxChange} checked={keyCheck}>
          选用
        </Checkbox>
      }
      bodyStyle={{ marginLeft: 20 }}
      defaultCollapsed
    >
      <ProForm<{
        name: 'key';
        key: string;
        username: string;
        houseId: string;
        city: string;
        businessType: string;
        keyType: string;
      }>
        style={{ marginTop: 10 }}
        formRef={keyFormRef}
        submitter={false}
        layout={'horizontal'}
        onValuesChange={handleFormValuesChange}
      >
        <ProCard bordered>
          <ProFormText name={'name'} initialValue={KEY} hidden />
          <ProFormText name={'target'} initialValue={'6'} hidden />

          <ProForm.Group>
            <ProFormSelect
              label={'目标城市'}
              width={'md'}
              initialValue={'beijing'}
              rules={[{ required: true, message: '目标城市不能为空' }]}
              options={citySelect}
              required
              name={'city'}
            />
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
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="houseId"
              label="房源ID"
              width={'md'}
              initialValue={'{{houseId}}'}
              required={true}
              rules={[{ required: true, message: '房源ID必填' }]}
            />
            <ProFormText
              name="username"
              label="钥匙协议录入人"
              width={'md'}
              required={true}
              rules={[{ required: true, message: '钥匙协议人ID必填' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="key"
              label="钥匙协议ID变量名"
              width={'md'}
              initialValue={'keyId'}
              required={true}
              rules={[{ required: true, message: '钥匙协议ID变量名必填' }]}
            />
          </ProForm.Group>
        </ProCard>
      </ProForm>
    </ProCard>
  );
};

export default InsertKey;
