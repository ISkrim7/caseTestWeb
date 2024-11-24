import { IEnv } from '@/api';
import { queryEnvBy, queryProject } from '@/api/base';
import {
  detailInterApiById,
  insertInterApi,
  updateInterApiById,
} from '@/api/inter';
import InterAfterScript from '@/pages/Httpx/componets/InterAfterScript';
import InterAsserts from '@/pages/Httpx/componets/InterAsserts';
import InterBeforeParams from '@/pages/Httpx/componets/InterBeforeParams';
import InterBeforeScript from '@/pages/Httpx/componets/InterBeforeScript';
import InterExtracts from '@/pages/Httpx/componets/InterExtracts';
import InterHeader from '@/pages/Httpx/componets/InterHeader';
import InterParam from '@/pages/Httpx/componets/InterParam';
import { IInterfaceAPI } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Form, message, Tabs } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'umi';

const Index: FC = () => {
  const { interId } = useParams<{ interId: string }>();
  const { API_REQUEST_METHOD } = CONFIG;
  const [interApiForm] = Form.useForm<IInterfaceAPI>();
  // 1详情 2新增 3 修改
  const [currentMode, setCurrentMode] = useState(1);
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [envs, setEnvs] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    if (interId) {
      setCurrentMode(1);
      detailInterApiById({ interfaceId: interId }).then(({ code, data }) => {
        if (code === 0) {
          console.log(data);
          interApiForm.setFieldsValue(data);
          setCurrentProjectId(data.project_id);
        }
      });
    } else {
      setCurrentMode(2);
    }
    queryProject().then(({ code, data }) => {
      if (code === 0) {
        const projects = data.map((item) => ({
          label: item.title,
          value: item.id,
        }));
        setProjects(projects);
      }
    });
  }, []);

  useEffect(() => {
    if (currentProjectId) {
      queryEnvBy({ project_id: currentProjectId } as IEnv).then(
        ({ code, data }) => {
          if (code === 0) {
            const envs = data.map((item) => ({
              label: item.name,
              value: item.id,
            }));
            setEnvs(envs);
          }
        },
      );
    }
  }, [currentProjectId]);
  const addonBefore = (
    <>
      <ProFormSelect
        style={{ color: 'burlywood' }}
        noStyle
        name={'env_id'}
        options={envs}
        required={true}
        placeholder={'环境选择'}
        rules={[{ required: true, message: 'host 不能为空' }]}
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
        initialValue={'GET'}
        options={API_REQUEST_METHOD}
        required={true}
        rules={[{ required: true, message: 'method 不能为空' }]}
      />
      <Button
        type={'primary'}
        onClick={() => {}}
        style={{ borderRadius: '10px', marginLeft: 40 }}
      >
        Try
      </Button>
    </>
  );

  const SaveOrUpdate = async () => {
    const values = interApiForm.getFieldsValue(true);
    console.log(values);
    if (interId) {
      //修改
      updateInterApiById(values).then(({ code, msg }) => {
        if (code === 0) {
          message.success(msg);
          setCurrentMode(1);
        }
      });
    } else {
      //新增
      insertInterApi(values).then(({ code, msg }) => {
        if (code === 0) {
          message.success(msg);
          setCurrentMode(1);
        }
      });
    }
  };

  const DetailExtra: FC<{ currentMode: number }> = ({ currentMode }) => {
    switch (currentMode) {
      case 1:
        return (
          <Button type={'primary'} onClick={() => setCurrentMode(3)}>
            Edit
          </Button>
        );
      case 2:
        return (
          <Button onClick={SaveOrUpdate} type={'primary'}>
            Save
          </Button>
        );
      case 3:
        return (
          <>
            <Button onClick={SaveOrUpdate} type={'primary'}>
              Save
            </Button>
            <Button style={{ marginLeft: 5 }} onClick={() => setCurrentMode(1)}>
              Cancel
            </Button>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <ProCard extra={<DetailExtra currentMode={currentMode} />}>
      <ProForm
        form={interApiForm}
        disabled={currentMode === 1}
        submitter={false}
      >
        <Tabs defaultActiveKey={'2'} size={'large'}>
          <Tabs.TabPane key={'1'} tab={'前置操作'}>
            <ProCard style={{ marginTop: 10 }} bodyStyle={{ padding: 0 }}>
              <Tabs tabPosition={'left'}>
                <Tabs.TabPane key={'1'} tab={'设置变量'}>
                  <InterBeforeParams form={interApiForm} mode={currentMode} />
                </Tabs.TabPane>
                <Tabs.TabPane key={'2'} tab={'添加脚本'}>
                  <InterBeforeScript form={interApiForm} mode={currentMode} />
                </Tabs.TabPane>
              </Tabs>
            </ProCard>
          </Tabs.TabPane>
          <Tabs.TabPane key={'2'} tab={'接口基础'}>
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
            </ProForm.Group>
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
                rules={[
                  { required: true, message: '请输入请求url' },
                  { pattern: new RegExp('^\\/.*'), message: 'url 格式错误' },
                ]}
                addonAfter={addonAfter}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormTextArea label={'步骤描述'} name={'desc'} width={'lg'} />
            </ProForm.Group>
            <ProCard bodyStyle={{ padding: 0 }}>
              <Tabs defaultActiveKey={'1'}>
                <Tabs.TabPane key={'1'} tab={'Params'}>
                  <InterParam form={interApiForm} mode={currentMode} />
                </Tabs.TabPane>
                <Tabs.TabPane key={'2'} tab={'Headers'}>
                  <InterHeader form={interApiForm} />
                </Tabs.TabPane>
                <Tabs.TabPane key={'3'} tab={'Body'}></Tabs.TabPane>
              </Tabs>
            </ProCard>
          </Tabs.TabPane>
          <Tabs.TabPane key={'3'} tab={'出参提取'}>
            <InterExtracts form={interApiForm} mode={currentMode} />
          </Tabs.TabPane>
          <Tabs.TabPane key={'4'} tab={'相应断言'}>
            <InterAsserts form={interApiForm} mode={currentMode} />
          </Tabs.TabPane>
          <Tabs.TabPane key={'5'} tab={'后置动作'}>
            <ProCard style={{ marginTop: 10 }} bodyStyle={{ padding: 0 }}>
              <Tabs tabPosition={'left'}>
                <Tabs.TabPane key={'1'} tab={'添加脚本'}>
                  <InterAfterScript form={interApiForm} mode={currentMode} />
                </Tabs.TabPane>
              </Tabs>
            </ProCard>
          </Tabs.TabPane>
        </Tabs>
      </ProForm>
    </ProCard>
  );
};

export default Index;
