import type { FC } from 'react';
import { useCallback, useState } from 'react';

import { ProCard } from '@ant-design/pro-components';
import { Card } from './Card';

const style = {
  width: 400,
};

export interface Item {
  id: number;
  text: string;
}

export interface ContainerState {
  cards: Item[];
}

export const Container: FC = () => {
  {
    const [cards, setCards] = useState([
      {
        id: 1,
        text: 'Write a cool JS library',
      },
      {
        id: 2,
        text: 'Make it generic enough',
      },
      {
        id: 3,
        text: 'Write README',
      },
      {
        id: 4,
        text: 'Create some examples',
      },
      {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
      },
      {
        id: 6,
        text: '???',
      },
      {
        id: 7,
        text: 'PROFIT',
      },
    ]);

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
      setCards((prevCards: Item[]) => {
        // 复制数组，确保我们不会修改原始数组
        const updatedCards = prevCards.map((card) => ({ ...card }));

        // 删除拖动的卡片
        const [draggedCard] = updatedCards.splice(dragIndex, 1);

        // 插入拖动的卡片到目标位置
        updatedCards.splice(hoverIndex, 0, draggedCard);

        // 返回更新后的数组
        return updatedCards;
      });
    }, []);

    const renderCard = useCallback(
      (card: { id: number; text: string }, index: number) => {
        return (
          <Card
            key={card.id}
            index={index}
            id={card.id}
            text={card.text}
            moveCard={moveCard}
          />
        );
      },
      [],
    );

    return (
      <>
        <ProCard style={style}>
          {cards.map((card, i) => renderCard(card, i))}
        </ProCard>
      </>
    );
  }
};
