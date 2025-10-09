import { FloatButton } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import Themes from 'simple-mind-map-plugin-themes';
// @ts-ignore
import Drag from 'simple-mind-map/src/plugins/Drag.js';
// @ts-ignore
import RichText from 'simple-mind-map/src/plugins/RichText.js';
// @ts-ignore
import Scrollbar from 'simple-mind-map/src/plugins/Scrollbar.js';
// @ts-ignore
import OuterFrame from 'simple-mind-map/src/plugins/OuterFrame.js';
// @ts-ignore
import TouchEvent from 'simple-mind-map/src/plugins/TouchEvent.js';
// @ts-ignore
import MyDrawer from '@/components/MyDrawer';
// @ts-ignore
import Select from 'simple-mind-map/src/plugins/Select.js';

import { MapConfig } from '@/pages/DebuggerPage/Mind2/MapConfig';
import ContextMenu from '@/pages/DebuggerPage/Mind2/Options/ContextMenu';
import FontFormat from '@/pages/DebuggerPage/Mind2/Options/FontFormat';
import MenuSetting from '@/pages/DebuggerPage/Mind2/Options/MenuSetting';
import MindOpt from '@/pages/DebuggerPage/Mind2/Options/MindOpt';
import OutFrameSetting from '@/pages/DebuggerPage/Mind2/Options/OutFrameSetting';
import { SettingTwoTone } from '@ant-design/icons';
import MindMap from 'simple-mind-map';
import MindMapNode from 'simple-mind-map/types/src/core/render/node/MindMapNode';

type Format = {
  bold: boolean;
  underline: boolean;
  strike: boolean;
  italic: boolean;
  fontSize: number;
  color: string;
};

const FormatInfo = {
  bold: false,
  underline: false,
  strike: false,
  italic: false,
  fontSize: 16,
  color: '#000000',
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
  const [currentNode, setCurrentNode] = useState<MindMapNode | null>(null);
  const [currentNodes, setCurrentNodes] = useState<MindMapNode[] | null>([]);
  const [formatInfo, setFormatInfo] = useState<Format>(FormatInfo);
  const [showContextmenu, setShowContextmenu] = useState(false);
  const [showOuterFrameMenu, setShowOuterFrameMenu] = useState(true);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    left: '0',
    top: '0',
  });
  const [outerFrameMenuPosition, setOuterFrameMenuPosition] = useState({
    left: '0',
    top: '0',
  });
  // 初始化数据
  const initialData = {
    data: { text: 'Main' },
    children: [
      {
        data: { text: '标签1' },
        children: [{ data: { text: '1、aaa  2、bbb' } }],
      },
      { data: { text: '标签2' } },
    ],
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

  // 外框点击时间
  const handleOuterFrameActive = (el: any, parentNode: any, range: any) => {
    const { x, y, width, height } = el.rbox();
    setOuterFrameMenuPosition({
      left: `${x + height}px`,
      top: `${y - height}px`,
    });
    setShowOuterFrameMenu(true);
  };

  // 节点激活事件
  const handleNodeActive = (
    node: MindMapNode,
    activeNodeList: MindMapNode[],
  ) => {
    setCurrentNode(node);
    setCurrentNodes(activeNodeList);
  };

  // 节点右键事件
  const handleNodeContextMenu = (e: any, node: MindMapNode) => {
    setContextMenuPosition({
      left: `${e.clientX - 10}px`,
      top: `${e.clientY - 10}px`,
    });
    setShowContextmenu(true);
  };

  //关闭右键菜单
  const hideNodeContextMenu = () => {
    setShowContextmenu(false);
    setContextMenuPosition({
      left: '0',
      top: '0',
    });
    setShowOuterFrameMenu(false);
    setOuterFrameMenuPosition({
      left: '0',
      top: '0',
    });
  };
  useEffect(() => {
    if (!containerRef.current) return;
    if (!initialData) return;
    // 注册插件
    Themes.init(MindMap);
    MindMap.usePlugin(Drag);
    MindMap.usePlugin(RichText, formatInfo);
    MindMap.usePlugin(OuterFrame);
    MindMap.usePlugin(Select);
    MindMap.usePlugin(Scrollbar);
    MindMap.usePlugin(TouchEvent);

    // 创建思维导图实例
    // @ts-ignore
    mindMapRef.current = new MindMap({
      el: containerRef.current,
      data: initialData,
      layout: currentLayout,
      theme: currentTheme,
      ...MapConfig,
    });

    // 添加事件监听
    mindMapRef.current.on('node_active', handleNodeActive);
    mindMapRef.current.on('rich_text_selection_change', handleSelectionChange);
    mindMapRef.current.on('outer_frame_active', handleOuterFrameActive);
    mindMapRef.current.on('node_contextmenu', handleNodeContextMenu);
    mindMapRef.current.on('node_click', hideNodeContextMenu);
    mindMapRef.current.on('draw_click', hideNodeContextMenu);
    mindMapRef.current.on('expand_btn_click', hideNodeContextMenu);
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

  return (
    <div
      style={{
        height: '80vh',
        width: '100%',
        // position: 'relative',
        // overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      {/* 操作按钮组 */}
      <MindOpt
        mindMapRef={mindMapRef}
        currentNode={currentNode}
        currentNodes={currentNodes}
        setMenuDropdownVisible={setMenuDropdownVisible}
      />

      {/* 思维导图容器 */}
      <div
        ref={containerRef}
        style={{
          height: '100%',
          width: '100%',
          // border: '1px solid #f0f0f0',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative', // 确保滚动条定位正确
        }}
      />
      {/*文字配置*/}
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
      <ContextMenu
        mindMapRef={mindMapRef}
        show={showContextmenu}
        menuPosition={contextMenuPosition}
        callback={() => setShowContextmenu(false)}
      />
      <OutFrameSetting
        mindMapRef={mindMapRef}
        showToolbar={showOuterFrameMenu}
        outerFrameMenuPosition={outerFrameMenuPosition}
        callback={() => setShowOuterFrameMenu(false)}
      />
      {/* 配置抽屉 */}
      <MyDrawer
        name="思维导图配置"
        width="30%"
        open={menuDropdownVisible}
        setOpen={setMenuDropdownVisible}
      >
        <MenuSetting
          setCurrentTheme={setCurrentTheme}
          setCurrentLayout={setCurrentLayout}
          currentNode={currentNode}
        />
      </MyDrawer>
    </div>
  );
};
export default Index;
