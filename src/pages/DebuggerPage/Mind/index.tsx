import {
  addEdge,
  createNode,
  GraphConfig,
  Root,
} from '@/pages/DebuggerPage/Mind/node';
import { ProCard } from '@ant-design/pro-components';
import { Graph, Node } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Scroller } from '@antv/x6-plugin-scroller';
import { Selection } from '@antv/x6-plugin-selection';

import { bindShortcuts } from '@/pages/DebuggerPage/Mind/bindShortcuts';
import { useEffect, useRef } from 'react';
import './index.less';

// 布局配置
const LAYOUT_CONFIG = {
  horizontalSpacing: 300, // 水平间距
  verticalSpacing: 80, // 垂直间距
  nodeHeight: 60, // 节点高度估计值
  levelShrinkFactor: 0.9, // 层级缩进系数
};

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

    graph.use(new Keyboard({ enabled: true, global: true }));
    graph.use(new Clipboard({ enabled: true }));
    graph.use(
      new Selection({
        enabled: true,
        filter: (cell) => cell.isNode(), // 只允许节点被选中
        showNodeSelectionBox: true,
      }),
    );
    graph.use(
      new History({
        enabled: true,
      }),
    );
    graph.use(new Scroller({ enabled: true }));

    // 绑定快捷键
    bindShortcuts(graph);
    // tab  添加子节点
    graph.bindKey('tab', (e) => {
      e.preventDefault();
      if (selectedNodeRef.current) {
        addChildNode(selectedNodeRef.current);
      }
    });
    graph.on('node:dblclick', ({ node }) => {
      selectedNodeRef.current?.attr('body/stroke', '#8f8f8f');
      selectedNodeRef.current = node;
    });
    graph.on('node:change:attrs', ({ node }) => {
      console.log(node.attr('label/text'));
    });

    //  单机 修改边框颜色
    graph.on('node:click', ({ node }) => {
      selectedNodeRef.current?.attr('body/stroke', '#8f8f8f');
      selectedNodeRef.current = node;
      node.attr('body/stroke', '#1677ff');
    });
    graph.on('node:embedding', ({ node }) => {});

    //  空白单机
    graph.on('blank:click', () => {
      selectedNodeRef.current?.attr('body/stroke', '#8f8f8f');
      selectedNodeRef.current = null;
    });

    graph.addNode(Root);
    graphRef.current = graph;

    return () => graph.dispose();
  }, []);

  // 安全获取子节点
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
      parentNode.getPosition().x + LAYOUT_CONFIG.horizontalSpacing,
      parentNode.getPosition().y,
    );
    const newChildNode = graph.addNode(childNode);

    // 创建连接线
    addEdge(graph, parentNode, newChildNode);

    // 从当前节点开始向上重新布局整棵树
    reorganizeTree(parentNode);
  };

  // 重新组织整棵树
  const reorganizeTree = (startNode: Node) => {
    // 找到最顶层祖先
    let rootNode = startNode;
    while (true) {
      const predecessors = graphRef.current?.getPredecessors(rootNode) || [];
      const parent = predecessors.find((c) => c.isNode());
      if (!parent) break;
      rootNode = parent as Node;
    }

    // 从根节点开始递归布局
    layoutSubtree(rootNode);
  };

  // 递归布局子树
  const layoutSubtree = (node: Node, level = 0): { height: number } => {
    const children = getChildNodes(node.id);
    if (!children.length) {
      return { height: LAYOUT_CONFIG.nodeHeight };
    }

    // 1. 先布局所有子节点
    let totalHeight = 0;
    const childrenLayouts = children.map((child) => {
      const layout = layoutSubtree(child, level + 1);
      totalHeight += layout.height;
      return layout;
    });

    // 添加间距
    totalHeight += (children.length - 1) * LAYOUT_CONFIG.verticalSpacing;

    // 2. 计算子节点位置
    const horizontalOffset =
      LAYOUT_CONFIG.horizontalSpacing *
      Math.pow(LAYOUT_CONFIG.levelShrinkFactor, level);

    let currentY = -totalHeight / 2;
    children.forEach((child, index) => {
      const childHeight = childrenLayouts[index].height;
      const centerY = currentY + childHeight / 2;

      child.setPosition({
        x: node.getPosition().x + horizontalOffset,
        y: node.getPosition().y + centerY,
      });

      currentY += childHeight + LAYOUT_CONFIG.verticalSpacing;
    });

    // 3. 调整当前节点位置（如果是中间节点）
    if (level > 0) {
      const firstChild = children[0];
      const lastChild = children[children.length - 1];
      const newY = (firstChild.getPosition().y + lastChild.getPosition().y) / 2;

      node.setPosition({
        x: node.getPosition().x,
        y: newY,
      });
    }

    // 4. 更新连线
    setTimeout(() => {
      graphRef.current?.getConnectedEdges(node).forEach((edge) => {
        edge.attr('line/stroke-width', 2);
      });
    }, 50);

    return {
      height: Math.max(LAYOUT_CONFIG.nodeHeight, totalHeight),
    };
  };

  return (
    <ProCard id={'canvas_root'}>
      <div className="node-editor-tool-app">
        <div className="app-content" ref={containerRef} />
      </div>
    </ProCard>
  );
};

export default MindMap;
