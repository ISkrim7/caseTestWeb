import { IProject } from '@/api';
import { queryProjects } from '@/api/aps';
import StatisitcInfo from '@/pages/UIPlaywright/UIStatisitc/StatisitcInfo';
import { MoneyCollectOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { useEffect, useState } from 'react';

const TabPane = Tabs.TabPane;

const Index = () => {
  const [projects, setProjects] = useState<IProject[]>([]);

  useEffect(() => {
    queryProjects().then(({ code, data }) => {
      if (code === 0) {
        setProjects(data);
      }
    });
  }, []);
  return (
    <ProCard>
      <Tabs
        style={{ width: '100%', height: '100%' }}
        tabPosition={'top'}
        size={'large'}
      >
        {projects.map((project) => (
          <TabPane
            tab={
              <>
                <MoneyCollectOutlined style={{ color: 'orange' }} />{' '}
                {project.name}
              </>
            }
            key={'0'}
          >
            <StatisitcInfo projectId={project.id} />
          </TabPane>
        ))}
      </Tabs>
    </ProCard>
  );
};

export default Index;
