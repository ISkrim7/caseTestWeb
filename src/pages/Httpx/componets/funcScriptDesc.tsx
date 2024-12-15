import { queryScripts } from '@/api/inter';
import { ProCard, ProList } from '@ant-design/pro-components';
import { Tag, Typography } from 'antd';
import { useEffect, useState, type Key } from 'react';

const { Paragraph, Title } = Typography;

interface IFuncMap {
  title: string;
  args?: string[];
  returnContent?: string;
  subTitle: string;
  desc?: any;
  example?: string;
  url?: string;
}

const FuncScriptDesc = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [scriptsDesc, setScriptsDesc] = useState<IFuncMap[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    queryScripts().then(async ({ code, data }) => {
      console.log(data);
      if (code === 0) {
        setLoading(false);
        setScriptsDesc(data);
      }
    });
  }, []);

  return (
    <ProCard>
      <ProList<IFuncMap>
        loading={loading}
        bordered={false}
        rowKey="title"
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
        }}
        dataSource={scriptsDesc}
        metas={{
          title: {
            dataIndex: 'title',
            render: (_, row) => {
              return (
                <Title level={5}>
                  {row.title} <Tag color={'#2db7f5'}>{row.subTitle}</Tag>
                </Title>
              );
            },
          },
          description: {
            render: (_, row) => {
              return (
                <span>
                  <Paragraph> {`"""${row.desc}"""` || ''}</Paragraph>
                  <Paragraph code={true} copyable>
                    {row.example}
                  </Paragraph>
                  <Paragraph>
                    {row.args ? `:params : ${row.args}` : null}
                  </Paragraph>
                  <Paragraph> {row.returnContent || null}</Paragraph>
                </span>
              );
            },
          },
        }}
      />
    </ProCard>
  );
};

export default FuncScriptDesc;
