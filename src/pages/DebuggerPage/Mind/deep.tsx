import { createNode, GraphConfig, Root } from '@/pages/DebuggerPage/Mind/node';
import { ProCard } from '@ant-design/pro-components';
import { Graph, Node, ObjectExt, Shape } from '@antv/x6';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { useEffect, useRef } from 'react';
import './index.less';

interface LayoutOptions {
  horizontalSpacing?: number;
  verticalSpacing?: number;
  levelShrinkFactor?: number;
}

const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
  horizontalSpacing: 200,
  verticalSpacing: 80,
  levelShrinkFactor: 0.8,
};

Shape.Rect.config({
  propHooks: {
    rx(metadata) {
      const { rx, ...others } = metadata;
      if (rx != null) {
        ObjectExt.setByPath(others, 'attrs/body/rx', rx);
      }
      return others;
    },
    ry(metadata) {
      const { ry, ...others } = metadata;
      if (ry != null) {
        ObjectExt.setByPath(others, 'attrs/body/ry', ry);
      }
      return others;
    },
  },
});

const MindMap = () => {
  const selectedNodeRef = useRef<Node | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  // 初始化图形
  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current,
      ...GraphConfig,
    });

    graph.use(new Keyboard({ enabled: true }));
    graph.bindKey('tab', (e) => {
      e.preventDefault();
      if (selectedNodeRef.current) {
        addChildNode(selectedNodeRef.current);
      }
    });

    graph.on('node:click', ({ node }) => {
      selectedNodeRef.current?.attr('body/stroke', '#8f8f8f');
      selectedNodeRef.current = node;
      node.attr('body/stroke', '#1677ff');
    });

    graph.on('blank:click', () => {
      selectedNodeRef.current?.attr('body/stroke', '#8f8f8f');
      selectedNodeRef.current = null;
    });

    graph.addNode(Root);
    graph.centerContent();
    graphRef.current = graph;

    return () => graph.dispose();
  }, []);

  // 获取子节点（安全版）
  const getChildNodes = (nodeId: string): Node[] => {
    if (!graphRef.current) return [];
    return (graphRef.current.getOutgoingEdges(nodeId) || [])
      .map((edge) => edge.getTargetCell())
      .filter((cell) => cell?.isNode()) as Node[];
  };

  // 添加子节点并自动布局
  const addChildNode = (parentNode: Node) => {
    const graph = graphRef.current;
    if (!graph || !parentNode) return;

    // 创建新节点
    const childNode = createNode(
      `子主题_${getChildNodes(parentNode.id).length + 1}`,
      parentNode.getPosition().x + 100,
      parentNode.getPosition().y,
    );
    const newChildNode = graph.addNode(childNode);
    // 创建连接线
    addEdge(parentNode, newChildNode);
    // 触发自动布局
    organizeLayout(parentNode);
  };
  /**
   * 添加连接线
   * @param parentNode
   * @param childNode
   */
  const addEdge = (parentNode: Node, childNode: Node) => {
    const graph = graphRef.current;
    if (!graph) return;
    graph.addEdge({
      source: {
        cell: parentNode,
        port: 'right-port',
      },
      target: {
        cell: childNode,
        port: 'left-port',
      },
      router: { name: 'er' },
      connector: {
        name: 'rounded',
        args: {
          radius: 20, // 圆角半径
        },
      },
      attrs: {
        line: {
          targetMarker: '',
          sourceMarker: '',
          strokeWidth: 2, // 线宽
          stroke: '#000', // 连接线颜色
        },
      },
    });
  };

  // 自动布局核心逻辑
  const organizeLayout = (startNode: Node) => {
    const graph = graphRef.current;
    if (!graph) return;

    // 计算布局
    const layoutNodes = (node: Node, level = 0): number => {
      const children = getChildNodes(node.id);
      if (!children.length) return node.getSize().height;

      // 计算子节点总高度
      let totalHeight = 0;
      const childHeights = children.map((child) => {
        const h = layoutNodes(child, level + 1);
        totalHeight += h;
        return h;
      });

      // 添加间距
      totalHeight +=
        (children.length - 1) * DEFAULT_LAYOUT_OPTIONS.verticalSpacing;

      // 定位子节点
      const startY = node.getPosition().y - totalHeight / 2;
      let currentY = startY;

      children.forEach((child, index) => {
        const childX =
          node.getPosition().x +
          DEFAULT_LAYOUT_OPTIONS.horizontalSpacing *
            Math.pow(DEFAULT_LAYOUT_OPTIONS.levelShrinkFactor, level);

        child.setPosition({
          x: childX,
          y: currentY + childHeights[index] / 2,
        });

        currentY +=
          childHeights[index] + DEFAULT_LAYOUT_OPTIONS.verticalSpacing;
      });

      return Math.max(node.getSize().height, totalHeight);
    };

    // 执行布局
    layoutNodes(startNode);

    // 更新连线
    setTimeout(() => {
      graph.getEdges().forEach((edge) => {
        edge.router('er', { direction: 'R', padding: 10 });
      });
    }, 50);
  };

  return (
    <ProCard style={{ width: '100%', height: '100%' }}>
      <div className="app-content" ref={containerRef} />
    </ProCard>
  );
};

export default MindMap;
