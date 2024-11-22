import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { ProCard } from '@ant-design/pro-components';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  logs?: string;
}

const UiLogs: FC<SelfProps> = ({ logs }) => {
  const [value, setValue] = useState<string>();
  useEffect(() => {
    if (logs) {
      setValue(logs);
    }
  }, [logs]);
  return (
    <ProCard>
      <AceCodeEditor
        _mode={'json'}
        height={'80vh'}
        value={value}
        readonly={true}
        wrap={false}
      />
    </ProCard>
  );
};

export default UiLogs;
