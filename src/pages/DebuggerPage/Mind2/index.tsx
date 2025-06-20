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
import MyDrawer from '@/components/MyDrawer';
import FontFormat from '@/pages/DebuggerPage/Mind2/Options/FontFormat';
import MenuSetting from '@/pages/DebuggerPage/Mind2/Options/MenuSetting';
import MindOpt from '@/pages/DebuggerPage/Mind2/Options/MindOpt';
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

  // 节点激活事件
  const handleNodeActive = (
    node: MindMapNode,
    activeNodeList: MindMapNode[],
  ) => {
    setCurrentNode(node);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    if (!initialData) return;
    // 注册插件
    Themes.init(MindMap);
    MindMap.usePlugin(Drag);
    MindMap.usePlugin(RichText, formatInfo);
    MindMap.usePlugin(Scrollbar, {
      // 滚动条配置选项
      padding: 5, // 滚动条与边缘的间距
      scrollbarWidth: 10, // 滚动条宽度
      scrollbarThumbColor: '#ccc', // 滚动条滑块颜色
      scrollbarTrackColor: '#f5f5f5', // 滚动条轨道颜色
      scrollbarThumbHoverColor: '#999', // 滚动条滑块悬停颜色
      minShowScrollbarNum: 1, // 最小显示滚动条数量
    });

    // 创建思维导图实例
    // @ts-ignore
    mindMapRef.current = new MindMap({
      el: containerRef.current,
      data: initialData,
      layout: currentLayout,
      theme: currentTheme,
      mousewheelAction: 'move', // zoom（放大缩小）、move（上下移动）
      // // 当mousewheelAction设为move时，可以通过该属性控制鼠标滚动一下视图移动的步长，单位px
      mousewheelMoveStep: 100,
      // // 鼠标缩放是否以鼠标当前位置为中心点，否则以画布中心点
      // mouseScaleCenterUseMousePosition: true,
      // // 当mousewheelAction设为zoom时，或者按住Ctrl键时，默认向前滚动是缩小，向后滚动是放大，如果该属性设为true，那么会反过来
      // mousewheelZoomActionReverse: true,
      // 禁止鼠标滚轮缩放，你仍旧可以使用api进行缩放
      disableTouchZoom: true,
      disableMouseWheelZoom: true,
    });

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

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        // position: 'relative',
        overflow: 'hidden',
      }}
      // bodyStyle={{
      //   padding: 0,
      //   margin: 0,
      //   height: '100vh',
      //   width: '100%',
      // }}
    >
      {/* 操作按钮组 */}
      <MindOpt mindMapRef={mindMapRef} currentNode={currentNode} />

      {/* 思维导图容器 */}
      <div
        ref={containerRef}
        style={{
          height: 'calc(100% - 56px)',
          width: '100%',
          border: '1px solid #f0f0f0',
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

      {/* 配置抽屉 */}
      <MyDrawer
        name="思维导图配置"
        width="25%"
        open={menuDropdownVisible}
        setOpen={setMenuDropdownVisible}
      >
        <MenuSetting
          setCurrentTheme={setCurrentTheme}
          setCurrentLayout={setCurrentLayout}
        />
      </MyDrawer>
    </div>
  );
};
export default Index;
