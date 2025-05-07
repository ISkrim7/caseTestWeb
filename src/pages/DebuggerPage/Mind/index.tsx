import { createNode, GraphConfig, Root } from '@/pages/DebuggerPage/Mind/node';
import { ProCard } from '@ant-design/pro-components';
import { Cell, Graph, Node, ObjectExt, Shape } from '@antv/x6';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { useEffect, useRef } from 'react';
import './index.less';

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
    graph.on('cell:click', (cell: Cell) => {
      console.log('cell', cell);
    });
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
    console.log('selectedNodeRef.current', selectedNodeRef.current);
    if (selectedNodeRef.current) {
      addChildNode(selectedNodeRef.current);
    }
  };

  /**
   * 双击选择节点、改变颜色
   * 编辑内容
   * @param node
   */
  const selectedNode = ({ node }: any) => {
    console.log('selectd', node);
    selectedNodeRef.current = node;
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
    const graph = graphRef.current;
    if (!parentNode) return;
    if (!graph) return;
    const childNum = getChildNodes(parentNode.id) || [];
    const parentPosition = parentNode.getPosition(); //坐标

    let childNode;
    const childSpacing = 50; // 子节点之间的垂直间距

    // 计算当前子节点的 Y 坐标，依据子节点是奇数还是偶数
    const totalChildren = childNum.length + 1; // 包含当前节点的总数
    let childY;

    if (totalChildren === 1) {
      // 第一个子节点，放置在父节点下方
      childY = parentPosition.y;
    } else {
      // 如果有多个子节点，计算均分的 Y 坐标
      const spacing = childSpacing * (totalChildren - 1); // 总间隔
      const startY = parentPosition.y - spacing / 2; // 起始位置在父节点上方
      childNum.map((node: Node) => {
        node.setPosition(
          node.getPosition().x,
          node.getPosition().y + childSpacing,
        );
      });
      childY = startY + (totalChildren - 1) * childSpacing; // 计算当前子节点的 Y 坐标
    }

    const childX = parentPosition.x + 200; // 始终保持子节点在父节点右侧
    childNode = createNode('子主题_' + (childNum.length + 1), childX, childY);

    graph.addNode(childNode);

    // 创建连接线
    graph.addEdge({
      source: {
        cell: parentNode,
        port: 'right-port',
      },
      target: {
        cell: childNode,
        port: 'left-port',
      },
      attrs: {
        line: {
          targetMarker: '',
          sourceMarker: '',
          strokeWidth: 2, // 线宽
          stroke: '#000', // 连接线颜色
        },
      },
      connector: 'smooth',
    });

    // // 自动选中新创建的节点
    // graph.resetSelection(childNode);
    // selectedNodeRef.current = childNode;
  };

  // 获取指定节点的所有子节点
  const getChildNodes = (nodeId: string) => {
    const graph = graphRef.current;
    if (!graph) return;
    const node = graph.getCellById(nodeId); // 获取指定的节点对象
    console.log('getChildNodes', node);
    const edges = graph.getEdges(); // 获取图中的所有边

    // 过滤出所有从该节点出发的边，并获取目标节点ID
    const childNodes: Node[] = edges
      .filter((edge) => edge.source.cell === nodeId) // 筛选出该节点作为起始节点的边
      .map((edge) => edge.target.cell); // 获取目标节点的ID
    return childNodes;
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
