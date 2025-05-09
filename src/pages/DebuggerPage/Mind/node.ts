import { Graph, Node, ObjectExt, Shape } from '@antv/x6';

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
  translating: { restrict: true }, // 限制节点只能在画布范围内移动
  grid: true, // 开启网格
  autoResize: true,
  background: { color: '#fffbe6' }, // 设置画布背景颜色
  mousewheel: {
    enabled: true, // 允许滚轮缩放
    zoomAtMousePosition: true, // 以鼠标位置为中心缩放
    modifiers: 'ctrl', // 需要按住 `ctrl` 键才可缩放
    minScale: 0.5, // 最小缩放比例
    maxScale: 2, // 最大缩放比例（保持一致）
  },
  scaling: {
    min: 0.5, // 画布最小缩放值
    max: 2, // 画布最大缩放值
  },
  panning: {
    enabled: true, // 允许拖动画布
    modifiers: 'alt', // 按住 `alt` 键拖动画布
  },
  resizing: {
    enabled: true,
    minWidth: 60,
    minHeight: 30,
    maxWidth: 300,
    maxHeight: 200,
  },
  connecting: {
    router: {
      name: 'manhattan', // 直角连接方式
      args: { padding: 10, avoid: true }, // 自动避开其他节点
    },
    connector: {
      name: 'rounded', // 圆角连接线
      args: { radius: 8 }, // 圆角半径
    },
    snap: { radius: 20 }, // 连接点吸附半径
    connectionPoint: 'anchor', // 连接桩类型
    allowBlank: false, // 禁止连接到空白区域
    allowEdge: false, // 禁止边连接到另一条边
    allowNode: false, // 禁止边连接到节点中心
    allowPort: true, // 仅允许连接到连接桩
    highlight: true, // 高亮显示可连接点
  },
  selecting: {
    enabled: true,
    multiple: true,
  },
  snapping: {
    enabled: true,
  },
  // 连接时的高亮效果
  highlighting: {
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#028FA6',
          stroke: '#028FA6',
        },
      },
    },
  },
  interacting: {
    nodeMovable: true,
    edgeMovable: true,
    edgeResizable: true,
  },
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

export const createNode = (label: string, x: number, y: number) => {
  return {
    x,
    y,
    id: Date.now().toString(),
    width: 120,
    height: 40,
    shape: 'rect',
    label: label,
    attrs: {
      body: {
        fill: '#ffffff',
        stroke: '#8f8f8f',
        rx: 6,
        ry: 6,
      },
      label: {
        text: label,
        fontSize: 14,
        textWrap: {
          breakWord: true,
          wordBreak: 'break-all',
        },
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
  x: 50,
  y: 300,
  id: 'root',
  width: 120,
  height: 40,
  rx: 10,
  ry: 15,
  label: '中心主题',
  shape: 'rect',
  attrs: {
    body: {
      refWidth: '100%', // 宽度跟随节点
      refHeight: '100%', // 高度跟随节点
      stroke: '#1677ff',
      strokeWidth: 2,
      fill: '#1677ff',
      rx: 6,
      ry: 6,
    },
    label: {
      text: '中心主题',
      refX: '50%', // 水平居中
      refY: '50%', // 垂直居中
      textAnchor: 'middle', // 文本居中
      textVerticalAnchor: 'middle',
      fill: '#e4e9f1', // 文字颜色
      fontSize: 13, // 文字大小
      background: '#1677ff',
      textWrap: {
        text: '中心主题',
        width: -16, // 宽度=节点宽度-16px
        height: -16, // 高度=节点高度-16px
        ellipsis: true,
        breakWord: true,
      },
    },
  },
  data: {
    // 用于保存原始文本
    originalLabel: '中心主题',
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
  editable: true,
  resizable: true, // 允许调整大小
  labelAutoSize: true, // 自动调整大小
};

/**
 * 添加连接线
 * @param graph
 * @param parentNode
 * @param childNode
 */
export const addEdge = (graph: Graph, parentNode: Node, childNode: Node) => {
  graph.addEdge({
    source: {
      cell: parentNode,
      port: 'right-port',
    },
    target: {
      cell: childNode,
      port: 'left-port',
    },
    connector: {
      attrs: {
        line: {
          stroke: '#2666FB', // 连接线颜色
          strokeWidth: 1, // 线条宽度
          targetMarker: { name: 'block', width: 12, height: 8 }, // 目标端箭头
        },
      },
    },
    zIndex: -1, // 确保连线在节点下方
  });
};
