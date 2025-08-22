import DnDDraggable from '@/components/DnDDraggable';
import { DraggableItem } from '@/components/DnDDraggable/type';
import CaseStepSearchForm from '@/pages/CaseHub/CaseInfo/CaseStepSearchForm';
import CaseStep from '@/pages/CaseHub/CaseStep';
import { CaseStepInfo } from '@/pages/CaseHub/type';
import { SearchOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Button, Input, Select, Space } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

const dataf = () => {
  const v: CaseStepInfo[] = [];
  for (let i = 0; i < 20; i++) {
    let d: CaseStepInfo = {
      id: i,
      uid: Date.now().toString().slice(0, 5),
      case_step_name: `case${i}`,
      case_step_level: 'P1',
      case_step_type: '普通',
      case_step_tag: 'tag2',
      case_step_setup: 'setup2',
      case_step_status: 2,
      case_step_mark: 'mark1',
      case_sub_step: [
        {
          id: 1,
          do: 'do1',
          exp: 'exp1',
        },
        {
          id: 2,
          do: 'do2',
          exp: 'exp2',
        },
      ],
    };
    v.push(d);
  }
  return v;
};
const data = dataf();
const caseLevel = [
  {
    label: 'P1',
    value: 'P1',
  },
  {
    label: 'P2',
    value: 'P2',
  },
  {
    label: 'P3',
    value: 'P3',
  },
  {
    label: 'P0',
    value: 'P0',
  },
];
const caseType = [
  {
    label: '冒烟',
    value: '冒烟',
  },
  {
    label: '普通',
    value: '普通',
  },
];

const Index = () => {
  const [caseStepsContent, setCaseStepsContent] = useState<DraggableItem[]>([]);
  const [caseSteps, setCaseSteps] = useState<CaseStepInfo[]>([]);
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);

  // 筛选条件状态
  const [searchName, setSearchName] = useState<string>('');
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [searchLevel, setSearchLevel] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('');
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setCaseSteps(data);
      setTags(
        Array.from(
          new Map(
            data.map((item) => [
              item.case_step_tag,
              { label: item.case_step_tag, value: item.case_step_tag },
            ]),
          ).values(),
        ),
      );
      setDataLoading(false);
    }
  }, [data]);
  useEffect(() => {
    if (caseSteps) {
      setCaseStepsContent(transformData2Content(caseSteps));
    }
  }, [caseSteps]);

  // useEffect(() => {
  //   if (caseSteps) {
  //     const reorderData = caseSteps.map((item) => item.id);
  //     console.log(reorderData);
  //   }
  // }, [caseSteps]);

  const transformData2Content = (data: CaseStepInfo[]) => {
    return data.map((item) => ({
      id: item.id,
      caseStepId: item.id,
      content: <CaseStep caseStepData={item} />,
    }));
  };

  // 计算当前筛选条件数量
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchName) count++;
    if (searchTags.length > 0) count++;
    if (searchLevel) count++;
    if (searchType) count++;
    return count;
  }, [searchName, searchTags, searchLevel, searchType]);
  // 清空所有筛选

  const clearAllFilters = useCallback(() => {
    setSearchName('');
    setSearchTags([]);
    setSearchLevel('');
    setSearchType('');
  }, []);

  const SearchArea = (
    <Space>
      <Input
        prefix={<SearchOutlined />}
        placeholder={'输入用例名称'}
        allowClear
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <Select
        placeholder="选择标签"
        allowClear
        prefix={<SearchOutlined />}
        mode="multiple"
        value={searchTags}
        onChange={(values: string[]) => setSearchTags(values)}
        options={tags}
        style={{ width: 130 }}
      />
      <Select
        placeholder="选择等级"
        allowClear
        prefix={<SearchOutlined />}
        onChange={(value: string) => setSearchLevel(value)}
        value={searchLevel}
        options={caseLevel}
        style={{ width: 130 }}
      />
      <Select
        placeholder="选择类型"
        allowClear
        prefix={<SearchOutlined />}
        value={searchType}
        onChange={(value: string) => setSearchType(value)}
        options={caseType}
        style={{ width: 130 }}
      />
      {/* 清空筛选按钮 */}
      {activeFilterCount > 0 && (
        <Button type="link" onClick={clearAllFilters} style={{ marginLeft: 8 }}>
          清空筛选 ({activeFilterCount})
        </Button>
      )}
    </Space>
  );
  return (
    <ProCard split={'horizontal'} bodyStyle={{ padding: 1 }}>
      <CaseStepSearchForm />
      <ProCard loading={dataLoading} bodyStyle={{ padding: 1 }}>
        <DnDDraggable items={caseStepsContent} setItems={setCaseStepsContent} />
      </ProCard>
    </ProCard>
  );
};

export default Index;
