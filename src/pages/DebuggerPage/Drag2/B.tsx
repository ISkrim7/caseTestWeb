import { ProForm, ProFormText } from '@ant-design/pro-components';

const B = () => {
  return (
    <ProForm submitter={false}>
      <ProFormText name={'id'} label={'id'} />
    </ProForm>
  );
};

export default B;
