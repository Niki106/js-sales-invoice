import React, { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import { connect } from "react-redux";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import MuiPhoneNumber from "material-ui-phone-number";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Swal from "sweetalert2";

import DataGrid from "components/Common/DataGrid";
import {
  ProductList,
  ProductListItem,
  ProductListItemText,
  ProductPriceAmount,
} from "../ProductList";

const columns = [
  {
    id: "ponumber",
    label: "Po Number",
    sx: { paddingLeft: 10 },
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
    id: "showItem",
    nonSort: true,
    label: "Show",
    sx: { maxWidth: 100, width: 100, paddingLeft: 0 },
  },
  {
    id: "edit",
    nonSort: true,
    label: "Edit",
    sx: { maxWidth: 100, width: 100 },
  },
  {
    nonSort: true,
    id: "delete",
    label: "Delete",
    sx: { maxWidth: 100, width: 100 },
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)((props) => {
  const theme = useTheme();

  const [shipments, setShipments] = useState([]);
  const [initShipments, setInitShipments] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const whatsAppMessage = useRef(null);
  const emailContent = useRef(null);
  const [filterAnchor, setFilterAnchor] = useState(null);

  const [orderIndex, setOrderIndex] = useState(0);

  const [paymentLink, setPaymentLink] = useState("");

  const [selectedHideColumns, setSelectedHideColumns] = useState([]);

  const [searchPONumber, setSearchPONumber] = useState("");
  const [searchClient, setSearchClient] = useState("");

  const chairDeliveries = useRef([]);
  const deskDeliveries = useRef([]);
  const accessoryDeliveries = useRef([]);

  const handleFilterClick = (e) => {
    e.preventDefault();
    if (filterAnchor === null) setFilterAnchor(e.currentTarget);
    else setFilterAnchor(null);
  };

  const handleWhatsAppSend = (event) => {
    event.preventDefault();
    axios
      .post("whatsapp/send", {
        phone: phone,
        message: whatsAppMessage.current.value,
      })
      .then(() => {
        setWhatsAppOpen(false);
      })
      .catch(function (error) {
        // handle error
        setWhatsAppOpen(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setWhatsAppOpen(true);
        });
      })
      .then(function () {
        // always executed
      });
  };

  const handleEmailSend = (event) => {
    event.preventDefault();
    axios
      .post("email/send", {
        email: email,
        message: emailContent.current.value,
        link: paymentLink,
      })
      .then(() => {
        setEmailOpen(false);
      })
      .catch(function (error) {
        // handle error
        setEmailOpen(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setEmailOpen(true);
        });
      })
      .then(function () {
        // always executed
      });
  };

  const handleRemoveClick = (index) => {
    if (index < shipments.length && index >= 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "This action will remove current Shipment permanently.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Remove!",
        cancelButtonText: "No, Keep It.",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/salesOrder/${shipments[index].id}`)
            .then((response) => {
              // handle success
              getShipments();
            })
            .catch(function (error) {
              // handle error
              Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response.data.message,
                allowOutsideClick: false,
              });
              console.log(error);
            })
            .then(function () {
              // always executed
            });
        }
      });
    }
  };

  const getShipments = (cancelToken) => {
    axios
      .get("/shipment", { cancelToken })
      .then((response) => {
        // handle success
        console.log(response.data);
        setShipments(response.data);
        setInitShipments(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const onKeyPressed = (e) => {
    // if (e.key === "Enter") {
    //   const searchedOrders = initOrders
    //     .filter((order) =>
    //       order.invoiceNum
    //         .toLowerCase()
    //         .includes(searchInvoiceNumber.toLowerCase())
    //     )
    //     .filter((order) => order.phone.includes(searchPhoneNumber));
    //   setOrders(searchedOrders);
    // }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getShipments(source.token);
    return () => source.cancel("Brand Component got unmounted");
  }, []);

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        padding: "10px 20px",
      }}
    >
      <Button
        component={RouterLink}
        to="/admin/shipment/create"
        startIcon={<AddIcon />}
      >
        New Shipment
      </Button>
      <Paper
        sx={{
          marginTop: "10px",
          padding: "5px 10px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <TextField
          label="PO Number"
          variant="outlined"
          onKeyPress={onKeyPressed}
          value={searchPONumber}
          onChange={(e) => setSearchPONumber(e.target.value)}
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          onKeyPress={onKeyPressed}
          value={searchClient}
          onChange={(e) => setSearchClient(e.target.value)}
        />
      </Paper>
      <DataGrid
        title="Shipments"
        rows={shipments.map(
          ({ id, orderDate, arrivalDate, ...restProps }, index) => ({
            id,
            index,
            showItem: (
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                <VisibilityIcon />
              </IconButton>
            ),
            edit: (
              <IconButton
                component={RouterLink}
                to={{
                  pathname: "/admin/shipment/edit",
                  state: { order: shipments[index] },
                }}
              >
                <EditIcon />
              </IconButton>
            ),
            delete: (
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  handleRemoveClick(index);
                }}
              >
                <DeleteIcon />
              </IconButton>
            ),
            ...restProps,
          })
        )}
        columns={columns}
        onRemoveClick={handleRemoveClick}
        onFilterClick={handleFilterClick}
      />
    </Box>
  );
});
