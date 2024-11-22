import { IProject } from '@/api';
import { IPostVariableOpt, PostVariable } from '@/api/interface';
import { queryProject } from '@/api/project';
import { IVariable } from '@/pages/Interface/types';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';

interface selfProps {
  isReload: any;
}

const AddVariable: FC<selfProps> = (props) => {
  const { isReload } = props;

  const [projects, setProjects] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);

  const fetchProjects = async () => {
    const { code, data } = await queryProject();
    if (code === 0) {
      return data;
    }
  };

  useEffect(() => {
    fetchProjects().then((data?: IProject[]) => {
      if (data) {
        console.log(data);
        const projects = data.map((item: IProject) => {
          return { label: item.name!, value: item.id! };
        });
        setProjects(projects);
      }
    });
  }, []);
  return (
    <ModalForm<IVariable>
      title={'添加变量'}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          添加变量
        </Button>
      }
      autoFocusFirstInput
      onFinish={async (values: IPostVariableOpt) => {
        console.log(values);
        const { code } = await PostVariable(values);
        if (code === 0) {
          isReload();
          return true;
        }
        return false;
      }}
      // 关闭执录入执行
      modalProps={{
        onCancel: () => console.log('close'),
      }}
    >
      <ProFormSelect
        name="projectId"
        label="所属项目"
        options={projects}
        required={true}
      />

      <ProFormText
        name="key"
        label="key"
        placeholder="变量名"
        required={true}
      />
      <ProFormTextArea
        name="value"
        label="value"
        placeholder="变量值"
        required={true}
        fieldProps={{ rows: 1 }}
      />
      <ProFormText name="desc" label="描述" placeholder="描述" />
    </ModalForm>
  );
};

export default AddVariable;
