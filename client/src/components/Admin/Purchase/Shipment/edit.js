import React, { useState } from 'react';
import Detail from './detail';
import { Redirect, useLocation } from 'react-router-dom';

const Edit = (props) => {
  const loc = useLocation();
  const { shipment } = loc.state || {};
  const {
    supplier,
    location,
    remark,
    products,
  } = shipment || {};


  return shipment ? (
    <Detail
      componentType="edit"
      initialShipment={{
        supplier: supplier,
        location: location,
        remark: remark,
      }}
      initialCart={[]} //{ products }
      {...props}
    />
  ) : (
    <Redirect to="/admin/purchase/shipment" />
  );
};

export default Edit;
