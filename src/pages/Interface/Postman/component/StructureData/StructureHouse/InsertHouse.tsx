import Utils from '@/pages/CBS/component/utils';
import { ISteps, IStructure } from '@/pages/Interface/types';
import {
  ProCard,
  ProForm,
  ProFormInstance,
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

const KEY = 'house';

interface IHouseForm {
  name: 'house';
  key: string;
  buildingName: string;
  businessType: '1' | '2';
  username: string;
  builder: string;
  city: string;
}

const citySelect = ['beijing', 'tianjin', 'hangzhou'];
const InsertHouse: FC<ISelfProps> = ({ stepInfo, stepForm }) => {
  const houseFormRef = useRef<ProFormInstance>();
  const [houseCheck, setHouseCheck] = useState(
    !!stepInfo?.beforeStructure?.find((item) => item.name === KEY),
  );

  const { BusinessType, CityBuildingName, CityBuilder } = Utils();

  useEffect(() => {
    if (stepInfo) {
      const form = stepInfo.beforeStructure?.find((item) => item.name === KEY);
      if (form) {
        houseFormRef.current?.setFieldsValue(form);
      }
    }
  }, [stepInfo]);

  const handleFormValuesChange = useCallback(
    (_, allValues) => {
      // 注意：这里直接使用 allValues，它包含了表单的当前全部值
      if (houseCheck) {
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
    [houseCheck, stepForm],
  );

  const onCheckboxChange = async (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setHouseCheck(isChecked); // 更新复选框的状态

    if (isChecked) {
      // 当checked为true时，尝试校验表单
      try {
        const existsValue = stepForm.getFieldValue('beforeStructure') ?? [];
        const index = existsValue.findIndex(
          (item: IStructure) => item.name === KEY,
        );
        const allValues = await houseFormRef.current?.validateFields();
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
        setHouseCheck(false);
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
      title={'录入一个房源'}
      collapsible
      style={{ marginLeft: 20 }}
      subTitle={'返回构造的房源ID  赋值到填写的变量中'}
      extra={
        <Checkbox onChange={onCheckboxChange} checked={houseCheck}>
          选用
        </Checkbox>
      }
      bodyStyle={{ marginLeft: 20 }}
      defaultCollapsed
    >
      <ProForm<IHouseForm>
        style={{ marginTop: 10 }}
        submitter={false}
        formRef={houseFormRef}
        onValuesChange={handleFormValuesChange}
        layout={'horizontal'}
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
            <ProFormSelect
              label={'房源类型'}
              initialValue={'2'}
              width={'md'}
              options={BusinessType}
              required
              rules={[{ required: true, message: '房源类型不能为空' }]}
              name={'businessType'}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              label={'录入人ID'}
              width={'md'}
              required
              rules={[{ required: true, message: '录入人不能为空' }]}
              name={'username'}
            />
            <ProFormText
              label={'楼盘库名'}
              required
              width={'md'}
              name={'buildingName'}
              rules={[{ required: true, message: '楼盘库名不能为空' }]}
            />
            <ProFormText
              label={'楼盘专员ID'}
              name={'builder'}
              required
              rules={[{ required: true, message: '专员ID不能为空' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              label={'房源ID变量名'}
              initialValue={'houseId'}
              name={'key'}
              required
              rules={[{ required: true, message: '变量名不能为空' }]}
            />
          </ProForm.Group>
        </ProCard>
      </ProForm>
    </ProCard>
  );
};

export default InsertHouse;
