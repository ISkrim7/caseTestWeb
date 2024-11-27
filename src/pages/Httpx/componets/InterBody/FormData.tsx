import { IInterfaceAPI } from '@/pages/Interface/types';
import { FormInstance } from 'antd';
import { FC } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}
const FormData: FC<SelfProps> = ({ form, mode }) => {
  return <div></div>;
};

export default FormData;
