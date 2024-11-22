import {
  addCommonUIStep,
  addStepToGroup,
  handelCaseSteps,
  queryMethodOptions,
} from '@/api/ui';
import { fetchUIMethodOptionsToFrom } from '@/pages/UIPlaywright/someFetch';
import { IUICaseSteps, IUIMethod } from '@/pages/UIPlaywright/uiTypes';
import { useModel } from '@@/plugin-model';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface SelfProps {
  uiCaseId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  edit: number;
  setEdit: React.Dispatch<React.SetStateAction<number>>;
  copyData?: IUICaseSteps;
  isCommonStep?: boolean;
  stepGroupId?: number;
}

const Index: FC<SelfProps> = ({
  uiCaseId,
  setOpen,
  copyData,
  edit,
  setEdit,
  isCommonStep,
  stepGroupId,
}) => {
  const [form] = Form.useForm<IUICaseSteps>();
  const [methodEnum, setMethodEnum] = useState<any>();
  const [methods, setMethods] = useState<IUIMethod[]>([]);
  const [currentMethod, setCurrentMethod] = useState<IUIMethod>();
  const [readOnly, setReadOnly] = useState(false);
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    if (currentMethod) {
      if (currentMethod.need_locator == 2) {
        form.setFieldsValue({ locator: 'None' });
      } else {
        if (form.getFieldValue('locator') === 'None') {
          form.resetFields(['locator']);
        }
      }
      if (currentMethod.need_value == 2) {
        form.setFieldsValue({ value: undefined });
      }
    }
  }, [currentMethod]);

  useEffect(() => {
    if (copyData) {
      const { method } = copyData;
      form.setFieldsValue({ ...copyData });
      queryMethodOptions().then(({ code, data }) => {
        if (code === 0) {
          setMethods(data);
          const curr = data.find((item) => item.value === method);
          setCurrentMethod(curr);
        }
      });
    }
  }, [copyData]);

  useEffect(() => {
    Promise.all([fetchUIMethodOptionsToFrom(setMethodEnum, setMethods)]).then(
      (r) => r.reverse(),
    );
  }, []);

  const saveStepCase = async () => {
    const stepBody = await form.validateFields();

    //添加私有步骤
    if (uiCaseId) {
      await handelCaseSteps(
        { caseId: parseInt(uiCaseId), ...stepBody },
        'POST',
      ).then(({ code }) => {
        setOpen(false);
        setEdit(edit + 1);
      });
    } else if (stepGroupId) {
      const newBody = {
        groupId: stepGroupId,
        ...stepBody,
        creator: initialState?.currentUser?.id,
        creatorName: initialState?.currentUser?.username,
      };
      await addStepToGroup(newBody).then(({ code }) => {
        setOpen(false);
        setEdit(edit + 1);
      });
    } else if (isCommonStep) {
      // 公共步骤 添加公共STEP
      const newBody = {
        ...stepBody,
        isCommonStep: isCommonStep,
        creator: initialState?.currentUser?.id,
        creatorName: initialState?.currentUser?.username,
      };
      await addCommonUIStep(newBody).then(({ code }) => {
        setOpen(false);
        setEdit(edit + 1);
      });
    }
  };

  return (
    <ProCard>
      <ProForm
        layout={'vertical'}
        form={form}
        onFinish={saveStepCase}
        rowProps={{
          gutter: [0, 16],
        }}
      >
        <ProForm.Group>
          <ProFormText
            width={'lg'}
            name="name"
            label="步骤名称"
            required={true}
            rules={[{ required: true, message: '步骤名称必填' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea
            width={'lg'}
            name="desc"
            label="步骤描述"
            required={true}
            rules={[{ required: true, message: '步骤描述必填' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            width={'lg'}
            name="method"
            showSearch={true}
            label="元素操作"
            options={methodEnum}
            rules={[{ required: true, message: '步骤方法必选' }]}
            fieldProps={{
              onSelect: (value: string) => {
                if (value) {
                  const currentMethod = methods.find(
                    (item) => item.value === value,
                  );
                  console.log('==', currentMethod);
                  setCurrentMethod(currentMethod);
                }
              },
            }}
          />
        </ProForm.Group>
        {currentMethod && currentMethod.value.toLowerCase().startsWith('on') ? (
          <ProForm.Group>
            <ProFormTextArea
              width={'lg'}
              label={'监听接口'}
              name={'once_url'}
              required={currentMethod.need_value === 1}
              placeholder={'/xx/xx/xxx'}
            />
          </ProForm.Group>
        ) : null}
        {currentMethod && currentMethod.need_locator === 1 ? (
          <ProForm.Group>
            <ProFormTextArea
              width={'lg'}
              name="locator"
              label="步骤目标元素定位"
              required={true}
              readonly={readOnly}
              tooltip={'当方法选择不需要目标元素定位，可写入null'}
              placeholder={'#...'}
              rules={[{ required: true, message: '目标元素必填' }]}
            />
          </ProForm.Group>
        ) : (
          <ProForm.Group>
            <ProFormTextArea
              width={'lg'}
              name="locator"
              label="步骤目标元素定位"
              required={false}
              disabled={true}
              tooltip={'当方法选择不需要目标元素定位，可写入null'}
            />
          </ProForm.Group>
        )}
        {currentMethod && currentMethod.need_value === 2 ? (
          <ProForm.Group>
            <ProFormTextArea
              width={'lg'}
              tooltip={'用于输入值，或者用于expect校验的预期值'}
              name="value"
              label="输入值"
              disabled={true}
              required={false}
            />
          </ProForm.Group>
        ) : (
          <ProForm.Group>
            <ProFormTextArea
              width={'lg'}
              tooltip={'用于输入值，或者用于expect校验的预期值'}
              name="value"
              label="输入值"
              required={true}
              rules={[{ required: true, message: '输入值必填' }]}
            />
          </ProForm.Group>
        )}

        <ProForm.Group>
          <ProFormTextArea
            width={'lg'}
            name="iframeName"
            label="IFrame"
            tooltip={'如果是iframe上操作、请输入iframe 元素'}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSwitch
            width={'lg'}
            name={'new_page'}
            label={'操作是否打开新页面'}
          />
          <ProFormSwitch
            width={'lg'}
            name={'is_ignore'}
            label={'是否忽略异常'}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
