// import { queryRootPartsByProjectId } from '@/api/aps';
import { Menu } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface SelfProps {
  currentProjectId?: number;
  setCurrentCasePartId: React.Dispatch<React.SetStateAction<number>>;
}

const Index: FC<SelfProps> = ({ currentProjectId, setCurrentCasePartId }) => {
  const [rootPartArr, setRootPartArr] = useState<any[]>([]);

  useEffect(() => {
    if (currentProjectId) {
      // queryRootPartsByProjectId({ projectId: currentProjectId }).then(
      //   async ({ code, data }) => {
      //     if (code === 0 || data) {
      //       const partArr = data.map((items) => {
      //         return {
      //           key: items.id,
      //           label: (
      //             <a onClick={() => setCurrentCasePartId(items.id as number)}>
      //               {items.title}
      //             </a>
      //           ),
      //         };
      //       });
      //       setRootPartArr(partArr);
      //     }
      //   },
      // );
    }
  }, [currentProjectId]);

  return (
    <>
      <Menu
        style={{ marginTop: 20, width: 300 }}
        mode={'vertical'}
        items={rootPartArr}
      />
    </>
  );
};

export default Index;
