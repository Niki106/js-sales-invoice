import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
    Box,
    Button,
    TextField,
    Paper,
    IconButton
} from "@mui/material";
import DataGrid from "components/Common/DataGrid";
import { Link as RouterLink } from "react-router-dom";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";


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
    // {
    //     id: "showItem",
    //     nonSort: true,
    //     label: "Show",
    //     sx: { maxWidth: 100, width: 100, paddingLeft: 0 },
    // },
    // {
    //     id: "edit",
    //     nonSort: true,
    //     label: "Edit",
    //     sx: { maxWidth: 100, width: 100 },
    // },
    // {
    //     nonSort: true,
    //     id: "delete",
    //     label: "Delete",
    //     sx: { maxWidth: 100, width: 100 },
    // },
];


function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

export default connect(mapStateToProps)((props) => {
    const { type } = props;
    const [searchPONumber, setSearchPONumber] = useState("");
    const [shipments, setShipments] = useState([]);
    const [initShipments, setInitShipments] = useState([]);

    useEffect(() => {
        // const source = axios.CancelToken.source();
        // getShipments(source.token);
        getShipments("");
        // return () => source.cancel("Brand Component got unmounted");
    }, []);

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
                        .delete(`/shipment/${shipments[index].id}`)
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
                        });
                }
            });
        }
    };

    const onKeyPressed = (e) => {
        if (e.key === "Enter") {
            const searchedShipments = initShipments.filter((shipment) =>
                shipment.ponumber.toLowerCase().includes(searchPONumber.toLowerCase())
            );
            // .filter((order) => order.phone.includes(searchPhoneNumber));
            setShipments(searchedShipments);
        }
    };

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
                to={`/admin/po/${type}/create`}
                startIcon={<AddIcon />}
            >
                New Purchase Order
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
            </Paper>
            <DataGrid
                title="Shipments"
                rows={shipments.map(({ id, arrivalDate, ...restProps }, index) => ({
                    id,
                    index,
                    showItem: (
                        <IconButton
                            onClick={(event) => {
                                event.preventDefault();
                                // setShipmentIndex(index);
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    ),
                    edit:
                        arrivalDate.split("-")[0] === "0000" ? (
                            <IconButton
                                onClick={(event) => {
                                    event.preventDefault();
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        ) : (
                            ""
                        ),
                    delete:
                        arrivalDate.split("-")[0] === "0000" ? (
                            <IconButton
                                onClick={(event) => {
                                    event.preventDefault();
                                    handleRemoveClick(index);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        ) : (
                            ""
                        ),
                    arrivalDate: arrivalDate.split("-")[0] === "0000" ? "" : arrivalDate,
                    ...restProps,
                }))}
                columns={columns}
                onRemoveClick={handleRemoveClick}
            />
        </Box>
    );
});