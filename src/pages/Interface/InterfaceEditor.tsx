import { IQueryPartTree } from '@/api';
import { casePartTree } from '@/api/interface';
import { queryProject } from '@/api/project';
import InterfaceSteps from '@/pages/Interface/InterfaceSteps';
import { IInterface, ISteps } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface SelfProps {
  interfaceForm: FormInstance<IInterface>;
  stepsForm: React.MutableRefObject<FormInstance<ISteps>[]>;
  stepsInfo?: ISteps[];
  setSteps?: any;
  addInter?: boolean;
  currentProjectId: string;
  currentInterfaceId?: string;
}

interface CasePartEnum {
  title: string;
  value: number;
  children?: CasePartEnum[];
}

const InterfaceEditor: FC<SelfProps> = (props) => {
  const { interfaceForm, currentProjectId } = props;
  const { API_LEVEL_SELECT, API_STATUS_SELECT } = CONFIG;
  const [projectEnum, setProjectEnum] =
    useState<{ label: string; value: number }[]>();
  const [casePartEnum, setCasePartEnum] = useState<CasePartEnum[]>();
  const [projectId, setProjectId] = useState<number>(
    parseInt(currentProjectId),
  );

  const fetchCaseParts = async () => {
    const loopData = (data: IQueryPartTree[]): CasePartEnum[] => {
      return data.map((item) => {
        if (item.children) {
          return {
            title: item.partName,
            value: item.id,
            children: loopData(item.children),
          };
        }
        return { title: item.partName, value: item.id };
      });
    };

    const { code, data } = await casePartTree({ projectID: projectId });
    if (code === 0) {
      const newData = loopData(data);
      setCasePartEnum(newData);
    }
  };
  const fetchProjects = async () => {
    const { code, data } = await queryProject();
    if (code === 0) {
      return data;
    }
  };
  useEffect(() => {
    if (projectId) {
      interfaceForm.setFieldsValue({ casePartID: undefined });
      fetchCaseParts().then();
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjects().then((data) => {
      if (data) {
        const proEnum = data.map((item) => {
          return { label: item.name, value: item.id };
        });
        setProjectEnum(proEnum);
      }
    });
  }, []);

  return (
    <ProCard split={'horizontal'}>
      <ProCard style={{ padding: 0 }} bordered={false}>
        <ProForm submitter={false} form={interfaceForm}>
          <ProForm.Group autoFocus>
            <ProFormText
              width={'lg'}
              name="title"
              label="用例标题"
              required={true}
              rules={[{ required: true, message: '用例标题必填' }]}
            />
            <ProFormSelect
              name="level"
              label="优先级"
              width={'md'}
              initialValue={'P1'}
              options={API_LEVEL_SELECT}
              required={true}
              rules={[{ required: true, message: '用例优先级必选' }]}
            />
            <ProFormSelect
              name="status"
              label="用例状态"
              initialValue={'DEBUG'}
              width={'md'}
              options={API_STATUS_SELECT}
              required={true}
              rules={[{ required: true, message: '用例状态必须选' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormTextArea name="desc" label="描述" width={'lg'} />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              required
              options={projectEnum}
              name="projectID"
              label="所属项目"
              width={'md'}
              rules={[{ required: true, message: '所属项目必选' }]}
              fieldProps={{
                onChange: (value: number) => {
                  setProjectId(value);
                },
              }}
            />
            <ProFormTreeSelect
              required
              name="casePartID"
              label="所属模块"
              allowClear
              rules={[{ required: true, message: '所属模块必选' }]}
              fieldProps={{
                treeData: casePartEnum,
              }}
              width={'md'}
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard style={{ marginTop: 10 }}>
        <InterfaceSteps {...props} />
      </ProCard>
    </ProCard>
  );
};

export default InterfaceEditor;
