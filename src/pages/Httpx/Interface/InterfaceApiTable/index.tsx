import MyProTable from '@/components/Table/MyProTable';
import { Button } from 'antd';
import { history } from 'umi';

const Index = () => {
  const columns = [{}];
  return (
    <>
      <MyProTable
        columns={columns}
        rowKey={'id'}
        toolBarRender={() => [
          <Button
            onClick={() => {
              history.push('/interface/interApi/detail');
            }}
          >
            添加
          </Button>,
        ]}
      />
    </>
  );
};

export default Index;
