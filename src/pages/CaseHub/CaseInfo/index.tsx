import {
  queryCasesByRequirement,
  queryTagsByRequirement,
  reorderTestCase,
} from '@/api/case/testCase';
import DnDDraggable from '@/components/DnDDraggable';
import { DraggableItem } from '@/components/DnDDraggable/type';
import CaseStepSearchForm from '@/pages/CaseHub/CaseInfo/CaseStepSearchForm';
import TestCase from '@/pages/CaseHub/TestCase';
import { CaseSearchForm, ITestCase } from '@/pages/CaseHub/type';
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
  const [reload, setReload] = useState(0);
  const [searchInfo, setSearchInfo] = useState<CaseSearchForm>({});
  useEffect(() => {
    checkedSupSteps.length > 0
      ? setShowCheckButton(true)
      : setShowCheckButton(false);
  }, [checkedSupSteps]);

  // 获取用例数据
  useEffect(() => {
    if (!reqId) return;

    const fetchCases = async () => {
      setDataLoading(true);
      try {
        const searchValues = {
          requirementId: reqId,
          ...searchInfo,
        };
        const { code, data } = await queryCasesByRequirement(searchValues);
        if (code === 0) {
          setCaseSteps(data);
        }
      } catch (error) {
        console.error('Failed to fetch cases:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchCases();
  }, [reqId, reload, searchInfo]);

  useEffect(() => {
    if (!reqId) return;
    queryTagsByRequirement({ requirementId: parseInt(reqId) }).then(
      async ({ code, data }) => {
        if (code === 0 && data.length > 0) {
          setTags(data.map((tag) => ({ label: tag, value: tag })));
        }
      },
    );
  }, [reqId]);
  useEffect(() => {
    if (caseSteps) {
      setCaseStepsContent(transformData2Content(caseSteps));
    }
  }, [caseSteps, tags]);

  const handelReload = () => {
    setReload(reload + 1);
  };
  const transformData2Content = (data: ITestCase[]) => {
    return data.map((item, index) => ({
      id: index,
      caseStepId: item.id,
      content: (
        <TestCase
          reqId={reqId}
          tags={tags}
          setTags={setTags}
          callback={handelReload}
          testcaseData={item}
          // setCheckSubSteps={setCheckSubSteps}
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

  const orderFetch = async (orderIds: number[]) => {
    await reorderTestCase({
      requirementId: parseInt(reqId!),
      caseIds: orderIds,
    });
  };
  const ExtraContent = (
    <Space>
      {/*<Button onClick={() => setAllCollapsed(false)}>全部展开</Button>*/}
      <Button onClick={handleAddCase}>添加用例</Button>
    </Space>
  );

  return (
    <ProCard split={'horizontal'} bodyStyle={{ padding: 1 }}>
      <CaseStepSearchForm
        tags={tags}
        showCheckButton={showCheckButton}
        setSearchForm={setSearchInfo}
      />

      <ProCard extra={ExtraContent} bodyStyle={{ padding: 1 }}>
        {caseSteps.length === 0 ? (
          <Empty
            style={{ height: '85vh' }}
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
              orderFetch={orderFetch}
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
