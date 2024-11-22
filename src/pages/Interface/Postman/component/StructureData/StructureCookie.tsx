import TitleName from '@/components/TitleName';
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
import { FC, useEffect, useRef, useState } from 'react';

interface ISelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
  currentProjectId: string;
}

const citySelect = ['beijing', 'hangzhou'];

const StructureCookie: FC<ISelfProps> = ({ stepInfo, stepForm }) => {
  const [cookieCheck, setCookieCheck] = useState(false);
  const CookieFormRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (stepInfo) {
      const beforeStructure: IStructure[] = stepInfo.beforeStructure ?? [];
      const cookieForm = beforeStructure.find((item) => item.name === 'cookie');
      if (cookieForm) {
        setCookieCheck(true);
        CookieFormRef.current?.setFieldsValue(cookieForm);
      }
    }
  }, [stepInfo]);
  const onCookieCheck = async (e: CheckboxChangeEvent) => {
    try {
      await CookieFormRef.current?.validateFields();
      // 校验通过
      setCookieCheck(e.target.checked);
    } catch (error) {
      // 校验未通过
      console.error('存在为空字段');
    }
  };
  const updateCookieValue = () => {
    const existsValue: IStructure[] =
      stepForm.getFieldValue('beforeStructure') ?? [];
    const index = existsValue.findIndex((item) => item.name === 'cookie');

    if (cookieCheck) {
      CookieFormRef.current?.validateFields().then((values) => {
        if (index !== -1) {
          existsValue[index] = values;
        } else {
          existsValue.push(values);
        }
        stepForm.setFieldValue('beforeStructure', existsValue);
      });
    } else {
      if (index !== -1) {
        existsValue.splice(index, 1);
        console.log('====', existsValue);
        stepForm.setFieldValue('beforeStructure', existsValue);
      }
    }
  };

  useEffect(() => {
    updateCookieValue();
  }, [cookieCheck, updateCookieValue]);

  return (
    <ProCard
      title={TitleName('获取Cookie')}
      collapsible
      subTitle={'返回构造的cookie值  赋值到填写的变量中'}
      extra={
        <Checkbox onChange={onCookieCheck} checked={cookieCheck}>
          选用
        </Checkbox>
      }
      defaultCollapsed
      bodyStyle={{ marginLeft: 20 }}
    >
      <ProForm<{
        name: 'cookie';
        key: string;
        username: string;
        city: string;
      }>
        style={{ marginTop: 10 }}
        submitter={false}
        formRef={CookieFormRef}
        layout={'horizontal'}
        onValuesChange={updateCookieValue}
      >
        <ProCard bordered>
          <ProForm.Group labelLayout={'inline'} collapsible>
            <ProFormText name={'name'} initialValue={'cookie'} hidden />
            <ProFormText name={'target'} initialValue={'6'} hidden />
            <ProFormText
              label={'cookie变量名'}
              width={'md'}
              name={'key'}
              required
            />
            <ProFormText
              label={'用户名'}
              width={'md'}
              name={'username'}
              required
            />
            <ProFormSelect
              label={'城市'}
              required
              width={'md'}
              name={'city'}
              options={citySelect}
            />
          </ProForm.Group>
        </ProCard>
      </ProForm>
    </ProCard>
  );
};

export default StructureCookie;
