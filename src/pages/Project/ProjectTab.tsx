import MyTabs from '@/components/MyTabs';
import Env from '@/pages/Project/Env';
import Push from '@/pages/Project/Push';
import { useParams } from 'umi';

const ProjectTab = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const items = [
    {
      label: '环境',
      key: '2',
      children: <Env projectId={projectId} />,
    },
    {
      label: '推送',
      key: '3',
      children: <Push projectId={projectId} />,
    },
  ];
  return <MyTabs defaultActiveKey={'2'} items={items} />;
};

export default ProjectTab;
