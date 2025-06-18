import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { CornerUpLeft, CornerUpRight, EditOne } from '@icon-park/react';
import { Button, Modal, Space, Tooltip } from 'antd';
import React, { FC, useState } from 'react';
import MindMap from 'simple-mind-map';

interface ISelfProps {
  mindMapRef: React.MutableRefObject<MindMap | null>;
  currentNode: MindMap | null;
}

const MindOpt: FC<ISelfProps> = ({ mindMapRef, currentNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [script, setScript] = useState(null);

  const onModelFinish = async () => {
    if (script && currentNode) {
      currentNode?.setNote(script);
      setIsModalOpen(false);
    }
    setScript(null);
  };
  return (
    <>
      <Modal
        title="备注"
        open={isModalOpen}
        onOk={onModelFinish}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <AceCodeEditor
          _mode={'text'}
          onChange={(value: any) => setScript(value)}
          value={script}
        />
      </Modal>
      <Space style={{ marginBottom: 16 }}>
        <Tooltip title="撤销 (Ctrl+Z)">
          <Button
            type="text"
            icon={<CornerUpLeft theme="multi-color" size="24" />}
            onClick={() => mindMapRef.current?.execCommand('BACK')}
          />
        </Tooltip>
        <Tooltip title="重做 (Ctrl+Y)">
          <Button
            type="text"
            icon={<CornerUpRight theme="multi-color" size="24" />}
            onClick={() => mindMapRef.current?.execCommand('FORWARD')}
          />
        </Tooltip>
        <Tooltip title="备注">
          <Button
            disabled={currentNode === null}
            type="text"
            icon={
              <EditOne
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            }
            onClick={() => setIsModalOpen(true)}
          ></Button>
        </Tooltip>
        <Button onClick={() => console.log(mindMapRef.current?.getData(true))}>
          导出数据
        </Button>
      </Space>
    </>
  );
};
export default MindOpt;
