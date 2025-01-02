import React, { FC } from 'react';

interface IAddToCase {
  currentRecordId?: string;
  setCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddToCase: FC<IAddToCase> = ({ currentRecordId, setCloseModal }) => {
  return <div></div>;
};

export default AddToCase;
