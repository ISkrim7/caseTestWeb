import { Copy, CuttingOne, FileAddition, Plus } from '@icon-park/react';
import { Button, message, Space } from 'antd';
import React, { FC } from 'react';
import MindMap from 'simple-mind-map';

interface ISelfProps {
  mindMapRef: React.MutableRefObject<MindMap | null>;
  show: boolean;
  menuPosition: { left: string; top: string };
  callback: () => void;
}

const ContextMenu: FC<ISelfProps> = ({
  callback,
  mindMapRef,
  menuPosition,
  show,
}) => {
  const copy = () => {
    mindMapRef.current?.renderer.copy();
    message.success('复制成功');
    callback();
  };
  const cut = () => {
    mindMapRef.current?.renderer.cut();
    callback();
    message.success('剪切成功');
  };
  const paste = () => {
    mindMapRef.current?.renderer.paste();
    message.success('粘贴成功');
    callback();
  };
  const addChildren = () => {
    mindMapRef.current?.renderer.insertChildNode();
    callback();
  };
  const addBrother = () => {
    mindMapRef.current?.renderer.insertNode();
    callback();
  };
  const addParent = () => {
    // @ts-ignore
    mindMapRef.current?.renderer.insertParentNode();
    callback();
  };

  const addGENERALIZATION = () => {
    // mindMapRef.current?.renderer.setNodeNote();
    mindMapRef.current?.execCommand('ADD_GENERALIZATION');
    callback();
  };
  return (
    <div>
      {show && (
        <div
          style={{
            position: 'absolute',
            left: menuPosition.left,
            top: menuPosition.top,
            zIndex: 999,
            background: '#fff',
            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
            borderRadius: '5px',
            padding: '5px',
          }}
        >
          <Space direction={'vertical'}>
            <Button type={'text'} onClick={addChildren}>
              <Plus
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
              添加子主题
            </Button>
            <Button type={'text'} onClick={addBrother}>
              <Plus
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
              添加同级别主题
            </Button>
            <Button type={'text'} onClick={addParent}>
              <Plus
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
              添加父主题
            </Button>
            <Button type={'text'} onClick={addGENERALIZATION}>
              <Plus
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
              添加概要
            </Button>
            <Button type={'text'} onClick={copy}>
              <Copy
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />{' '}
              复制
            </Button>
            <Button type={'text'} onClick={cut}>
              <CuttingOne
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
              剪切
            </Button>
            <Button type={'text'} onClick={paste}>
              <FileAddition
                theme="multi-color"
                size="24"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
              粘贴
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
