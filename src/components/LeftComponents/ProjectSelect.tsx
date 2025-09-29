import { IProject } from '@/api';
import { data2LabelValue } from '@/utils/somefunc';
import { ProjectTwoTone } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Select, Typography } from 'antd';
import { FC } from 'react';

const { Title } = Typography;

interface IProps {
  currentProjectId?: number;
  projects: IProject[];
  onProjectChange: (projectId: number | undefined) => void;
  onModuleChange: (moduleId: number) => void;
}

const ProjectSelect: FC<IProps> = ({
  currentProjectId,
  projects,
  onProjectChange,
}) => {
  return (
    <>
      {currentProjectId ? (
        <ProCard ghost={true} bodyStyle={{ padding: 0, marginTop: 15 }}>
          <Title
            level={3}
            onClick={() => onProjectChange(undefined)}
            style={{
              marginLeft: 12,
              marginBottom: 20,
            }}
          >
            <ProjectTwoTone style={{ marginRight: 10 }} />
            {projects.find((item) => item.id === currentProjectId)?.title}
          </Title>
        </ProCard>
      ) : (
        <Select
          style={{ width: '100%', marginBottom: 10, marginTop: 20 }}
          size={'large'}
          showSearch
          allowClear
          autoFocus
          placeholder={'请选择项目'}
          options={data2LabelValue(projects)}
          onChange={(value: number) => {
            onProjectChange(value);
          }}
        />
      )}
    </>
  );
};

export default ProjectSelect;
