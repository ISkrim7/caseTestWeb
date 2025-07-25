import PlayTaskResultTable from '@/pages/Play/PlayResult/PlayTaskResultTable';
import AssociationUICases from '@/pages/Play/PlayTask/PlayTaskDetail/AssociationUICases';
import PlayTaskBasicInfoForm from '@/pages/Play/PlayTask/PlayTaskDetail/PlayTaskBasicInfoForm';
import { useParams } from '@@/exports';
import { ProCard } from '@ant-design/pro-components';
import { Empty } from 'antd';

const Index = () => {
  const { taskId } = useParams<{ taskId: string }>();

  return (
    <ProCard split={'horizontal'}>
      <PlayTaskBasicInfoForm taskId={taskId} />
      <ProCard style={{ marginTop: 20 }}>
        {taskId ? (
          <AssociationUICases currentTaskId={taskId} />
        ) : (
          <Empty description={'需要先添加基本信息'} />
        )}
      </ProCard>

      {taskId && (
        <ProCard style={{ marginTop: 20 }}>
          <PlayTaskResultTable taskId={taskId} />
        </ProCard>
      )}
    </ProCard>
  );
};

export default Index;
