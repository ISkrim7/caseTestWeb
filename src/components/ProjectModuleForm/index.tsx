import { IModule, IModuleEnum } from '@/api';
import { queryTreeModuleByProject } from '@/api/base';
import { ModuleEnum } from '@/utils/config';
import { useModel } from '@@/exports';
import {
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import React, { FC } from 'react';

interface IProps {
  form: FormInstance<any>;
  projectSetter: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const Index: FC<IProps> = (props) => {
  const { form, projectSetter } = props;
  const { initialState } = useModel('@@initialState');
  const projects = initialState?.projects || [];

  const loopData = (data: IModule[]): IModuleEnum[] => {
    return data.map((item) => {
      if (item.children) {
        return {
          title: item.title,
          value: item.key,
          children: loopData(item.children),
        };
      }
      return { title: item.title, value: item.key };
    });
  };
  return (
    <ProForm.Group>
      <ProFormSelect
        width={'md'}
        options={projects}
        label={'所属项目'}
        name={'project_id'}
        required={true}
        onChange={(value) => {
          projectSetter(value as number);
          form.setFieldsValue({ module_id: undefined }); // 清空 module_id
          form.setFieldsValue({ env_id: undefined }); // 清空 env_id
        }}
      />
      <ProFormDependency name={['project_id']}>
        {({ project_id }) => {
          return (
            <ProFormTreeSelect
              dependencies={['project_id']}
              required
              name="module_id"
              label="所属模块"
              request={async () => {
                // 如果没有选择项目，直接返回空的模块数据
                if (!project_id) {
                  return []; // 或者返回一个带有提示信息的空数组
                }
                const { code, data } = await queryTreeModuleByProject(
                  project_id,
                  ModuleEnum.API,
                );
                if (code === 0) {
                  return loopData(data);
                } else {
                  return [];
                }
              }}
              allowClear
              rules={[{ required: true, message: '所属模块必选' }]}
              fieldProps={{
                // treeData: moduleEnum,
                fieldNames: {
                  label: 'title',
                },
                showSearch: true,
                popupMatchSelectWidth: false,
                autoClearSearchValue: true,
                treeNodeFilterProp: 'title',
              }}
              width={'md'}
            />
          );
        }}
      </ProFormDependency>
    </ProForm.Group>
  );
};

export default Index;
