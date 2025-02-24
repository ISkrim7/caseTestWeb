import { ApiPostIcon, PostManIcon, SwaggerIcon, YAPIIcon } from '@/utils/icons';
import { ProCard, ProForm } from '@ant-design/pro-components';
import { ProFormUploadDragger } from '@ant-design/pro-form';
import { Button, Col, Form, Row, Space, Typography } from 'antd';
import { useState } from 'react';

const { Text } = Typography;

const Index = () => {
  const [form] = Form.useForm();
  const [currentValue, setCurrentValue] = useState<number>();

  const arr = [
    { title: 'Swagger', icon: <SwaggerIcon />, value: 1 },
    { title: 'PostMan', icon: <PostManIcon />, value: 2 },
    { title: 'ApiPost', icon: <ApiPostIcon />, value: 3 },
    { title: 'YApi', icon: <YAPIIcon />, value: 4 },
  ];

  const onClick = async (value: number) => {
    setCurrentValue(value);
    console.log(value);
  };
  const onSubmit = async () => {
    const values = await form.getFieldValue('api_file');
    console.log(values);
  };
  return (
    <ProCard
      direction="column"
      gutter={[24, 24]}
      wrap
      style={{ marginBlockStart: 16, height: 'auto' }}
    >
      {' '}
      <Row gutter={[20, 20]}>
        {arr.map((item, index) => {
          return (
            <Col span={8} key={index}>
              <ProCard
                onClick={async () => await onClick(item.value)}
                bordered={true}
                hoverable={true}
                type="inner"
                headerBordered={true}
                style={{ marginBlockStart: 16, borderRadius: 16 }}
              >
                <Space>
                  {item.icon}
                  <Text strong>{item.title}</Text>
                </Space>
              </ProCard>
            </Col>
          );
        })}
      </Row>
      {currentValue && (
        <ProCard
          extra={<Button onClick={onSubmit}>上传</Button>}
          style={{ marginTop: 20 }}
          bodyStyle={{ padding: 0 }}
        >
          <ProForm form={form} submitter={false}>
            <ProFormUploadDragger
              title={false}
              max={1}
              description="上传文件"
              name="api_file"
            />
          </ProForm>
        </ProCard>
      )}
    </ProCard>
  );
};

export default Index;
