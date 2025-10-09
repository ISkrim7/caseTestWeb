import { CONFIG } from '@/utils/config';
import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { FC } from 'react';

interface Self {
  envs?: { label: string; value: number | null }[];
}

const StepApiForm: FC<Self> = ({ envs }) => {
  const { API_REQUEST_METHOD } = CONFIG;

  const addonBefore = (
    <>
      <ProFormSelect
        noStyle
        name={'env_id'}
        options={envs}
        required={true}
        placeholder={'环境选择'}
        label={'Env'}
      />
    </>
  );

  const addonAfter = (
    <>
      <ProFormSelect
        noStyle
        className={'method'}
        name={'method'}
        label={'method'}
        initialValue={'POST'}
        options={API_REQUEST_METHOD}
        required={true}
        rules={[{ required: true, message: 'method 不能为空' }]}
      />
    </>
  );
  return (
    <>
      <ProForm.Group>
        <ProFormText
          label={'接口名称'}
          name={'name'}
          width={'md'}
          required={true}
          rules={[{ required: true, message: '步骤名称不能为空' }]}
        />
        <ProFormText
          label={'URL'}
          addonBefore={addonBefore}
          name={'url'}
          width={'md'}
          rules={[{ required: true, message: '请输入请求url' }]}
          addonAfter={addonAfter}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width={'sm'}
          label={'是否重定向'}
          name={'follow_redirects'}
          initialValue={0}
          options={[
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ]}
        />
        <ProFormDigit
          width={'sm'}
          label={'请求超时(s)'}
          name={'connect_timeout'}
          initialValue={6}
          min={0}
        />
        <ProFormDigit
          width={'sm'}
          label={'响应超时(s)'}
          initialValue={6}
          min={0}
          name={'response_timeout'}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          label={'步骤描述'}
          name={'description'}
          width={'lg'}
          required={true}
          fieldProps={{ rows: 1 }}
        />
        <ProFormRadio.Group
          required={true}
          label={'该UI步骤前后运行'}
          radioType={'radio'}
          name={'interface_a_or_b'}
          disabled={false}
          width={'md'}
          rules={[{ required: true, message: '不能为空' }]}
          options={[
            {
              label: '前置运行',
              value: 1,
            },
            {
              label: '后置运行',
              value: 0,
            },
          ]}
        />
        <ProFormRadio.Group
          required={true}
          disabled={false}
          label={'API断言失败停止'}
          radioType={'radio'}
          name={'interface_fail_stop'}
          width={'md'}
          initialValue={1}
          rules={[{ required: true, message: '不能为空' }]}
          options={[
            {
              label: '停止',
              value: 1,
            },
            {
              label: '不停止',
              value: 0,
            },
          ]}
        />
      </ProForm.Group>
    </>
  );
};

export default StepApiForm;
