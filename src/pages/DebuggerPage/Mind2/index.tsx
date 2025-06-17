import { ProCard } from '@ant-design/pro-components';
import { Button, FloatButton, Space, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import MindMap from 'simple-mind-map';
// @ts-ignore
import Themes from 'simple-mind-map-plugin-themes';
// @ts-ignore
import Drag from 'simple-mind-map/src/plugins/Drag.js';
// @ts-ignore
import RichText from 'simple-mind-map/src/plugins/RichText.js';
// @ts-ignore
import Scrollbar from 'simple-mind-map/src/plugins/Scrollbar.js';

import MyDrawer from '@/components/MyDrawer';
import MyTabs from '@/components/MyTabs';
import FontFormat from '@/pages/DebuggerPage/Mind2/Options/FontFormat';
import MIndLayout from '@/pages/DebuggerPage/Mind2/Options/MIndLayout';
import MindThem from '@/pages/DebuggerPage/Mind2/Options/MindThem';
import {
  BgColorsOutlined,
  LayoutOutlined,
  SettingTwoTone,
} from '@ant-design/icons';
import { CornerUpLeft, CornerUpRight } from '@icon-park/react';
import MindMapNode from 'simple-mind-map/types/src/core/render/node/MindMapNode';

type Format = {
  bold: boolean;
  underline: boolean;
  strike: boolean;
  italic: boolean;
  fontSize: number;
  color: string;
};

const Index = () => {
  const containerRef = useRef(null);
  const mindMapRef: React.MutableRefObject<MindMap | null> = useRef(null);
  const [menuDropdownVisible, setMenuDropdownVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>('autumn');
  const [currentLayout, setCurrentLayout] =
    useState<string>('logicalStructure');

  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({
    left: '0',
    top: '0',
  });
  const [formatInfo, setFormatInfo] = useState<Format>({
    bold: false,
    underline: false,
    strike: false,
    italic: false,
    fontSize: 16,
    color: '#000000',
  });

  // 初始化数据
  const initialData = {
    data: { text: '根节点' },
    children: [{ data: { text: '子节点1' } }, { data: { text: '子节点2' } }],
  };
  useEffect(() => {
    if (!containerRef.current) return;
    if (!initialData) return;
    // 注册插件
    Themes.init(MindMap);
    MindMap.usePlugin(Drag);
    MindMap.usePlugin(RichText, formatInfo);
    MindMap.usePlugin(Scrollbar);

    // 创建思维导图实例
    // @ts-ignore
    mindMapRef.current = new MindMap({
      el: containerRef.current,
      data: initialData,
      layout: currentLayout,
      theme: currentTheme,
    });

    // 节点激活事件
    const handleNodeActive = (
      node: MindMapNode,
      activeNodeList: MindMapNode[],
    ) => {
      console.log('Active node:', node, activeNodeList);
    };

    // 富文本选择变化事件
    const handleSelectionChange = (
      hasRange: boolean,
      rect: any,
      formatInfo: any,
    ) => {
      if (hasRange) {
        setToolbarPosition({
          left: `${rect.left}px`,
          top: `${rect.top - 80}px`,
        });
        setFormatInfo(formatInfo || {});
      }
      setShowToolbar(hasRange);
    };

    // 添加事件监听
    mindMapRef.current.on('node_active', handleNodeActive);
    mindMapRef.current.on('rich_text_selection_change', handleSelectionChange);

    return () => {
      mindMapRef.current?.off('node_active', handleNodeActive);
      mindMapRef.current?.off(
        'rich_text_selection_change',
        handleSelectionChange,
      );
      mindMapRef.current?.destroy();
    };
  }, []);

  // 主题和布局变化监听
  useEffect(() => {
    if (currentTheme) mindMapRef.current?.setTheme(currentTheme);
    if (currentLayout) mindMapRef.current?.setLayout(currentLayout);
  }, [currentTheme, currentLayout]);

  const MenuSetting = [
    {
      key: '1',
      label: '主题',
      icon: <BgColorsOutlined />,
      children: <MindThem themSetter={setCurrentTheme} />,
    },
    {
      key: '2',
      label: '布局',
      icon: <LayoutOutlined />,
      children: <MIndLayout layoutSetter={setCurrentLayout} />,
    },
  ];
  return (
    <ProCard
      style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
      bodyStyle={{
        padding: 0,
        margin: 0,
        height: '80vh',
        width: '100%',
      }}
    >
      {/* 操作按钮组 */}
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
        <Button onClick={() => console.log(mindMapRef.current?.getData(true))}>
          导出数据
        </Button>
      </Space>

      {/* 思维导图容器 */}
      <div
        ref={containerRef}
        style={{
          height: 'calc(100% - 56px)',
          width: '100%',
          border: '1px solid #f0f0f0',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      />
      <FontFormat
        mindMapRef={mindMapRef}
        showToolbar={showToolbar}
        toolbarPosition={toolbarPosition}
        formatInfo={formatInfo}
        setFormatInfo={setFormatInfo}
      />
      {/* 设置按钮 */}
      <FloatButton
        icon={<SettingTwoTone />}
        style={{ right: 24 }}
        onClick={() => setMenuDropdownVisible(true)}
      />

      {/* 配置抽屉 */}
      <MyDrawer
        name="思维导图配置"
        width="25%"
        open={menuDropdownVisible}
        setOpen={setMenuDropdownVisible}
      >
        <MyTabs
          defaultActiveKey="theme"
          items={MenuSetting}
          tabPosition="left"
        />
      </MyDrawer>
    </ProCard>
  );
};
export default Index;
