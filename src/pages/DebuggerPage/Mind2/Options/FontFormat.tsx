import {
  BoldOutlined,
  ClearOutlined,
  HighlightOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import React, { FC, useState } from 'react';
import MindMap from 'simple-mind-map';

type Format = {
  bold: boolean;
  underline: boolean;
  strike: boolean;
  italic: boolean;
  fontSize: number;
  color: string;
};

interface ISelfProps {
  mindMapRef: React.MutableRefObject<MindMap | null>;
  showToolbar: boolean;
  toolbarPosition: any;
  formatInfo: Format;
  setFormatInfo: React.Dispatch<React.SetStateAction<Format>>;
}

const FontFormat: FC<ISelfProps> = ({
  mindMapRef,
  toolbarPosition,
  showToolbar,
  formatInfo,
  setFormatInfo,
}) => {
  const [open, setOpen] = useState(false);
  // 预设颜色配置
  const colorPresets = {
    red: ['#ffccc7', '#ffa39e', '#ff7875', '#ff4d4f', '#f5222d'],
    green: ['#d9f7be', '#b7eb8f', '#95de64', '#73d13d', '#52c41a'],
    blue: ['#e6f7ff', '#bae7ff', '#91d5ff', '#69c0ff', '#40a9ff'],
  };

  // 工具栏操作
  const toggleBold = () => {
    const newBoldState = !formatInfo.bold;
    setFormatInfo({ ...formatInfo, bold: newBoldState });
    // @ts-ignore
    mindMapRef.current?.richText!.formatText({
      bold: newBoldState,
    });
  };

  const toggleUnderline = () => {
    const newUnderlineState = !formatInfo.underline;
    setFormatInfo({ ...formatInfo, underline: newUnderlineState });
    // @ts-ignore
    mindMapRef.current?.richText?.formatText({ underline: newUnderlineState });
  };
  const toggleItalic = () => {
    const newItalicState = !formatInfo.italic;
    setFormatInfo({ ...formatInfo, italic: newItalicState });
    // @ts-ignore
    mindMapRef.current?.richText?.formatText({ italic: newItalicState });
  };

  const toggleStrikethrough = () => {
    const newStrikethroughState = !formatInfo.strike;
    setFormatInfo({ ...formatInfo, strike: newStrikethroughState });
    // @ts-ignore
    mindMapRef.current?.richText?.formatText({ strike: newStrikethroughState });
  };

  const clear_format = () => {
    // @ts-ignore
    mindMapRef.current?.richText?.removeFormat();
  };
  const changeColor = (color: string) => {
    const newUnderlineState = !formatInfo.underline;
    setFormatInfo({ ...formatInfo, color }); // 更新状态
    // @ts-ignore
    mindMapRef.current?.richText?.formatText({ color }); // 应用到富文本
    setOpen(false); // 选择后关闭面板
  };
  // Dropdown 内容（纯预设颜色块）
  const dropdownContent = (
    <div style={{ padding: 8, width: 200 }}>
      {Object.entries(colorPresets).map(([label, colors]) => (
        <div key={label} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12 }}>{label}</div>
          <Space size={4} wrap>
            {colors.map((color) => (
              <Button
                type={'text'}
                key={color}
                onClick={() => changeColor(color)}
                style={{
                  width: 20,
                  height: 20,
                  background: color,
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Space>
        </div>
      ))}
    </div>
  );
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
            color={formatInfo.bold ? 'primary' : 'default'}
            variant={'text'}
            onClick={toggleBold}
          />
          <Button
            icon={<UnderlineOutlined />}
            color={formatInfo.underline ? 'primary' : 'default'}
            variant={'text'}
            onClick={toggleUnderline}
          />
          <Button
            icon={<ItalicOutlined />}
            color={formatInfo.italic ? 'primary' : 'default'}
            variant={'text'}
            onClick={toggleItalic}
          />
          <Button
            icon={<StrikethroughOutlined />}
            color={formatInfo.strike ? 'primary' : 'default'}
            variant={'text'}
            onClick={toggleStrikethrough}
          />
          <Dropdown
            open={open}
            onOpenChange={setOpen}
            trigger={['hover', 'click']} // 支持 hover 和 click 触发
            dropdownRender={() => dropdownContent}
            placement="bottom"
            arrow
          >
            <Button
              icon={<HighlightOutlined />}
              variant={'text'}
              style={{
                color: formatInfo.color, // 显示当前颜色
              }}
            />
          </Dropdown>
          <Button
            icon={<ClearOutlined />}
            color={'default'}
            variant={'text'}
            onClick={clear_format}
          />
        </div>
      )}
    </div>
  );
};

export default FontFormat;
