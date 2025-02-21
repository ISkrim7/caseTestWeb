import { caseAPIResultsByCase } from '@/api/inter/interCase';
import InterfaceApiResponseDetail from '@/pages/Httpx/InterfaceApiResponse/InterfaceApiResponseDetail';
import { IInterfaceResultByCase } from '@/pages/Httpx/types';
import { ProCard } from '@ant-design/pro-components';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  caseResultId?: string;
}

const InterfaceApiResultResponses: FC<SelfProps> = ({ caseResultId }) => {
  const [apiResponses, setApiResponses] = useState<IInterfaceResultByCase[]>();
  useEffect(() => {
    if (caseResultId) {
      caseAPIResultsByCase({ caseResultId: caseResultId }).then(
        ({ code, data }) => {
          if (code === 0) {
            console.log(data);
            setApiResponses(data);
          }
        },
      );
    }
    return () => {
      setApiResponses([]);
    };
  }, [caseResultId]);
  return (
    <ProCard loading={apiResponses?.length === 0}>
      {apiResponses && <InterfaceApiResponseDetail responses={apiResponses} />}
    </ProCard>
  );
};

export default InterfaceApiResultResponses;
