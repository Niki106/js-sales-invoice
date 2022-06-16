import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Swal from "sweetalert2";

import DataGrid from "components/Common/DataGrid";

const columns = [
  {
    id: "client",
    label: "Client Name",
  },
  {
    id: "orderDate",
    label: "Order Date",
  },
  {
    id: "arrivalDate",
    label: "Arrival Date",
  },
  {
    id: "unitPrice",
    label: "Price",
  },
  {
    id: "qty",
    label: "QTY",
  },
];

const rows = [
  {
    client: "wang",
    orderDate: "2022-04-22",
    arrivalDate: "2022-04-22",
    unitPrice: "100",
    qty: "14",
  },
  {
    client: "wang",
    orderDate: "2022-04-22",
    arrivalDate: "2022-04-22",
    unitPrice: "100",
    qty: "14",
  },
  {
    client: "wang",
    orderDate: "2022-04-22",
    arrivalDate: "2022-04-22",
    unitPrice: "100",
    qty: "14",
  },
  {
    client: "wang",
    orderDate: "2022-04-22",
    arrivalDate: "2022-04-22",
    unitPrice: "100",
    qty: "14",
  },
  {
    client: "wang",
    orderDate: "2022-04-22",
    arrivalDate: "2022-04-22",
    unitPrice: "100",
    qty: "14",
  },
  {
    client: "wang",
    orderDate: "2022-04-22",
    arrivalDate: "2022-04-22",
    unitPrice: "100",
    qty: "14",
  },
  {
    client: "wang",
    orderDate: "2022-04-22",
    arrivalDate: "2022-04-22",
    unitPrice: "100",
    qty: "14",
  },
  {
    client: "wang",
    orderDate: "2022-04-22",
    arrivalDate: "2022-04-22",
    unitPrice: "100",
    qty: "14",
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Shipment = connect(mapStateToProps)((props) => {
  const theme = useTheme();

  const { isOpen, onClose, stockId } = props;

  // const [shipmentFormOpen, setShipmentFormOpen] = useState(false);
  const [shipmentClient, setShipmentClient] = useState("");
  const [shipmentOrderDate, setShipmentOrderDate] = useState("");
  const [shipmentArrivalDate, setShipmentArrivalDate] = useState("");
  const [shipmentUnitPrice, setShipmentUnitPrice] = useState(0);
  const [shipmentQty, setShipmentQty] = useState(0);

  const shipmentFormProps = [
    {
      name: "clientName",
      label: "Client's Name",
      multiline: false,
      type: "text",
      value: shipmentClient,
      onChange: (e) => {
        e.preventDefault();
        setShipmentClient(e.target.value);
      },
      width: "100%",
    },
    {
      name: "shipmentOrderDate",
      label: "Order Date",
      type: "date",
      value: shipmentOrderDate,
      onChange: (e) => {
        e.preventDefault();
        setShipmentOrderDate(e.target.value);
      },
      width: "48%",
    },
    {
      name: "shipmentArrivalDate",
      label: "Arrival Date",
      type: "date",
      value: shipmentArrivalDate,
      onChange: (e) => {
        e.preventDefault();
        setShipmentArrivalDate(e.target.value);
      },
      width: "48%",
    },
  ];

  const handleShipmentCreate = async (event) => {
    event.preventDefault();

    const payload = {
      client: shipmentClient,
      orderDate: shipmentOrderDate,
      arrivalDate: shipmentArrivalDate,
      unitPrice: shipmentUnitPrice,
      qty: shipmentQty,
      stockId,
    };
    axios
      .post(`/chairStock/shipment/create`, payload)
      .then((response) => {
        // getStocks();
        console.log(response);
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {});
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  return (
    <Dialog
      fullWidth
      fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}
      maxWidth="sm"
      open={isOpen}
      PaperProps={{
        component: "form",
        onSubmit: handleShipmentCreate,
      }}
    >
      <DialogTitle>Shipment</DialogTitle>
      <DialogContent>
        <Paper
          sx={{
            px: "10px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            maxHeight: "250px",
            overflow: "auto",
          }}
        >
          <DataGrid
            title="Shipment logs"
            columns={columns}
            rows={rows}
            nonSelect={true}
          />
        </Paper>
        <Paper
          sx={{
            mt: "5px",
            p: "10px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 18, color: "black", paddingLeft: 10 }}>
            Create shipment
          </span>
          {shipmentFormProps.map(({ type, width, ...restParams }, index) => {
            if (type === "text") {
              return (
                <TextField
                  key={index}
                  sx={{ flexBasis: width, minWidth: width }}
                  {...restParams}
                />
              );
            } else if (type === "date") {
              return (
                <TextField
                  key={index}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ flexBasis: width, minWidth: width }}
                  {...restParams}
                />
              );
            } else return null;
          })}
          <FormControlLabel
            sx={{
              flexBasis: ["100%", "48%"],
              minWidth: ["100%", "48%"],
              alignItems: "baseline",
              m: 0,
            }}
            control={
              <TextField
                label="Unit Price"
                type="number"
                name="shipmentUnitPrice"
                value={shipmentUnitPrice}
                onChange={(e) => setShipmentUnitPrice(e.target.value)}
                fullWidth
                sx={{ m: "10px 5px 0 0" }}
              />
            }
            label="HKD"
          />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ flexBasis: ["100%", "48%"], minWidth: ["100%", "48%"] }}
          >
            <IconButton
              onClick={() => {
                setShipmentQty(Math.max(shipmentQty - 1, 0));
              }}
            >
              <RemoveIcon />
            </IconButton>
            <TextField
              label="Qty"
              value={shipmentQty}
              type="number"
              sx={{ width: "120px", mx: "5px" }}
              onChange={(e) => {
                setShipmentQty(Math.max(e.target.value, 0));
              }}
            />
            <IconButton
              onClick={() => {
                setShipmentQty(shipmentQty + 1);
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Create</Button>
      </DialogActions>
    </Dialog>
  );
});

export default Shipment;
