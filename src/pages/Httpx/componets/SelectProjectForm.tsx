import { IProject } from '@/api';
import { ProFormSelect } from '@ant-design/pro-form';
import { useState } from 'react';

const SelectProjectForm = () => {
  const [project, setProject] = useState<IProject[]>([]);

  return <ProFormSelect label={'所属项目'} name={'project_Id'} />;
};

export default SelectProjectForm;
