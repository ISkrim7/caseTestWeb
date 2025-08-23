import DnDDraggable from '@/components/DnDDraggable';
import { DraggableItem } from '@/components/DnDDraggable/type';
import CaseStepSearchForm from '@/pages/CaseHub/CaseInfo/CaseStepSearchForm';
import CaseStep from '@/pages/CaseHub/CaseStep';
import { CaseStepInfo } from '@/pages/CaseHub/type';
import { ProCard } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useEffect, useState } from 'react';

const dataf = () => {
  const v: CaseStepInfo[] = [];
  for (let i = 0; i < 50; i++) {
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

const Index = () => {
  const [caseStepsContent, setCaseStepsContent] = useState<DraggableItem[]>([]);
  const [caseSteps, setCaseSteps] = useState<CaseStepInfo[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
  const [showCheckButton, setShowCheckButton] = useState<boolean>(false);
  const [checkedSupSteps, setCheckSubSteps] = useState<number[]>([]);
  const [allCollapsed, setAllCollapsed] = useState(true);
  useEffect(() => {
    checkedSupSteps.length > 0
      ? setShowCheckButton(true)
      : setShowCheckButton(false);
  }, [checkedSupSteps]);
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

  // 初始加载数据
  useEffect(() => {
    const loadInitialData = async () => {
      setDataLoading(true);
      const result = await fetchCaseSteps();
      setCaseSteps(result);
      setTags(
        Array.from(
          new Map(
            result.map((item) => [
              item.case_step_tag,
              { label: item.case_step_tag, value: item.case_step_tag },
            ]),
          ).values(),
        ),
      );
      setDataLoading(false);
    };

    loadInitialData();
  }, []);
  // 模拟API请求
  const fetchCaseSteps = async () => {
    try {
      // 这里模拟API请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    } finally {
    }
  };

  const transformData2Content = (data: CaseStepInfo[]) => {
    return data.map((item) => ({
      id: item.id,
      caseStepId: item.id,
      content: (
        <CaseStep caseStepData={item} setCheckSubSteps={setCheckSubSteps} />
      ),
    }));
  };

  return (
    <ProCard split={'horizontal'} bodyStyle={{ padding: 1 }}>
      <CaseStepSearchForm showCheckButton={showCheckButton} />
      <ProCard
        extra={<Button onClick={() => setAllCollapsed(true)}>全部收起</Button>}
        loading={dataLoading}
        bodyStyle={{ padding: 1 }}
      >
        <div
          style={{
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '8px',
            borderRadius: '8px',
          }}
        >
          <DnDDraggable
            items={caseStepsContent}
            setItems={setCaseStepsContent}
          />
          {/* 滚动提示 */}
          {caseStepsContent.length > 10 && (
            <div
              style={{
                position: 'sticky',
                bottom: 0,
                background: 'linear-gradient(transparent, #f0f2f5)',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '12px',
              }}
            >
              滚动查看更多
            </div>
          )}
        </div>
      </ProCard>
    </ProCard>
  );
};

export default Index;
