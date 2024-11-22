import { useParams } from '@@/exports';
import { ProCard } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

const Index = () => {
  const { uid } = useParams<{
    uid: string;
  }>();
  const [currentUid, setCurrentUid] = useState<string>();
  const iframeRef = React.createRef();
  useEffect(() => {
    if (uid) {
      console.log(uid);
      setCurrentUid(uid);
    }
  }, [uid]);

  return (
    <ProCard style={{ height: '100vh' }}>
      {currentUid ? (
        <iframe
          src={`/api/jacoco/report/detail/root/${currentUid}`}
          width="100%"
          height="100%"
          allowFullScreen
        />
      ) : (
        'not found'
      )}
    </ProCard>
  );
};

export default Index;
