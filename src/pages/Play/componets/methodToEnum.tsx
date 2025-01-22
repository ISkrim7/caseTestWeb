import { IObjGet } from '@/api';
import { IUIMethod } from '@/pages/UIPlaywright/uiTypes';
import { Tooltip } from 'antd';

// 定义常量管理键名
const METHOD_TYPES = {
  NORMAL: '常规',
  ASSERTION: '断言',
};
export const methodToEnum = (data: IUIMethod[]) => {
  // 创建一个对象，用于将数据按照环境进行分组
  const groupedData: IObjGet = {
    [METHOD_TYPES.NORMAL]: [],
    [METHOD_TYPES.ASSERTION]: [],
  };
  // 提取 label 生成逻辑到公共函数
  const generateLabel = (description?: string, label?: string) => (
    <Tooltip title={description}>
      <span>{label}</span>
    </Tooltip>
  );
  // 遍历原始数据，并根据环境进行分组
  data.forEach((item) => {
    if (!item.value.startsWith('expect.')) {
      groupedData[METHOD_TYPES.NORMAL].push({
        label: generateLabel(item.description, item.label),
        value: item.value,
        need_locator: item.need_locator,
        need_value: item.need_value,
      });
    } else {
      groupedData[METHOD_TYPES.ASSERTION].push({
        label: generateLabel(item.description, item.label),
        value: item.value,
        need_locator: item.need_locator,
        need_value: item.need_value,
      });
    }
  });

  return Object.keys(groupedData).map((method) => ({
    label: <span>{method}</span>,
    value: method,
    options: groupedData[method],
  }));
};
