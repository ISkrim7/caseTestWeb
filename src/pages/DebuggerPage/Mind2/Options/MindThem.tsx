import MyTabs from '@/components/MyTabs';
import { Button, Card, Carousel, Flex, Space } from 'antd';
import React from 'react';
import MindMapNode from 'simple-mind-map/types/src/core/render/node/MindMapNode';

interface SelfProps {
  themSetter: React.Dispatch<React.SetStateAction<string>>;
  currentNode: MindMapNode | null;
}

const MindThem: React.FC<SelfProps> = ({ themSetter, currentNode }) => {
  const themItems = [
    {
      name: '脑图经典',
      value: 'autumn',
      url: '/mindImages/them/autumn.png',
    },
    {
      name: '暗黑',
      value: 'blackHumour',
      url: '/mindImages/them/black.png',
    },
    {
      name: '淡蓝',
      value: 'blueSky',
      url: '/mindImages/them/blue.png',
    },
  ];

  const setNodeStyle = (key: string, value: string) => {
    console.log('=====', currentNode);
    if (currentNode) {
      // @ts-ignore
      if (key === 'fillColor') {
        // @ts-ignore
        currentNode.setStyle('fillColor', value);
        // @ts-ignore
        currentNode.setStyle('color', '#ffffff');
      }
    }
  };
  const contentStyle: React.CSSProperties = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  const nodeThems = (
    <Carousel arrows infinite={false}>
      <div style={contentStyle}>
        <Flex vertical gap="small">
          <Flex gap="small" wrap>
            <Button
              style={{ backgroundColor: '#000000', color: 'white' }}
              onClick={() => setNodeStyle('fillColor', '#000000')}
              variant="solid"
            >
              主题
            </Button>
            <Button
              style={{ backgroundColor: '#1677ff', color: 'white' }}
              onClick={() => setNodeStyle('fillColor', '#1677ff')}
              variant="solid"
            >
              主题
            </Button>
            <Button
              style={{ backgroundColor: '#f99b04', color: 'white' }}
              onClick={() => {
                setNodeStyle('fillColor', '#f99b04');
              }}
              variant="solid"
            >
              主题
            </Button>
          </Flex>
          <Flex gap="small" wrap>
            <Button
              color={'default'}
              onClick={() => {
                if (currentNode) {
                  currentNode.setStyle('fillColor', '#FFFFFF');
                  currentNode.setStyle('color', '#000000');
                }
              }}
              variant="outlined"
            >
              主题
            </Button>
            <Button
              color={'default'}
              onClick={() => {
                if (currentNode) {
                  currentNode.setStyle('borderDasharray', '5,5'); // node.setStyle('borderDasharray', 'none')
                  currentNode.setStyle('fillColor', '#FFFFFF');
                  currentNode.setStyle('color', '#000000');
                }
              }}
              variant="dashed"
            >
              主题
            </Button>
            <Button
              style={{ backgroundColor: '#ff0000', color: 'white' }}
              onClick={() => {
                setNodeStyle('fillColor', '#ff0000');
              }}
              variant="solid"
            >
              主题
            </Button>
          </Flex>
        </Flex>
      </div>
      <div style={contentStyle}>
        <Flex vertical gap="small">
          <Flex gap="small" wrap>
            <Button
              style={{ backgroundColor: '#000000', color: 'white' }}
              onClick={() => setNodeStyle('fillColor', '#000000')}
              variant="solid"
            >
              主题
            </Button>
            <Button
              style={{ backgroundColor: '#1677ff', color: 'white' }}
              onClick={() => setNodeStyle('fillColor', '#1677ff')}
              variant="solid"
            >
              主题
            </Button>
            <Button
              style={{ backgroundColor: '#f99b04', color: 'white' }}
              onClick={() => {
                setNodeStyle('fillColor', '#f99b04');
              }}
              variant="solid"
            >
              主题
            </Button>
          </Flex>
          <Flex gap="small" wrap>
            <Button
              color={'default'}
              onClick={() => {
                if (currentNode) {
                  currentNode.setStyle('fillColor', '#FFFFFF');
                  currentNode.setStyle('color', '#000000');
                }
              }}
              variant="outlined"
            >
              主题
            </Button>
            <Button
              color={'default'}
              onClick={() => {
                if (currentNode) {
                  currentNode.setStyle('borderDasharray', '5,5'); // node.setStyle('borderDasharray', 'none')
                  currentNode.setStyle('fillColor', '#FFFFFF');
                  currentNode.setStyle('color', '#000000');
                }
              }}
              variant="dashed"
            >
              主题
            </Button>
            <Button
              style={{ backgroundColor: '#ff0000', color: 'white' }}
              onClick={() => {
                setNodeStyle('fillColor', '#ff0000');
              }}
              variant="solid"
            >
              主题
            </Button>
          </Flex>
        </Flex>
      </div>
    </Carousel>
  );

  const centerThem = (
    <Space direction={'vertical'}>
      {themItems.map((item) => (
        <Card
          onClick={() => {
            themSetter(item.value);
          }}
          title={item.name}
          hoverable
          cover={<img alt="example" src={item.url} />}
        />
      ))}
    </Space>
  );
  const nodeStyleSetting = <>{nodeThems}</>;

  const itmes = [
    {
      label: '画布',
      key: '1',
      children: centerThem,
    },
    {
      label: '节点',
      key: '2',
      disabled: currentNode === null,
      children: nodeStyleSetting,
    },
  ];
  return <MyTabs defaultActiveKey={'1'} tabPosition={'top'} items={itmes} />;
};

export default MindThem;
