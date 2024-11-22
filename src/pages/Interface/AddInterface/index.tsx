import React, { FC, useRef, useState } from 'react';
import { Button, Form, FormInstance, message } from 'antd';
import { IInterface, ISteps } from '@/pages/Interface/types';
import MyDrawer from '@/components/MyDrawer';
import InterfaceEditor from '@/pages/Interface/InterfaceEditor';
import { addApiCase } from '@/api/interface';

interface SelfProps {
  currentProject: number;
  currentCasePart: number;
  actionRef: any;
}

const Index: FC<SelfProps> = (props) => {
  const { currentProject, actionRef, currentCasePart } = props;
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [interfaceForm] = Form.useForm<IInterface>();
  const stepsFormList = useRef<FormInstance<ISteps>[]>([]);
  const [steps, setSteps] = useState<ISteps[]>();

  const onSubmit = async () => {
    const info = interfaceForm.getFieldsValue();

    const addInfo: IInterface = {
      ...info,
      steps: stepsFormList.current.map((stepForm) => {
        // stepForm.validateFields().catch((err) => {
        //     err.errorFields.map((item: any) => {
        //         const errorStep = err.values.step + 1;
        //         message.error(`步骤${errorStep}:` + item.errors[0]);
        //         return Promise.resolve();
        //     });
        // })
        return stepForm.getFieldsValue(true);
      }),
    };
    addInfo.casePartID = currentCasePart;
    addInfo.projectID = currentProject;
    console.log('add api', info);
    const { code, msg } = await addApiCase(addInfo);
    if (code === 0) {
      message.success(msg);
      setOpenDrawer(false);
      actionRef.current?.reload();
    }
  };

  return (
    <>
      <MyDrawer
        name={'添加API用例'}
        open={openDrawer}
        width={'80%'}
        setOpen={() => setOpenDrawer(false)}
        extra={
          <Button onClick={onSubmit} type={'primary'}>
            SAVE
          </Button>
        }
      >
        <InterfaceEditor
          interfaceForm={interfaceForm}
          stepsForm={stepsFormList}
          stepsInfo={steps}
          setSteps={setSteps}
          addInter={true}
          currentProjectId={String(currentProject)}
        />
      </MyDrawer>
      <Button type="primary" onClick={() => setOpenDrawer(true)}>
        添加用例
      </Button>
    </>
  );
};

export default Index;
