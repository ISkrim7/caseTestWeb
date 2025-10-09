import React, { FC } from 'react';
import MindMap from 'simple-mind-map';

interface ISelfProps {
  mindMapRef: React.MutableRefObject<MindMap | null>;
  showToolbar: boolean;
  callback: () => void;
  outerFrameMenuPosition: { left: string; top: string };
}

const OutFrameSetting: FC<ISelfProps> = ({
  mindMapRef,
  showToolbar,
  callback,
  outerFrameMenuPosition,
}) => {
  const removeOutFrame = () => {
    if (mindMapRef.current) {
      // @ts-ignore
      mindMapRef.current.outerFrame.removeActiveOuterFrame();
      callback();
    }
  };
  return (
    <>
      {showToolbar && (
        <div
          style={{
            position: 'absolute',
            left: outerFrameMenuPosition.left,
            top: outerFrameMenuPosition.top,
            transform: 'translateX(-50%)',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            borderRadius: 4,
            padding: 8,
            zIndex: 1000,
            display: 'flex',
            gap: 8,
          }}
        >
          <a onClick={removeOutFrame}>删除</a>
        </div>
      )}
    </>
  );
};
export default OutFrameSetting;
