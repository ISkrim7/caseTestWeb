import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { Drawer } from 'antd';
import { FC } from 'react';

interface SelfProps {
  visible: boolean;
  onClose: any;
  allLogs: string;
}

const DrawerAceEditor: FC<SelfProps> = (props) => {
  const { visible, onClose, allLogs } = props;
  return (
    <Drawer
      title={'构造日志'}
      width={'70%'}
      maskClosable={false}
      open={visible}
      onClose={onClose}
      placement={'right'}
    >
      <span style={{ color: 'red', marginBottom: 10 }}>
        目前存在 实际在构造中，无日志返回情况.
        暂未发现其原因、若连构都失败、请反馈
      </span>
      <AceCodeEditor value={allLogs} height="100%" readonly={true} />
    </Drawer>
  );
};

export default DrawerAceEditor;
