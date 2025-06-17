import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React, { FC, useState } from 'react';
import MindMap from 'simple-mind-map';

interface ISelfProps {
  mindMapRef: React.MutableRefObject<MindMap | null>;
  showToolbar: boolean;
  toolbarPosition: any;
}

const FontFormat: FC<ISelfProps> = ({
  mindMapRef,
  toolbarPosition,
  showToolbar,
}) => {
  const [formatInfo, setFormatInfo] = useState({
    bold: false,
    underline: false,
    strike: false,
    color: '#000000',
    italic: false,
    fontSize: 16,
  });

  // 工具栏操作
  const toggleBold = () => {
    const newBoldState = !formatInfo.bold;
    setFormatInfo({ ...formatInfo, bold: newBoldState });
    mindMapRef.current?.richText?.formatText({
      bold: newBoldState,
    });
  };

  const toggleUnderline = () => {
    const newUnderlineState = !formatInfo.underline;
    setFormatInfo({ ...formatInfo, underline: newUnderlineState });
    mindMapRef.current?.richText?.formatText({ underline: newUnderlineState });
  };
  const toggleItalic = () => {
    const newItalicState = !formatInfo.italic;
    setFormatInfo({ ...formatInfo, italic: newItalicState });
    mindMapRef.current?.richText?.formatText({ italic: newItalicState });
  };

  const toggleStrikethrough = () => {
    const newStrikethroughState = !formatInfo.strike;
    setFormatInfo({ ...formatInfo, strike: newStrikethroughState });
    mindMapRef.current?.richText?.formatText({ strike: newStrikethroughState });
  };
  const changeColor = (color: string) => {
    const newUnderlineState = !formatInfo.underline;
    setFormatInfo({ ...formatInfo, color });
    mindMapRef.current?.richText.formatText({ color });
  };
  return (
    <div>
      {/* 富文本工具栏 */}
      {showToolbar && (
        <div
          style={{
            position: 'absolute',
            left: toolbarPosition.left,
            top: toolbarPosition.top,
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
          <Button
            icon={<BoldOutlined />}
            color="default"
            variant={formatInfo.bold ? 'filled' : 'outlined'}
            onClick={toggleBold}
          />
          <Button
            icon={<UnderlineOutlined />}
            color="default"
            variant={formatInfo.underline ? 'filled' : 'outlined'}
            onClick={toggleUnderline}
          />
          <Button
            icon={<ItalicOutlined />}
            color="default"
            variant={formatInfo.italic ? 'filled' : 'outlined'}
            onClick={toggleItalic}
          />
          <Button
            icon={<StrikethroughOutlined />}
            color="default"
            variant={formatInfo.strike ? 'filled' : 'outlined'}
            onClick={toggleStrikethrough}
          />
          <Button onClick={() => changeColor('#1890ff')}>颜色</Button>
        </div>
      )}
    </div>
  );
};

export default FontFormat;
