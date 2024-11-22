import { IProject } from '@/api';
import { queryProject } from '@/api/project';
import LeftRootTree from '@/components/LeftPart/LeftRootTree';
import LeftTreePart from '@/components/LeftPart/LeftTreePart';
import { ProjectTwoTone } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Result, Select } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  currentProjectId?: number;
  setCurrentProjectId: any;
  setCurrentCasePartId: any;
  root?: boolean;
}

const Index: FC<SelfProps> = ({
  currentProjectId,
  root,
  setCurrentProjectId,
  setCurrentCasePartId,
}) => {
  const [projectArray, setProjectArray] = useState<IProject[]>([]);
  // 首次进入 获取project Arr  默认选择第一个
  useEffect(() => {
    const fetchProjects = async () => {
      const { code, data } = await queryProject();
      if (code === 0) {
        return data;
      }
    };
    fetchProjects().then((data) => {
      if (data && data.length > 0) {
        setProjectArray(data);
        // 默认第一个
        setCurrentProjectId(data[0].id);
      }
    });
  }, []);

  return (
    <ProCard style={{ height: 'auto' }}>
      {projectArray.length > 0 ? (
        <>
          {currentProjectId ? (
            <div style={{ marginTop: 20 }}>
              <a
                onClick={() => setCurrentProjectId(null)}
                style={{
                  marginLeft: 12,
                  fontWeight: 400,
                  fontSize: 20,
                  marginBottom: 20,
                }}
              >
                <ProjectTwoTone style={{ marginRight: 10 }} />
                {
                  projectArray.find((item) => item.id === currentProjectId)
                    ?.name
                }
              </a>
            </div>
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
                  return { value: item.id, label: item.name };
                })}
                onChange={(value: number) => {
                  setCurrentProjectId(value);
                }}
              />
            </>
          )}
          <>
            <ProCard bodyStyle={{ padding: 0 }}>
              {root ? (
                <LeftRootTree
                  currentProjectId={currentProjectId}
                  setCurrentCasePartId={setCurrentCasePartId}
                />
              ) : (
                <LeftTreePart
                  currentProjectId={currentProjectId}
                  setCurrentCasePartId={setCurrentCasePartId}
                />
              )}
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
