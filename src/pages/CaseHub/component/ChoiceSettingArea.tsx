import { IModuleEnum } from '@/api';
import { queryProject } from '@/api/base';
import { moveTestCase2Common, setAllTestCaseStatus } from '@/api/case/testCase';
import { ITestCase } from '@/pages/CaseHub/type';
import { ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import {
  ModalForm,
  ProCard,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Form, message, Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface Props {
  showCheckButton: boolean;
  callback: () => void;
  selectedCase: number[];
  setSelectedCase: React.Dispatch<React.SetStateAction<number[]>>;
  allTestCase: ITestCase[];
}

const ChoiceSettingArea: FC<Props> = ({
  showCheckButton,
  allTestCase,
  selectedCase,
  setSelectedCase,
  callback,
}) => {
  const [form] = Form.useForm();
  const [selectProjectId, setSelectProjectId] = useState<number>();
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  useEffect(() => {
    queryProject().then(async ({ code, data }) => {
      if (code === 0) {
        setProjects(
          data.map((itme) => ({ label: itme.title, value: itme.id })),
        );
      }
    });
  }, []);
  useEffect(() => {
    if (selectProjectId) {
      setSelectProjectId(selectProjectId);
      fetchModulesEnum(selectProjectId, ModuleEnum.CASE, setModuleEnum).then();
    } else {
      setModuleEnum([]);
    }
  }, [selectProjectId]);

  const setAllSuccess = async () => {
    const values = {
      caseIds: selectedCase,
      status: 1,
    };
    const { code, msg } = await setAllTestCaseStatus(values);
    if (code === 0) {
      message.success(msg);
      callback();
    }
  };
  const setAllFail = async () => {
    const values = {
      caseIds: selectedCase,
      status: 2,
    };
    const { code, msg } = await setAllTestCaseStatus(values);
    if (code === 0) {
      message.success(msg);
      callback();
    }
  };
  const moveToCaseLib = async () => {
    const v = await form.validateFields();
    const values = {
      ...v,
      caseIds: selectedCase,
    };
    const { code, msg } = await moveTestCase2Common(values);
    if (code === 0) {
      message.success(msg);
      return true;
    }
  };

  return (
    <>
      {showCheckButton && (
        <ProCard
          collapsed
          title={
            <div>
              已选择 {selectedCase.length} 项{' '}
              <Space style={{ marginLeft: '10px' }}>
                <a
                  onClick={() => {
                    if (allTestCase) {
                      setSelectedCase(allTestCase.map((tc) => tc.id!));
                    }
                  }}
                >
                  全选
                </a>
                <a onClick={() => setSelectedCase([])}>取消选择</a>
              </Space>
            </div>
          }
          style={{
            background: '#e6e6e6',
            borderRadius: '8px',
          }}
          extra={
            <Space size={'small'}>
              <a onClick={setAllSuccess}>全部成功</a>
              <a onClick={setAllFail}>全部失败</a>

              <ModalForm
                form={form}
                onFinish={moveToCaseLib}
                trigger={<Button type="link">移动到用例库</Button>}
              >
                <ProFormSelect
                  options={projects}
                  label={'所属项目'}
                  name={'project_id'}
                  width={'md'}
                  required={true}
                  onChange={(value) => {
                    setSelectProjectId(value as number);
                    form.setFieldValue('module_id', undefined);
                  }}
                />
                <ProFormTreeSelect
                  required
                  width={'md'}
                  name="module_id"
                  label="所属模块"
                  rules={[{ required: true, message: '所属模块必选' }]}
                  fieldProps={{
                    treeData: moduleEnum,
                    fieldNames: {
                      label: 'title',
                    },
                    filterTreeNode: true,
                  }}
                />
              </ModalForm>
            </Space>
          }
        ></ProCard>
      )}
    </>
  );
};
export default ChoiceSettingArea;
