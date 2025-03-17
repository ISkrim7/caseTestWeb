import { debugPerfInterApi } from '@/api/inter';
import {
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import { FC } from 'react';

interface IProps {
  interfaceId: string;
}

const InterPerf: FC<IProps> = ({ interfaceId }) => {
  const [form] = Form.useForm();

  const onFinish = async () => {
    const values = await form.validateFields();
    const body = {
      interfaceId: interfaceId,
      ...values,
    };
    const { code, data } = await debugPerfInterApi(body);
    if (code === 0) {
      console.log(data);
    }
  };
  return (
    <ProCard
      extra={
        <Button disabled={false} type={'primary'} onClick={onFinish}>
          Try Perf
        </Button>
      }
    >
      <ProForm form={form} disabled={false} submitter={false}>
        <ProForm.Group>
          <ProFormDigit
            label={'并发数'}
            width={'md'}
            name={'perf_user'}
            placeholder={'5 users'}
            required
            rules={[
              {
                required: true,
                message: '请输入并发数',
              },
            ]}
          />
          <ProFormDigit
            tooltip={
              <ul>
                <li>
                  如果 并发数 = 10 且 生成速率 = 1，表示每秒启动 1
                  个用户，直到达到 10 个用户。
                </li>
                <li>
                  如果 并发数 = 10 且 生成速率 = 2，表示每秒启动 2
                  个用户，直到达到 10 个用户。
                </li>
              </ul>
            }
            label={'用户生成速率'}
            width={'md'}
            name={'perf_spawn_rate'}
            placeholder={'1'}
            required
            rules={[
              {
                required: true,
                message: '用户生成速率',
              },
            ]}
          />
          <ProFormText
            label={'时长'}
            width={'md'}
            name={'perf_duration'}
            placeholder={'5s'}
            required
            fieldProps={{
              suffix: <span>s</span>,
            }}
            rules={[
              {
                required: true,
                message: '请输入并发时常',
              },
            ]}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default InterPerf;
