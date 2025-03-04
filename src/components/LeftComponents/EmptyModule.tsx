import { insertModule } from '@/api/base';
import ModuleModal from '@/pages/DebuggerPage/part/LeftComponents/ModuleModal';
import { Button, Empty, message, Typography } from 'antd';
import { FC, useState } from 'react';

const { Text } = Typography;

export interface IProps {
  currentProjectId?: number;
  moduleType: number;
  callBack: () => {};
}

const EmptyModule: FC<IProps> = ({
  currentProjectId,
  moduleType,
  callBack,
}) => {
  const [open, setOpen] = useState(false);

  /**
   * 创建一个目录
   */
  const onFinish = async (value: { title: string }) => {
    if (currentProjectId) {
      const body = {
        title: value.title,
        project_id: currentProjectId,
        module_type: moduleType,
      };
      const { code, msg } = await insertModule(body);
      if (code === 0) {
        message.success(msg);
        setOpen(false);
        callBack();
      }
    }
  };
  return (
    <>
      <ModuleModal
        title={'创建'}
        open={open}
        onFinish={onFinish}
        setOpen={setOpen}
      />
      <Empty style={{ marginTop: 50 }} description={<Text>还没有目录</Text>}>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          去创建
        </Button>
      </Empty>
    </>
  );
};

export default EmptyModule;
