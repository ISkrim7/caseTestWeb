import { ProCard } from '@ant-design/pro-components';
import { Button, FloatButton, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import MindMap from 'simple-mind-map';
// @ts-ignore
import Themes from 'simple-mind-map-plugin-themes';
import Drag from 'simple-mind-map/src/plugins/Drag.js';

import MyDrawer from '@/components/MyDrawer';
import MyTabs from '@/components/MyTabs';
import MIndLayout from '@/pages/DebuggerPage/Mind2/Options/MIndLayout';
import MindThem from '@/pages/DebuggerPage/Mind2/Options/MindThem';
import {
  BgColorsOutlined,
  LayoutOutlined,
  SettingTwoTone,
} from '@ant-design/icons';

const Index = () => {
  const containerRef = useRef(null);
  const mindMapRef: React.MutableRefObject<MindMap | null> = useRef(null);
  const [menuDropdownVisible, setMenuDropdownVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>('autumn');
  const [currentLayout, setCurrentLayout] =
    useState<string>('logicalStructure');

  const data = {
    data: {
      text: '根节点',
    },
    children: [{ data: { text: '子节点1' } }, { data: { text: '子节点2' } }],
  };
  useEffect(() => {
    if (containerRef.current) {
      // 注册主题
      Themes.init(MindMap);
      MindMap.usePlugin(Drag);
      // @ts-ignore
      mindMapRef.current = new MindMap({
        el: containerRef.current,
        data: data,
        layout: currentLayout,
        theme: currentTheme,
        isShowExpandNum: true,
        isLimitMindMapInCanvas: true,
      });
    }

    return () => {
      mindMapRef.current?.destroy();
    };
  }, [data]);

  //主题监听
  useEffect(() => {
    if (currentTheme) {
      mindMapRef.current?.setTheme(currentTheme);
    }
    if (currentLayout) {
      mindMapRef.current?.setLayout(currentLayout);
    }
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
      style={{ height: '100vh', width: '100%' }}
      split="horizontal"
      extra={
        <a
          onClick={() => {
            console.log(mindMapRef?.current?.getData(true));
          }}
        >
          data
        </a>
      }
    >
      <MyDrawer
        name={'配置'}
        width={'25%'}
        open={menuDropdownVisible}
        setOpen={setMenuDropdownVisible}
      >
        <MyTabs
          defaultActiveKey={'1'}
          items={MenuSetting}
          tabPosition={'left'}
        />
      </MyDrawer>
      <ProCard collapsible={true} layout={'center'} bordered={false} hoverable>
        <Space>
          <Button onClick={() => mindMapRef?.current?.execCommand('BACK')}>
            BACK
          </Button>
          <Button onClick={() => mindMapRef?.current?.execCommand('FORWARD')}>
            FORWARD
          </Button>
          <Button>C</Button>
          <Button>D</Button>
        </Space>
      </ProCard>

      <div
        id="mindMapContainer"
        style={{ height: '100%', width: '100%' }}
        ref={containerRef}
      ></div>

      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
        <FloatButton
          icon={<SettingTwoTone />}
          onClick={() => {
            setMenuDropdownVisible(true);
          }}
        />
      </FloatButton.Group>
    </ProCard>
  );
};
export default Index;
