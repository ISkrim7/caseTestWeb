import { createNode, GraphConfig, Root } from '@/pages/DebuggerPage/Mind/node';
import { ProCard } from '@ant-design/pro-components';
import { Graph, Node, ObjectExt, Shape } from '@antv/x6';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { useEffect, useRef } from 'react';
import './index.less';

interface LayoutOptions {
  horizontalSpacing?: number; // 水平间距
  verticalSpacing?: number; // 垂直间距
  levelShrinkFactor?: number; // 层级收缩系数
}

const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
  horizontalSpacing: 200,
  verticalSpacing: 80,
  levelShrinkFactor: 0.8,
};
//钩子函数
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

const Index = () => {
  const selectedNodeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const graph = new Graph({
      container: containerRef.current,
      ...GraphConfig,
    });

    graph.use(
      new Keyboard({
        enabled: true,
      }),
    );
    graph.bindKey('tab', tab2AddChildNode);
    // 双击节点编辑
    graph.on('node:dblclick', selectedNode);
    graph.on('node:click', selectedNode);

    // 点击画布取消选中
    graph.on('blank:click', unselectedNode);

    // 初始化中心节点
    graph.addNode(Root);
    graph.centerContent();
    graphRef.current = graph;

    return () => graph.dispose();
  }, []);

  /**
   * tab 添加子组件
   * @param e
   */
  const tab2AddChildNode = (e: KeyboardEvent) => {
    e.preventDefault();
    if (selectedNodeRef.current) {
      console.log('selectedNodeRef.current', selectedNodeRef.current);
      addChildNode(selectedNodeRef.current);
    }
  };

  /**
   * 单机选择节点、改变颜色
   * 编辑内容
   * @param node
   */
  const selectedNode = ({ node }: any) => {
    selectedNodeRef.current = node;
    console.log(node.getPosition());
    node.attr('body/stroke', '#1677ff');
  };

  /**
   * 双击选择节点、改变颜色
   * 编辑内容
   * @param node
   */
  const unselectedNode = ({ node }: any) => {
    if (selectedNodeRef.current) {
      selectedNodeRef.current.attr('body/stroke', '#8f8f8f');
      selectedNodeRef.current = null;
    }
  };

  /**
   * 添加子主题
   * @param parentNode
   */
  const addChildNode = (parentNode: Node) => {
    // const graph = graphRef.current;
    // if (!parentNode) return;
    // if (!graph) return;
    // const childNodes = getChildNodes(parentNode.id) || [];
    // const parentPosition = parentNode.getPosition(); //坐标
    // let childNode;
    // const childSpacing = 80; // 子节点之间的垂直间距
    // const childX = parentPosition.x + 200; // Fixed X offset
    //
    // // Calculate positions for all children (existing + new)
    // const totalChildren = childNodes.length + 1;
    // const totalHeight = (totalChildren - 1) * childSpacing;
    // const startY = parentPosition.y - totalHeight / 2;
    //
    // // Create and position the new child node
    // const newChildY = startY + (totalChildren - 1) * childSpacing;
    // childNode = createNode('子主题_' + (childNodes.length + 1), childX, newChildY);
    if (!graphRef.current || !parentNode) return;

    // 创建新节点（临时位置）
    const childNode = createNode(
      `子主题_${getChildNodes(parentNode.id).length + 1}`,
      parentNode.getPosition().x + 100,
      parentNode.getPosition().y,
    );

    graphRef.current.addNode(childNode);
    // graph.addNode(childNode);
    // Update positions of all existing child nodes
    // childNodes.forEach((child, index) => {
    //   setNodePosition(child.id, startY + index * childSpacing);
    // });
    // 创建连接线
    addEdge(parentNode, childNode);

    // // 获取所有需要更新的边
    // const edgesToUpdate = graph.getConnectedEdges(parentNode)
    //   .filter(edge => edge.getTargetCell() !== parentNode);
    // // 更新所有相关边的路径
    // edgesToUpdate.forEach(edge => {
    //   edge.attr('line/strokeDasharray', '5,5'); // 添加虚线效果表示正在更新
    //   setTimeout(() => {
    //     edge.attr('line/strokeDasharray', ''); // 移除虚线效果
    //     // edge.update(); // 强制更新边路径
    //   }, 300);
    // });

    // 触发智能布局
    setTimeout(() => {
      organizeChildNodes(parentNode);
      // 更新所有连线
    }, 50);
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

  const setNodePosition = (nodeId: string, y: number) => {
    if (!graphRef.current) return;
    const nodes = graphRef.current.getNodes();
    const node = nodes.find((item: any) => item.id === nodeId);
    if (node) {
      node.setPosition({
        x: node.getPosition().x,
        y: y,
      });
    }
  };

  // 核心布局引擎（带防重叠）
  const organizeChildNodes = (
    parentNode: Node,
    options = DEFAULT_LAYOUT_OPTIONS,
  ) => {
    const { horizontalSpacing, verticalSpacing, levelShrinkFactor } = options;
    const graph = graphRef.current;
    if (!graph || !parentNode) return;

    // 获取所有子节点（使用安全的getChildNodes）
    const children = getChildNodes(parentNode.id);
    if (!children.length) return;

    // 计算父节点位置
    const parentPos = parentNode.getPosition();
    const parentSize = parentNode.getSize();

    // 按子树计算所需空间
    const subtreeHeights: number[] = [];
    children.forEach((child) => {
      subtreeHeights.push(calculateSubtreeHeight(child, verticalSpacing));
    });

    // 总高度需求（包含间距）
    const totalHeight =
      subtreeHeights.reduce((sum, h) => sum + h, 0) +
      verticalSpacing * (children.length - 1);

    // 起始Y坐标（垂直居中）
    let currentY = parentPos.y - totalHeight / 2;

    // 定位每个子树
    children.forEach((child, index) => {
      const subtreeHeight = subtreeHeights[index];
      const childX = parentPos.x + horizontalSpacing;

      // 计算当前子树的中心Y
      const subtreeCenterY = currentY + subtreeHeight / 2;

      // 设置子节点位置（水平缩进）
      child.setPosition({
        x: childX,
        y: subtreeCenterY,
      });

      // 递归布局子树
      layoutSubtree(child, {
        horizontalSpacing: horizontalSpacing * levelShrinkFactor,
        verticalSpacing,
        levelShrinkFactor,
      });

      currentY += subtreeHeight + verticalSpacing;
    });

    // 防重叠矫正（二次检查）
    applyAntiOverlap(children, {
      minSpacing: verticalSpacing * 0.7,
    });
  };

  // 计算子树高度（递归）
  const calculateSubtreeHeight = (node: Node, spacing: number): number => {
    const children = getChildNodes(node.id);
    if (!children.length) return node.getSize().height;

    const childrenHeights = children.map((child) =>
      calculateSubtreeHeight(child, spacing),
    );

    const maxChildHeight = Math.max(...childrenHeights);
    return Math.max(
      node.getSize().height,
      childrenHeights.reduce((sum, h) => sum + h, 0) +
        spacing * (children.length - 1),
    );
  };

  // 递归子树布局
  const layoutSubtree = (node: Node, options: LayoutOptions, level = 1) => {
    const children = getChildNodes(node.id);
    if (!children.length) return;

    const nodePos = node.getPosition();
    const nodeSize = node.getSize();

    // 计算子节点总高度
    const totalHeight =
      children.reduce((sum, child) => {
        return sum + calculateSubtreeHeight(child, options.verticalSpacing);
      }, 0) +
      options.verticalSpacing * (children.length - 1);

    let currentY = nodePos.y - totalHeight / 2;

    children.forEach((child) => {
      const childHeight = calculateSubtreeHeight(
        child,
        options.verticalSpacing,
      );
      const childX = nodePos.x + options.horizontalSpacing;

      child.setPosition({
        x: childX,
        y: currentY + childHeight / 2,
      });

      // 递归布局（增加层级缩进）
      layoutSubtree(
        child,
        {
          ...options,
          horizontalSpacing:
            options.horizontalSpacing * options.levelShrinkFactor,
        },
        level + 1,
      );

      currentY += childHeight + options.verticalSpacing;
    });
  };

  // 防重叠矫正
  const applyAntiOverlap = (nodes: Node[], options: { minSpacing: number }) => {
    nodes.sort((a, b) => a.getPosition().y - b.getPosition().y);

    for (let i = 1; i < nodes.length; i++) {
      const prev = nodes[i - 1];
      const curr = nodes[i];

      const prevBottom = prev.getPosition().y + prev.getSize().height / 2;
      const currTop = curr.getPosition().y - curr.getSize().height / 2;

      if (currTop - prevBottom < options.minSpacing) {
        const adjustY =
          prevBottom + options.minSpacing + curr.getSize().height / 2;
        curr.setPosition({
          x: curr.getPosition().x,
          y: adjustY,
        });

        // 需要调整后续节点
        for (let j = i + 1; j < nodes.length; j++) {
          nodes[j].setPosition({
            x: nodes[j].getPosition().x,
            y: nodes[j].getPosition().y + (adjustY - curr.getPosition().y),
          });
        }
      }
    }
  };

  // 安全获取子节点（最终版）
  const getChildNodes = (nodeId: string): Node[] => {
    if (!graphRef.current) return [];

    try {
      return (graphRef.current.getOutgoingEdges(nodeId) || [])
        .map((edge) => {
          const target = edge?.getTargetCell?.();
          return target?.isNode?.() ? target : null;
        })
        .filter(Boolean) as Node[];
    } catch (error) {
      console.error('Error getting child nodes:', error);
      return [];
    }
  };
  return (
    <ProCard id={'canvas_root'} style={{ width: '100%', height: '100%' }}>
      <div className="node-editor-tool-app">
        <div className="app-content" ref={containerRef} />
      </div>
    </ProCard>
  );
};
export default Index;
