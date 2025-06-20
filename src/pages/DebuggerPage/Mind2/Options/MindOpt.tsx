import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { CornerUpLeft, CornerUpRight, EditOne } from '@icon-park/react';
import { Button, Modal, Space, Tooltip } from 'antd';
import React, { FC, useState } from 'react';
import MindMap from 'simple-mind-map';
import MindMapNode from 'simple-mind-map/types/src/core/render/node/MindMapNode';

interface ISelfProps {
  mindMapRef: React.MutableRefObject<MindMap | null>;
  currentNode: MindMapNode | null;
}

const MindOpt: FC<ISelfProps> = ({ mindMapRef, currentNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [script, setScript] = useState(null);

  const onModelFinish = async () => {
    if (script && currentNode) {
      // @ts-ignore
      currentNode?.setNote(script);
      setIsModalOpen(false);
    }
    setScript(null);
  };
  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
      }}
    >
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
        <Button
          type="text"
          onClick={() => console.log(mindMapRef.current?.getData(true))}
        >
          data
        </Button>
      </Space>
    </div>
  );
};
export default MindOpt;
