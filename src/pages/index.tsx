import { IProject } from '@/api';
import { queryProject } from '@/api/base';
import { ProCard } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';

export default function IndexPage() {
  const [projectList, setProjectList] = useState<IProject[]>([]);
  useEffect(() => {
    queryProject().then(({ code, data }) => {
      if (code === 0) {
        setProjectList(data);
      }
    });
  }, []);

  return (
    <ProCard split={'vertical'}>
      {projectList.map((item) => {
        return (
          <ProCard style={{ borderRadius: 10 }} bordered={true}>
            <div key={item.id}>{item.title}</div>
          </ProCard>
        );
      })}
    </ProCard>
  );
}
