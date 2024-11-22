import { ProCard } from '@ant-design/pro-components';

const NoBody = () => {
  return (
    <ProCard
      style={{ height: '20vh', lineHeight: '20vh', textAlign: 'center' }}
    >
      This request does not have a body
    </ProCard>
  );
};

export default NoBody;
