import { Graph } from '@antv/x6';

export const bindShortcuts = (graph: Graph) => {
  graph.bindKey(['meta+x', 'ctrl+x'], () => {
    const cells = graph.getCells();
    if (cells.length) {
      graph.cut(cells); // 剪切
    }
    return false;
  });

  graph.bindKey('ctrl+c', () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.copy(cells);
    }
    return false;
  });
  graph.bindKey('ctrl+v', () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 });
      graph.cleanSelection();
      graph.select(cells);
    }
    return false;
  });

  graph.bindKey(['meta+z', 'ctrl+z'], () => {
    graph.undo(); // 撤销
  });
  graph.bindKey(['meta+y', 'ctrl+y'], () => {
    graph.redo(); // 重做
  });

  graph.bindKey(['ctrl+1', 'meta+1'], () => {
    const zoom = graph.zoom();
    if (zoom < 1.5) {
      graph.zoom(0.1); // 放大
    }
  });

  graph.bindKey(['ctrl+2', 'meta+2'], () => {
    const zoom = graph.zoom();
    if (zoom > 0.5) {
      graph.zoom(-0.1); // 缩小
    }
  });
};
