import { debugPerfInterApi } from '@/api/inter';
import {
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormDigitRange,
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
    if (code === 0 && data) {
      console.log(data);
      window.open(`/interface/interApi/perf/detail/perfId=${data}`);
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
            placeholder={'5'}
            required
            fieldProps={{
              suffix: <span>分</span>,
            }}
            rules={[
              {
                required: true,
                message: '请输入并发时常',
              },
            ]}
          />
          <ProFormDigitRange
            tooltip={'输入一个时间范围，每个User请求等待将会随机选择'}
            label="请求等待时间"
            name="wait_range"
            separator="-"
            placeholder={['Min', 'Max']}
            separatorWidth={60}
            rules={[
              {
                required: true,
                message: '请输入请求等待时间',
              },
            ]}
            initialValue={[0, 0]}
            fieldProps={{
              suffix: <span>秒</span>,
            }}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default InterPerf;
