import { IModuleEnum } from '@/api';
import { searchUser } from '@/api/base';
import MyDrawer from '@/components/MyDrawer';
import { CaseHubConfig } from '@/pages/CaseHub/CaseConfig';
import { ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import { useModel } from '@@/exports';
import {
  ProCard,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  StepsForm,
} from '@ant-design/pro-components';
import { Button, Empty } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';

interface Props {
  currentProjectId?: number;
  currentModuleId?: number;
}

const Index: FC<Props> = ({ currentProjectId, currentModuleId }) => {
  const formRef = useRef<ProFormInstance>();

  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [selectProjectId, setSelectProjectId] = useState<number>();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const projects = initialState?.projects || [];
  const currentUser = initialState?.currentUser;
  const { CASE_LEVEL_OPTION } = CaseHubConfig;
  // 根据当前项目ID获取环境和用例部分
  useEffect(() => {
    if (currentProjectId) {
      setSelectProjectId(currentProjectId);
    }
  }, [currentProjectId]);
  useEffect(() => {
    if (selectProjectId) {
      setSelectProjectId(selectProjectId);
      fetchModulesEnum(selectProjectId, ModuleEnum.CASE, setModuleEnum).then();
    } else {
      setModuleEnum([]);
    }
  }, [selectProjectId]);

  const queryUser: any = async (value: any) => {
    const { keyWords } = value;
    if (keyWords) {
      const { code, data } = await searchUser({ username: keyWords });
      if (code === 0) {
        return data.map((item) => ({
          label: item.username,
          value: item.id,
        }));
      }
    }
  };
  const RequirementsForm = (
    <StepsForm.StepForm
      name="base"
      title="需求信息"
      initialValues={{
        // 设置初始值：优先使用传入的，否则使用选中的项目
        project_id: currentProjectId || selectProjectId,
        module_id: currentModuleId,
      }}
      stepProps={{
        description: '填写需求相关信息',
      }}
    >
      <ProFormSelect
        options={projects}
        label={'所属项目'}
        name={'project_id'}
        required={true}
        onChange={(value) => {
          setSelectProjectId(value as number);
          formRef.current?.setFieldValue('module_id', undefined);
        }}
      />
      <ProFormTreeSelect
        required
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
      <ProFormText name={'requirement_url'} label={'需求连接'} />
      <ProFormText
        name={'requirement_name'}
        label={'需求名'}
        required={true}
        rules={[{ required: true, message: '请填写需求名' }]}
      />
      <ProFormSelect
        name={'requirement_level'}
        label={'需求等级'}
        required={true}
        initialValue={'P2'}
        options={CASE_LEVEL_OPTION}
      />
    </StepsForm.StepForm>
  );

  const MaintainerInfoForm = (
    <StepsForm.StepForm
      name="user"
      title="维护人"
      stepProps={{
        description: '填写测试参与人',
      }}
    >
      <ProFormSelect
        showSearch
        name={'maintainer'}
        label={'维护人'}
        required={true}
        initialValue={currentUser?.username}
        request={queryUser}
        debounceTime={1000}
        fieldProps={{
          optionFilterProp: 'label', // 确保搜索是基于 label(chargeName) 而不是 value(chargeId)
          labelInValue: false, // 确保只提交 value 而不是 {value,label} 对象
        }}
      />
      <ProFormSelect
        showSearch
        mode="multiple"
        name={'develops'}
        label={'开发'}
        request={queryUser}
        debounceTime={1000}
        fieldProps={{
          optionFilterProp: 'label', // 确保搜索是基于 label(chargeName) 而不是 value(chargeId)
          labelInValue: false, // 确保只提交 value 而不是 {value,label} 对象
        }}
      />
    </StepsForm.StepForm>
  );
  const CaseHubChoiceForm = (
    <StepsForm.StepForm name="case" title="模块用例关联">
      <Empty description={'未开发'} />
    </StepsForm.StepForm>
  );
  return (
    <>
      <MyDrawer
        name={'添加需求'}
        width={'50%'}
        open={drawerVisible}
        setOpen={setDrawerVisible}
      >
        <ProCard>
          <StepsForm
            formRef={formRef}
            onFinish={async (values) => {
              console.log(values);
            }}
            stepsProps={{ direction: 'vertical' }}
            formProps={{
              validateMessages: {
                required: '此项为必填项',
              },
            }}
          >
            {RequirementsForm}
            {MaintainerInfoForm}
            {CaseHubChoiceForm}
          </StepsForm>
        </ProCard>
      </MyDrawer>
      <Button type="primary" onClick={() => setDrawerVisible(true)}>
        添加
      </Button>
    </>
  );
};

export default Index;
