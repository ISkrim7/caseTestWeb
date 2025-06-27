export const MapConfig = {
  scaleRatio: 0.1, // 缩放比例
  translateRatio: 1, // 平移比例
  minZoomRatio: 20, // 最小缩放比例 （影响的行为为Ctrl+-快捷键、鼠标滚轮及触控板），不会影响其他方法，比如view.setScale，需要你自行限制传入的大小
  maxZoomRatio: 400, //	最大放大值，百分数，传-1代表不限制，否则传0以上数字，，该选项只会影响view.enlarge方法

  mousewheelAction: 'move', // zoom（放大缩小）、move（上下移动）// 当mousewheelAction设为move时，可以通过该属性控制鼠标滚动一下视图移动的步长，单位px
  mousewheelMoveStep: 10, //当mousewheelAction设为move时，可以通过该属性控制鼠标滚动一下视图移动的步长，单位px
  mouseScaleCenterUseMousePosition: true, //鼠标缩放是否以鼠标当前位置为中心点，否则以画布中心点
  mousewheelZoomActionReverse: true, //当mousewheelAction设为zoom时，或者按住Ctrl键时，默认向前滚动是缩小，向后滚动是放大，如果该属性设为true，那么会反过来
  disableTouchZoom: true, //禁止双指缩放，你仍旧可以使用api进行缩放，对TouchEvent插件生效
  disableMouseWheelZoom: false, //禁止鼠标滚轮缩放，你仍旧可以使用api进行缩放
  useLeftKeySelectionRightKeyDrag: true,
  isShowExpandNum: true, //节点收起时是否显示收起的数量
  initRootNodePosition: ['left', 'center'],
};
