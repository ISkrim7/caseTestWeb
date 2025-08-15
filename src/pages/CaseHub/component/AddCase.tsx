import MyDrawer from '@/components/MyDrawer';
import CaseForm from '@/pages/CaseHub/component/CaseForm';
import { Button } from 'antd';
import { FC, useState } from 'react';

interface SelfProps {
  currentModuleId: number;
  projectID: number;
  callback: () => void;
}

const AddCase: FC<SelfProps> = (props) => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const callback = () => {
    callback();
    setDrawerVisible(false);
  };
  return (
    <>
      <MyDrawer
        width={'65%'}
        name="添加用例"
        open={drawerVisible}
        setOpen={setDrawerVisible}
      >
        <CaseForm
          {...props}
          callback={callback}
          setDrawerVisible={setDrawerVisible}
        />
      </MyDrawer>
      <Button type="primary" onClick={() => setDrawerVisible(true)}>
        添加用例
      </Button>
    </>
  );
};

export default AddCase;
