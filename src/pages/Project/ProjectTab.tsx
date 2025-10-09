import MyTabs from '@/components/MyTabs';
import Db from '@/pages/Project/Db';
import Env from '@/pages/Project/Env';
import GlobalVariables from '@/pages/Project/GlobalVariables';
import Push from '@/pages/Project/Push';
import { useParams } from 'umi';

const ProjectTab = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const items = [
    {
      label: 'DB',
      key: '1',
      children: <Db projectId={projectId} />,
    },
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
    {
      label: '变量',
      key: '4',
      children: <GlobalVariables projectId={projectId} />,
    },
  ];
  return <MyTabs defaultActiveKey={'2'} items={items} />;
};

export default ProjectTab;
