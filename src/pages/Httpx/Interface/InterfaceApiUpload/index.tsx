import { uploadInterApi } from '@/api/inter';
import {
  queryEnvByProjectIdFormApi,
  queryProjects,
} from '@/components/CommonFunc';
import { fetchCaseParts } from '@/pages/Play/componets/someFetch';
import { CasePartEnum } from '@/pages/Play/componets/uiTypes';
import { ApiPostIcon, PostManIcon, SwaggerIcon, YAPIIcon } from '@/utils/icons';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { ProFormUploadDragger } from '@ant-design/pro-form';
import { Button, Col, Form, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Text } = Typography;

const Index = () => {
  const [form] = Form.useForm();
  const [currentValue, setCurrentValue] = useState<string>();
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [casePartEnum, setCasePartEnum] = useState<CasePartEnum[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [envs, setEnvs] = useState<{ label: string; value: number | null }[]>(
    [],
  );
  useEffect(() => {
    queryProjects(setProjects).then();
  }, []);
  useEffect(() => {
    if (currentProjectId) {
      fetchCaseParts(currentProjectId, setCasePartEnum).then();
      queryEnvByProjectIdFormApi(currentProjectId, setEnvs, false).then();
    }
  }, [currentProjectId]);

  const arr = [
    { title: 'Swagger', icon: <SwaggerIcon />, value: '1' },
    { title: 'PostMan', icon: <PostManIcon />, value: '2' },
    { title: 'ApiPost', icon: <ApiPostIcon />, value: '3' },
    { title: 'YApi', icon: <YAPIIcon />, value: '4' },
  ];

  const onClick = async (value: string) => {
    setCurrentValue(value);
    console.log(value);
  };
  const onSubmit = async () => {
    const values = form.getFieldsValue(); // 获取表单中所有字段的值
    console.log('All form values:', values);

    const fileValue = values.api_file;
    console.log('Selected file:', fileValue); // 打印文件值，检查是否获取到文件
    if (currentValue && fileValue.length > 0) {
      const formData = new FormData();
      // 添加文件
      formData.append('api_file', fileValue[0].originFileObj); // 选择了一个文件，放入 FormData
      formData.append('valueType', currentValue); // 添加其他字段（例如选择的值）
      formData.append('env_id', values.env_id); // 添加其他字段（例如选择的值）
      formData.append('project_id', values.project_id); // 添加其他字段（例如选择的值）
      formData.append('part_id', values.part_id); // 添加其他字段（例如选择的值）
      // 打印 FormData 内容
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const { code, msg } = await uploadInterApi(formData);
      if (code === 0) {
        form.resetFields();
        console.log(msg);
      }
    }

    // 发送请求（例如使用 fetch 或 axios）
    // const response = await fetch('/your-api-endpoint', {
    //   method: 'POST',
    //   body: data,
    // });
    // const result = await response.json();
    // console.log('Response:', result); // 打印返回的响应
  };

  return (
    <ProCard
      direction="column"
      gutter={[24, 24]}
      wrap
      style={{ marginBlockStart: 16, height: 'auto' }}
    >
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
            <ProForm.Group>
              <ProFormSelect
                width={'md'}
                options={projects}
                label={'所属项目'}
                name={'project_id'}
                required={true}
                onChange={(value) => {
                  setCurrentProjectId(value as number);
                }}
              />
              <ProFormTreeSelect
                required
                name="part_id"
                label="所属模块"
                allowClear
                rules={[{ required: true, message: '所属模块必选' }]}
                fieldProps={{
                  treeData: casePartEnum,
                  fieldNames: {
                    label: 'title',
                  },
                  filterTreeNode: true,
                }}
                width={'md'}
              />
              <ProFormSelect
                name={'env_id'}
                options={envs}
                required={true}
                placeholder={'环境选择'}
                label={'Env'}
              />
            </ProForm.Group>
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
