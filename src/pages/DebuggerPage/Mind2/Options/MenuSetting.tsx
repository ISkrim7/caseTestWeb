import MyTabs from '@/components/MyTabs';
import MIndLayout from '@/pages/DebuggerPage/Mind2/Options/MIndLayout';
import MindThem from '@/pages/DebuggerPage/Mind2/Options/MindThem';
import { BgColorsOutlined, LayoutOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import MindMapNode from 'simple-mind-map/types/src/core/render/node/MindMapNode';

interface ISelfProps {
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>;
  setCurrentLayout: React.Dispatch<React.SetStateAction<string>>;
  currentNode: MindMapNode | null;
}

const MenuSetting: FC<ISelfProps> = ({
  setCurrentTheme,
  currentNode,
  setCurrentLayout,
}) => {
  const menuSetting = [
    {
      key: '1',
      label: '主题',
      icon: <BgColorsOutlined />,
      children: (
        <MindThem themSetter={setCurrentTheme} currentNode={currentNode} />
      ),
    },
    {
      key: '2',
      label: '布局',
      icon: <LayoutOutlined />,
      children: <MIndLayout layoutSetter={setCurrentLayout} />,
    },
  ];
  return (
    <MyTabs
      defaultActiveKey="theme"
      items={menuSetting}
      type={'line'}
      tabPosition="left"
    />
  );
};

export default MenuSetting;
