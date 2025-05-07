/**
 * container	HTMLElement	✓	画布的容器。
 * width	number		画布宽度，默认使用容器宽度。	-
 * height	number		画布高度，默认使用容器高度。	-
 * scaling	{ min?: number, max?: number }		画布的最小最大缩放级别。	{ min: 0.01, max: 16 }
 * autoResize	boolean | Element | Document		是否监听容器大小改变，并自动更新画布大小。	false
 * panning	boolean | PanningManager.Options		画布是否可以拖拽平移，默认禁用。	false
 * mousewheel	boolean | MouseWheel.Options		鼠标滚轮缩放，默认禁用。	false
 * grid	boolean | number | GridManager.Options		网格，默认使用 10px 的网格，但不绘制网格背景。	false
 * background	false | BackgroundManager.Options		背景，默认不绘制背景。	false
 * translating	Translating.Options		限制节点移动。	{ restrict: false }
 * embedding	boolean | Embedding.Options		嵌套节点，默认禁用。	false
 * connecting	Connecting.Options		连线选项。	{ snap: false, ... }
 * highlighting	Highlighting.Options		高亮选项。	{...}
 * interacting	Interacting.Options		定制节点和边的交互行为。	{ edgeLabelMovable: false }
 * magnetThreshold	number | onleave		鼠标移动多少次后才触发连线，或者设置为 onleave 时表示鼠标移出元素时才触发连线。	0
 * moveThreshold	number		触发 mousemove 事件之前，允许鼠标移动的次数。	0
 * clickThreshold	number		当鼠标移动次数超过指定的数字时，将不触发鼠标点击事件。	0
 * preventDefaultContextMenu	boolean		是否禁用浏览器默认右键菜单。	true
 * preventDefaultBlankAction	boolean		在画布空白位置响应鼠标事件时，是否禁用鼠标默认行为。	true
 * async	boolean		是否异步渲染	true
 * virtual	boolean		是否只渲染可视区域内容	false
 * onPortRendered	(args: OnPortRenderedArgs) => void		当某个连接桩渲染完成时触发的回调。	-
 * onEdgeLabelRendered	(args: OnEdgeLabelRenderedArgs) => void		当边的文本标签渲染完成时触发的回调。	-
 * createCellView	(cell: Cell) => CellView | null | undefined		是自定义元素的视图。
 */
export const GraphConfig = {
  width: 800,
  height: 600,
  grid: true,
  panning: true,
  mousewheel: false, // 鼠标滑轮
  background: {
    color: '#fffbe6', // 设置画布背景颜色
  },
  connecting: {
    connectionPoint: 'anchor',
    allowLoop: false, //是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 true 。
    allowBlank: false, //是否允许连接到画布空白位置的点，默认为 true。
    snap: true,
  },
  selecting: {
    enabled: true,
    multiple: true,
  },
  snapping: {
    enabled: true,
  },
};

export const createNode = (label: string = '子主题', x: number, y: number) => {
  return {
    x: x,
    y: y,
    id: Date.now().toString(),
    width: 120,
    height: 40,
    rx: 10,
    ry: 15,
    label: label,
    attrs: {
      body: {
        stroke: '#1677ff',
        strokeWidth: 2,
        fill: '#1677ff',
        rx: 6,
        ry: 6,
      },
      label: {
        fill: '#e4e9f1', // 文字颜色
        fontSize: 13, // 文字大小
      },
    },
    tools: ['node-editor'],
    ports: {
      groups: {
        right: {
          position: 'right', // 连接桩位置在右侧
          attrs: {
            circle: {
              r: 5, // 连接桩半径
              magnet: true, // 可被连接
              stroke: '#1677ff',
              strokeWidth: 2,
              fill: '#fff',
            },
          },
        },
        left: {
          position: 'left', // 连接桩位置在左侧
          attrs: {
            circle: {
              r: 0, // 连接桩半径
              magnet: true, // 可被连接
              stroke: '#1677ff',
              strokeWidth: 2,
              fill: '#fff',
            },
          },
        },
      },
      items: [
        {
          id: 'right-port', // 连接桩ID
          group: 'right', // 使用右侧组
        },
        {
          id: 'left-port', // 连接桩ID
          group: 'left', // 使用右侧组
        },
      ],
    },
  };
};
export const Root = {
  x: 100,
  y: 300,
  id: 'root',
  width: 120,
  height: 40,
  rx: 10,
  ry: 15,
  label: '中心主题',
  attrs: {
    body: {
      stroke: '#1677ff',
      strokeWidth: 2,
      fill: '#1677ff',
      rx: 6,
      ry: 6,
    },
    label: {
      fill: '#e4e9f1', // 文字颜色
      fontSize: 13, // 文字大小
      background: '#1677ff',
    },
  },
  tools: ['node-editor'],
  ports: {
    groups: {
      right: {
        position: 'right', // 连接桩位置在右侧
        attrs: {
          circle: {
            r: 5, // 连接桩半径
            magnet: true, // 可被连接
            stroke: '#1677ff',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
    items: [
      {
        id: 'right-port', // 连接桩ID
        group: 'right', // 使用右侧组
      },
    ],
  },
};
// export const createMindNode = (id: string, label: string, x: number, y: number) => {
//   return new Shape.Rect({
//     id,
//     x,
//     y,
//     width: 120,
//     height: 40,
//     rx: 10,
//     ry: 15,
//     shape: 'react-shape',
//     tools: ['node-editor'], //可编辑
//     attrs: {
//       body: {
//         stroke: '#8f8f8f',
//         strokeWidth: 1,
//         fill: '#fff',
//         rx: 6,
//         ry: 6,
//       },
//       label: {
//         text: label,    // 文本
//         fill: '#333',    // 文字颜色
//         fontSize: 13,    // 文字大小
//       },
//     },
//   });
// };

export const addChildNode = () => {};

// // 添加子节点
// const addChildNode = useCallback(
//   (parentNode: Shape) => {
//     if (!graph) return;
//     const parentId = parentNode.id;
//     const childId = `${parentId}-${Date.now()}`;
//     const parentPosition = parentNode.getPosition();
//     const childX = parentPosition.x + 200;
//     const childY = parentPosition.y;
//     const childLabel = '子主题';
//
//     const childNode = createMindNode(childId, childLabel, childX, childY);
//     graph.addNode(childNode);
//
//     // 添加连接线
//     graph.addEdge({
//       source: { cell: parentId },
//       target: { cell: childId },
//       attrs: {
//         line: {
//           stroke: '#A2B1C3',
//           strokeWidth: 2,
//           targetMarker: {
//             name: 'block',
//             width: 12,
//             height: 8,
//           },
//         },
//       },
//     });
//
//   },
//   [graph],
// );
