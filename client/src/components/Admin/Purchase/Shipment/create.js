import React, { useState } from 'react';
import Detail from './detail';

const Create = (props) => {
  const poNum = 123
  return (
    <Detail
      componentType="create"
      initialShipment={{
        supplier: '',
        location: '',
        remark: '',
      }}
      initialCart={[]}
      {...props}
    />
  );
};

export default Create;
