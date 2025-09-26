import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import {
  AddItem,
  CornerUpLeft,
  CornerUpRight,
  DoubleLeft,
  DoubleRight,
  EditOne,
  Save,
  ScreenshotOne,
  SettingConfig,
  Tag,
} from '@icon-park/react';
import { Button, Divider, Modal, Space, Tooltip } from 'antd';
import React, { FC, useState } from 'react';
import MindMap from 'simple-mind-map';
import MindMapNode from 'simple-mind-map/types/src/core/render/node/MindMapNode';

interface ISelfProps {
  mindMapRef: React.MutableRefObject<MindMap | null>;
  currentNode: MindMapNode | null;
  currentNodes: MindMapNode[] | null;
  setMenuDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const MindOpt: FC<ISelfProps> = ({
  mindMapRef,
  setMenuDropdownVisible,
  currentNodes,
  currentNode,
}) => {
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

  const addTag = () => {
    mindMapRef.current?.execCommand('ADD_GENERALIZATION');
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
            icon={
              <CornerUpLeft
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            }
            onClick={() => mindMapRef.current?.execCommand('BACK')}
          />
        </Tooltip>
        <Tooltip title="重做 (Ctrl+Y)">
          <Button
            type="text"
            icon={
              <CornerUpRight
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            }
            onClick={() => mindMapRef.current?.execCommand('FORWARD')}
          />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title={'插入父主题'}>
          <Button
            type={'text'}
            disabled={currentNode === null}
            icon={
              <DoubleLeft
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            }
            // @ts-ignore
            onClick={() => mindMapRef.current?.renderer.insertParentNode()}
          />
        </Tooltip>
        <Tooltip title={'插入子主题'}>
          <Button
            type={'text'}
            disabled={currentNode === null}
            icon={
              <DoubleRight
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            }
            onClick={() => {
              mindMapRef.current?.renderer.insertChildNode(true, [], {
                text: '子主题222',
              });
            }}
          />
        </Tooltip>
        <Tooltip title={'插入子同级别主题'}>
          <Button
            type={'text'}
            disabled={currentNode === null}
            icon={
              <AddItem
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            }
            onClick={() => {
              console.log('===', mindMapRef.current);
              mindMapRef.current?.renderer.insertNode();
            }}
          />
        </Tooltip>
        <Divider type="vertical" />
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
        <Tooltip title={'概要'}>
          <Button
            type={'text'}
            icon={
              <Tag
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            }
            disabled={currentNode === null}
            onClick={addTag}
          ></Button>
        </Tooltip>
        <Tooltip title="外框">
          <Button
            type="text"
            icon={
              <ScreenshotOne
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            }
            disabled={currentNodes?.length === 0}
            onClick={() => {
              mindMapRef.current?.execCommand(
                'ADD_OUTER_FRAME',
                currentNodes,
                {},
              );
            }}
          ></Button>
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title={'保存'}>
          <Button
            type="text"
            icon={
              <Save
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            }
            onClick={() => console.log(mindMapRef.current?.getData(true))}
          ></Button>
        </Tooltip>
        <Tooltip title={'格式'}>
          <Button
            type={'text'}
            onClick={() => setMenuDropdownVisible(true)}
            icon={
              <SettingConfig
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            }
          ></Button>
        </Tooltip>
      </Space>
    </div>
  );
};
export default MindOpt;
