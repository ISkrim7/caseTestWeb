import { IProject } from '@/api';
import { pageProject, putProject, queryProject } from '@/api/base';
import { pageData } from '@/utils/somefunc';
import { ProjectTwoTone } from '@ant-design/icons';
import { ActionType, ProCard } from '@ant-design/pro-components';
import { Col, Row, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import NewProject from 'src/pages/Project/NewProject';
import { useAccess } from 'umi';

const { Text, Paragraph } = Typography;

const ProjectList: React.FC = () => {
  const { isAdmin } = useAccess();
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [projects, setProjects] = useState<IProject[]>([]);
  const [status, setStatus] = useState<number>(0);
  useEffect(() => {
    queryProject().then(async ({ code, data }) => {
      if (code === 0) {
        setProjects(data);
      }
    });
  }, [status]);

  const isReload = (value: boolean) => {
    if (value) {
      setStatus(status + 1);
    }
  };

  const fetchPageProjects = async (params: any, sort: any) => {
    const searchInfo: any = {
      ...params,
      sort: sort,
    };
    const { code, data } = await pageProject(searchInfo);
    return pageData(code, data);
  };

  const OnSave = async (_: any, record: IProject) => {
    return await putProject(record);
  };

  return (
    <ProCard
      gutter={[16, 16]}
      title={'全部项目'}
      headerBordered={true}
      extra={<NewProject reload={isReload} />}
      style={{ marginBlockStart: 16, height: '100vh' }}
    >
      <Row gutter={[20, 20]}>
        {projects.map((item, index) => {
          return (
            <Col span={8} key={index}>
              <ProCard
                bordered={true}
                hoverable={true}
                type="inner"
                headerBordered={true}
                style={{ marginBlockStart: 16, borderRadius: 16 }}
                title={
                  <>
                    {' '}
                    <ProjectTwoTone />
                    <span style={{ marginLeft: 8 }}>{item.title} </span>
                  </>
                }
              >
                <Paragraph>{item.desc}</Paragraph>
              </ProCard>
            </Col>
          );
        })}
      </Row>
      {/*<MyProTable*/}
      {/*  headerTitle={'项目'}*/}
      {/*  actionRef={actionRef}*/}
      {/*  columns={columns}*/}
      {/*  request={fetchPageProjects}*/}
      {/*  rowKey={'uid'}*/}
      {/*  onSave={OnSave}*/}
      {/*  toolBarRender={() => [<NewProject reload={isReload} />]}*/}
      {/*/>*/}
    </ProCard>
  );
};

export default ProjectList;
