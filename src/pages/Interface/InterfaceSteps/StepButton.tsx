import { FC } from 'react';
import { Button } from 'antd';

interface StepButtonsProps {
  current: number;
  stepsLength: number;
  onAddStep: () => void;
  onDelStep: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

const StepButtons: FC<StepButtonsProps> = ({
  current,
  stepsLength,
  onAddStep,
  onDelStep,
  onPrevStep,
  onNextStep,
}) => {
  return (
    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
      {current === stepsLength - 1 && (
        <>
          <Button
            type={'primary'}
            style={{ marginLeft: 8 }}
            onClick={onAddStep}
          >
            添加一步
          </Button>
        </>
      )}
      {current > 0 && (
        <Button type={'primary'} style={{ marginLeft: 8 }} onClick={onDelStep}>
          删除此步
        </Button>
      )}
      {current > 0 && (
        <Button onClick={onPrevStep} style={{ marginLeft: 8 }}>
          上一步
        </Button>
      )}
      {current < stepsLength - 1 && (
        <Button type="primary" onClick={onNextStep} style={{ marginLeft: 8 }}>
          下一步
        </Button>
      )}
    </div>
  );
};

export default StepButtons;
