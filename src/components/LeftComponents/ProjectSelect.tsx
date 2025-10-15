import { IProject } from '@/api';
import { data2LabelValue } from '@/utils/somefunc';
import { CloseOutlined, ProjectTwoTone } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Button, Select, Typography } from 'antd';
import { FC } from 'react';

const { Title } = Typography;

interface IProps {
  currentProjectId?: number;
  projects: IProject[];
  onProjectChange: (projectId: number | undefined) => void;
  onModuleChange?: (moduleId: number) => void; // 可选属性
}

const ProjectSelect: FC<IProps> = ({
  currentProjectId,
  projects,
  onProjectChange,
  onModuleChange, // 添加缺失的解构
}) => {
  const handleClearProject = () => {
    onProjectChange(undefined);
    localStorage.removeItem('selectedProjectId');
    onModuleChange?.(0); // 可选重置模块选择
  };

  return (
    <>
      {currentProjectId ? (
        <ProCard ghost={true} bodyStyle={{ padding: 0, marginTop: 15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Title
              level={3}
              style={{
                marginLeft: 12,
                marginBottom: 20,
                marginRight: 8,
                cursor: 'pointer',
              }}
              onClick={handleClearProject} // 改为直接使用函数
            >
              <ProjectTwoTone style={{ marginRight: 10 }} />
              {projects.find((item) => item.id === currentProjectId)?.title}
            </Title>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleClearProject}
              style={{ color: '#ff4d4f' }}
            >
              选择项目
            </Button>
          </div>
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
            localStorage.setItem('selectedProjectId', String(value));
          }}
        />
      )}
    </>
  );
};

export default ProjectSelect;
