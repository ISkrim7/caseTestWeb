import { IModuleEnum } from '@/api';
import { uploadInterApi } from '@/api/inter';
import {
  queryEnvByProjectIdFormApi,
  queryProjects,
} from '@/components/CommonFunc';
import { ModuleEnum } from '@/utils/config';
import { ApiPostIcon, PostManIcon, SwaggerIcon, YAPIIcon } from '@/utils/icons';
import { fetchModulesEnum } from '@/utils/somefunc';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { ProFormUploadDragger } from '@ant-design/pro-form';
import { Button, Col, Form, message, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Text } = Typography;

const Index = () => {
  const [form] = Form.useForm();
  const [currentValue, setCurrentValue] = useState<string>();
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [envs, setEnvs] = useState<{ label: string; value: number | null }[]>(
    [],
  );
  useEffect(() => {
    queryProjects(setProjects).then();
  }, []);
  useEffect(() => {
    if (currentProjectId) {
      fetchModulesEnum(currentProjectId, ModuleEnum.API, setModuleEnum).then();
      queryEnvByProjectIdFormApi(currentProjectId, setEnvs, true).then();
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
    const fileValue = values.api_file;
    if (currentValue && fileValue.length > 0) {
      const formData = new FormData();
      // 添加文件
      formData.append('api_file', fileValue[0].originFileObj); // 选择了一个文件，放入 FormData
      formData.append('valueType', currentValue); // 添加其他字段（例如选择的值）
      formData.append('env_id', values.env_id); // 添加其他字段（例如选择的值）
      formData.append('project_id', values.project_id); // 添加其他字段（例如选择的值）
      formData.append('module_id', values.module_id); // 添加其他字段（例如选择的值）
      const { code, msg } = await uploadInterApi(formData);
      if (code === 0) {
        form.resetFields();
        message.success(msg);
      }
    }
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
                name="module_id"
                label="所属模块"
                allowClear
                rules={[{ required: true, message: '所属模块必选' }]}
                fieldProps={{
                  treeData: moduleEnum,
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
