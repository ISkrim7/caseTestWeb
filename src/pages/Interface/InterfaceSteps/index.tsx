import MyDrawer from '@/components/MyDrawer';
import InterfaceStepEdit from '@/pages/Interface/InterfaceSteps/InterfaceStepEdit';
import StepButtons from '@/pages/Interface/InterfaceSteps/StepButton';
import TryResponse from '@/pages/Interface/InterResponse/TryResponse';
import Postman from '@/pages/Interface/Postman';
import { IInterface, ISteps, ITryResponse } from '@/pages/Interface/types';
import { ProCard } from '@ant-design/pro-components';
import { Button, Divider, FormInstance, Spin, Steps, Tooltip } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';

interface SelfProps {
  interfaceForm: FormInstance<IInterface>;
  stepsForm: React.MutableRefObject<FormInstance<ISteps>[]>;
  stepsInfo?: ISteps[];
  setSteps?: any;
  addInter?: boolean;
  currentProjectId: string;
  currentInterfaceId?: string;
}

const StepContent: FC<{
  content: any;
  visible: boolean;
}> = ({ content, visible }) => {
  return <div style={{ display: visible ? 'block' : 'none' }}>{content}</div>;
};

function truncateTitle(title: string): string {
  return title?.length > 5 ? title.slice(0, 5) + '...' : title;
}

const Index: FC<SelfProps> = (props) => {
  const { stepsForm, stepsInfo, setSteps: setStepsInfo } = props;
  const [openStepEdit, setOpenEdit] = useState(false);
  const [current, setCurrent] = useState(0);
  const [tryResponse, setTryResponse] = useState<ITryResponse[]>();
  const [load, setLoad] = useState<boolean>(false);

  const [steps, setSteps] = useState<
    {
      id: number;
      title: string;
      content: any;
    }[]
  >([]);

  const StepItems = useMemo(
    (): {
      key: number;
      title?: JSX.Element;
    }[] =>
      steps.map((item: any) => {
        const title = (
          <Tooltip title={item.title}>{truncateTitle(item.title)}</Tooltip>
        );
        const { id } = item;
        return { key: id, title };
      }),
    [steps, stepsInfo],
  );

  useEffect(() => {
    // 详情回显
    if (stepsInfo) {
      const new_steps = stepsInfo.map((stepInfo, index) => ({
        content: (
          <Postman
            {...props}
            step={stepInfo.step}
            setTryResponse={setTryResponse}
            setLoading={setLoad}
          />
        ),
        id: index,
        title: stepInfo.name,
      }));
      setSteps(new_steps);
    } else {
      //首次录入
      const defaultStep = {
        id: 0,
        title: '',
        content: (
          <Postman
            {...props}
            step={0}
            setTryResponse={setTryResponse}
            setLoading={setLoad}
          />
        ),
      };
      setSteps([defaultStep]);
    }
  }, [stepsInfo]);

  const handleStepChange = (nextCurrent: number, add?: boolean) => {
    if (add) {
      setCurrent(nextCurrent);
      const newStep = {
        content: (
          <Postman
            {...props}
            setLoading={setLoad}
            step={nextCurrent}
            setTryResponse={setTryResponse}
          />
        ),
        id: nextCurrent,
        title: '',
      };
      setSteps([...steps, newStep]);
    } else {
      const prev = nextCurrent - 1;
      setCurrent(prev);
      const newSteps = steps.filter((_: any, i: number) => i !== nextCurrent);
      setSteps(newSteps);
      if (stepsInfo) {
        stepsInfo.splice(nextCurrent, 1);
        stepsInfo.forEach((stepInfo, index) => {
          stepInfo.step = index;
        });
        setStepsInfo(stepsInfo);
      }
      if (stepsForm) {
        stepsForm.current.splice(nextCurrent, 1);
        stepsForm.current.forEach((stepForm, index) => {
          stepForm.setFieldsValue({ step: index });
        });
      }
    }
  };

  const handleAddStep = () => {
    handleStepChange(current + 1, true);
  };

  const handleDelStep = () => {
    handleStepChange(current, false);
  };

  const handlePrevStep = () => {
    setCurrent(current - 1);
  };

  const handleNextStep = () => {
    setCurrent(current + 1);
  };
  return (
    <ProCard
      split={'horizontal'}
      bodyStyle={{ padding: 0 }}
      style={{ height: '100%', marginTop: 10 }}
    >
      <MyDrawer
        name={'步骤修改'}
        width={'20%'}
        open={openStepEdit}
        setOpen={setOpenEdit}
      >
        <InterfaceStepEdit
          {...props}
          openStepEdit={openStepEdit}
          stepsForm={stepsForm}
          stepsInfo={stepsInfo}
        />
      </MyDrawer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Steps
          current={current}
          items={StepItems}
          onChange={(currentNumber) => {
            setCurrent(currentNumber);
          }}
        />
        <Divider type="vertical" />

        {!props.addInter && steps.length > 1 ? (
          <Button
            style={{ marginLeft: 'auto' }}
            type={'primary'}
            onClick={() => setOpenEdit(true)}
          >
            步骤修改
          </Button>
        ) : null}
      </div>

      <div style={{ marginTop: 8 }}>
        {steps.map((el, i) => (
          <StepContent
            key={el.id}
            content={el.content}
            visible={i === current}
          />
        ))}
      </div>
      <StepButtons
        current={current}
        stepsLength={steps.length}
        onAddStep={handleAddStep}
        onDelStep={handleDelStep}
        onPrevStep={handlePrevStep}
        onNextStep={handleNextStep}
      />
      <Spin tip={'努力加载中。。'} size={'large'} spinning={load}>
        {tryResponse ? <TryResponse responseInfos={tryResponse} /> : null}
      </Spin>
    </ProCard>
  );
};

export default Index;
