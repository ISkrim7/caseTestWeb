import { Button, Empty, Typography } from 'antd';
const { Text } = Typography;
const EmptyProject = () => {
  return (
    <Empty style={{ marginTop: 50 }} description={<Text>还没有项目</Text>}>
      <Button
        type="primary"
        onClick={() => {
          window.open(`/project/List`);
        }}
      >
        去创建
      </Button>
    </Empty>
  );
};

export default EmptyProject;
