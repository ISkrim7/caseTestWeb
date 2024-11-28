import { Card } from '@/pages/DebuggerPage/Drag/Card';
import { ProCard } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Index = () => {
  const [data, setData] = useState<any[]>([]);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setData((prevData) => {
      const newData = prevData.map((item) => ({ ...item }));

      const [draggedCard] = newData.splice(dragIndex, 1);
      newData.splice(hoverIndex, 0, draggedCard);
      return newData;
    });
  }, []);

  const renderData = useCallback((data: any, index: number) => {
    return (
      <Card
        text={data.text}
        title={data.title}
        index={index}
        moveCard={moveItem}
      />
    );
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <ProCard
        extra={
          <>
            <Button
              onClick={() => {
                console.log(data);
              }}
            >
              GET
            </Button>
            <Button
              onClick={() => {
                const data = {
                  title: 'new',
                  text: Date.now(),
                };
                setData((prev) => [...prev, data]);
              }}
            >
              new
            </Button>{' '}
          </>
        }
      >
        {data.map((card, i) => renderData(card, i))}
      </ProCard>
    </DndProvider>
  );
};

export default Index;
