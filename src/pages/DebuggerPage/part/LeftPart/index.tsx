import { IProject } from '@/api';
import { queryProject } from '@/api/base';
import LeftTreePart from '@/pages/DebuggerPage/part/LeftPart/LeftTreePart';
import { ProjectTwoTone } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Result, Select, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
const { Title } = Typography;

interface SelfProps {
  currentProjectId?: number;
  setCurrentProjectId: any;
  setCurrentCasePartId: any;
  root?: boolean;
  perKey?: string;
}

const Index: FC<SelfProps> = ({
  currentProjectId,
  root,
  setCurrentProjectId,
  perKey,
  setCurrentCasePartId,
}) => {
  const [projectArray, setProjectArray] = useState<IProject[]>([]);

  // 首次进入 获取project Arr  默认选择第一个
  useEffect(() => {
    queryProject().then(async ({ data }) => {
      if (data && data.length > 0) {
        setProjectArray(data);
        setCurrentProjectId(data[0].id);
      }
    });
  }, []);

  return (
    <ProCard style={{ height: 'auto' }}>
      {projectArray.length > 0 ? (
        <>
          {currentProjectId ? (
            <ProCard ghost={true} bodyStyle={{ padding: 0, marginTop: 15 }}>
              <Title
                level={3}
                onClick={() => setCurrentProjectId(null)}
                style={{
                  marginLeft: 12,
                  marginBottom: 20,
                }}
              >
                <ProjectTwoTone style={{ marginRight: 10 }} />
                {
                  projectArray.find((item) => item.id === currentProjectId)
                    ?.title
                }
              </Title>
            </ProCard>
          ) : (
            <>
              <Select
                style={{ width: '100%', marginBottom: 10, marginTop: 20 }}
                size={'large'}
                showSearch
                allowClear
                autoFocus
                placeholder={'请选择项目'}
                options={projectArray?.map((item) => {
                  return { value: item.id, label: item.title };
                })}
                onChange={(value: number) => {
                  setCurrentProjectId(value);
                }}
              />
            </>
          )}
          <>
            <ProCard bodyStyle={{ padding: 0 }}>
              <LeftTreePart
                perKey={perKey}
                currentProjectId={currentProjectId}
                setCurrentCasePartId={setCurrentCasePartId}
              />
            </ProCard>
          </>
        </>
      ) : (
        <Result
          style={{ marginTop: 50 }}
          status={404}
          subTitle={'还未添加任何项目'}
        />
      )}
    </ProCard>
  );
};

export default Index;
