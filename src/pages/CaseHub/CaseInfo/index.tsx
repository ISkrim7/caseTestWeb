import { queryCasesByRequirement } from '@/api/case/testCase';
import DnDDraggable from '@/components/DnDDraggable';
import { DraggableItem } from '@/components/DnDDraggable/type';
import TestCase from '@/pages/CaseHub/TestCase';
import { ITestCase } from '@/pages/CaseHub/type';
import { useParams } from '@@/exports';
import { ProCard } from '@ant-design/pro-components';
import { Button, Empty, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

const Index = () => {
  const { reqId, projectId, moduleId } = useParams<{
    reqId: string;
    projectId: string;
    moduleId: string;
  }>();
  const [caseStepsContent, setCaseStepsContent] = useState<DraggableItem[]>([]);
  const [caseSteps, setCaseSteps] = useState<ITestCase[]>([]);
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
    if (reqId) {
      queryCasesByRequirement(reqId).then(async ({ code, data }) => {
        if (code === 0) {
          setCaseSteps(data);
          setTags(
            [...new Set(data.map((item) => item.case_tag))].map((tag) => ({
              label: tag!,
              value: tag!,
            })),
          );
        }
      });
    }
  }, [reqId]);

  useEffect(() => {
    if (caseSteps) {
      setCaseStepsContent(transformData2Content(caseSteps));
    }
  }, [caseSteps, tags]);
  // useEffect(() => {
  //   if (caseSteps) {
  //     const reorderData = caseSteps.map((item) => item.id);
  //     console.log(reorderData);
  //   }
  // }, [caseSteps]);

  const transformData2Content = (data: ITestCase[]) => {
    return data.map((item, index) => ({
      id: index,
      caseStepId: item.id,
      content: (
        <TestCase
          tags={tags}
          testcaseData={item}
          setCheckSubSteps={setCheckSubSteps}
        />
      ),
    }));
  };

  const handleAddCase = () => {
    // 添加用例
    const testCase: ITestCase = {
      case_name: '测试用例',
      case_level: 'P2',
      case_type: 2,
      case_status: 0,
      requirementId: reqId,
      project_id: parseInt(projectId!),
      module_id: parseInt(moduleId!),
    };
    setCaseSteps((prev) => [...prev, testCase]);
  };

  const ExtraContent = (
    <Space>
      {/*<Button onClick={() => setAllCollapsed(false)}>全部展开</Button>*/}
      <Button onClick={handleAddCase}>添加用例</Button>
    </Space>
  );
  return (
    <ProCard split={'horizontal'} bodyStyle={{ padding: 1 }}>
      <ProCard extra={ExtraContent} bodyStyle={{ padding: 1 }}>
        {caseSteps.length === 0 ? (
          <Empty
            style={{ height: '200px' }}
            description={<Typography.Text>暂无用例</Typography.Text>}
          />
        ) : (
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
        )}
      </ProCard>
    </ProCard>
  );
};

export default Index;
