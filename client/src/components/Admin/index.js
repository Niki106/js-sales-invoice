import React, { useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Box } from "@mui/material";
import {
  BookOnline as BookOnlineIcon,
  DeliveryDining as DeliveryDiningIcon,
  PeopleAlt as PeopleAltIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";

import AppHeader from "components/Common/AppHeader";
import { CollapsedSidebar, FixedSidebar } from "components/Common/Sidebar";
import { logout } from "services/auth.service";
import User from "./User";
import { ChairStock } from "./Chair";
import { DeskStock } from "./Desk";
import { AccessoryStock } from "./Accessory";
import {
  SalesOrderCreate,
  SalesOrderEdit,
  SalesOrderView,
} from "./Salement/SalesOrder";
import {
  QuotationCreate,
  QuotationEdit,
  QuotationView,
} from "./Salement/Quotation";
import { ChairDelivery, DeskDelivery, AccessoryDelivery } from "./Delivery";
import {
  POCreate,
  PurchaseOrder,
} from "./Purchase/Order";
import {
  ShipmentCreate,
  Shipment,
} from "./Purchase/Shipment";

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const drawerWidth = 240;
const drawerHeight = 50;

const menuLists = [
  {
    category: "Chair",
    content: [
      { to: "/admin/chair/stock", icon: <StorefrontIcon />, label: "Stock" },
    ],
  },
  {
    category: "Desk",
    content: [
      { to: "/admin/desk/stock", icon: <StorefrontIcon />, label: "Stock" },
    ],
  },
  {
    category: "Accessory",
    content: [
      {
        to: "/admin/accessory/stock",
        icon: <StorefrontIcon />,
        label: "Stock",
      },
    ],
  },
  {
    category: "Sales",
    content: [
      { to: "/admin/order", icon: <BookOnlineIcon />, label: "Order" },
      { to: "/admin/quotation", icon: <BookOnlineIcon />, label: "Quotation" },
    ],
  },
  {
    category: "Purchase",
    content: [
      { to: "/admin/purchase/order", icon: <BookOnlineIcon />, label: "Order" },
      { to: "/admin/purchase/shipment", icon: <BookOnlineIcon />, label: "Shipment" },
    ],
  },
  {
    category: "Delivery",
    content: [
      {
        to: "/admin/delivery/chair",
        icon: <DeliveryDiningIcon />,
        label: "Chair",
      },
      {
        to: "/admin/delivery/desk",
        icon: <DeliveryDiningIcon />,
        label: "Desk",
      },
      {
        to: "/admin/delivery/accessory",
        icon: <DeliveryDiningIcon />,
        label: "Accessory",
      },
    ],
  },
  {
    category: "User",
    content: [{ to: "/admin/user", icon: <PeopleAltIcon />, label: "Users" }],
  },
];

const Admin = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { path } = useRouteMatch();

  const handleDrawerOpen = (e) => {
    e.preventDefault();
    setMobileOpen(true);
  };

  const handleDrawerClose = (e) => {
    e.preventDefault();
    setMobileOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Log out will remove your session information permanently.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "No, Keep Login",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        props.logout();
      }
    });
    // props.logout();
  };

  return (
    <>
      <AppHeader
        drawerHeight = {drawerHeight}
        handleDrawerToggle = {handleDrawerOpen}
        title = "Administrator"
      />
      <Box
        flexBasis = {`calc(100% - ${drawerHeight}px)`}
        maxHeight = {`calc(100% - ${drawerHeight}px)`}
        position = "relative"
        display = "flex"
        backgroundColor = "#f4f5f7"
      >
        <CollapsedSidebar
          mobileOpen = {mobileOpen}
          handleDrawerClose = {handleDrawerClose}
          drawerWidth = {drawerWidth}
          handleLogout = {handleLogout}
          lists = {menuLists}
        />
        <FixedSidebar
          drawerWidth = {drawerWidth}
          handleLogout = {handleLogout}
          lists = {menuLists}
        />
        <Box
          component = "main"
          sx = {{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            maxWidth: "100%",
          }}
        >
          <Switch>
            <Route path={`${path}/user`} component={User} />
            <Route path={`${path}/chair/stock`} exact component={ChairStock} />
            <Route path={`${path}/desk/stock`} exact component={DeskStock} />
            <Route
              path={`${path}/accessory/stock`}
              exact
              component={AccessoryStock}
            />
            <Route path={`${path}/order`} exact component={SalesOrderView} />
            <Route
              path={`${path}/order/create`}
              exact
              component={SalesOrderCreate}
            />
            <Route
              path={`${path}/order/edit`}
              exact
              component={SalesOrderEdit}
            />
            <Route
              path={`${path}/shipment/create`}
              exact
              component={ShipmentCreate}
            />
            {/* <Route
              path={`${path}/shipment/edit`}
              exact
              component={ShipmentEdit}
            /> */}
            <Route path={`${path}/quotation`} exact component={QuotationView} />
            <Route
              path={`${path}/quotation/create`}
              exact
              component={QuotationCreate}
            />
            <Route
              path={`${path}/quotation/edit`}
              exact
              component={QuotationEdit}
            />
            <Route
              path={`${path}/delivery/chair`}
              exact
              component={ChairDelivery}
            />
            <Route
              path={`${path}/delivery/desk`}
              exact
              component={DeskDelivery}
            />
            <Route
              path={`${path}/purchase/order`}
              exact
              component={ PurchaseOrder }
            />
            <Route
              path={`${path}/purchase/order/create`}
              exact
              component={ POCreate }
            />
            <Route
              path={`${path}/purchase/shipment`}
              exact
              component={ Shipment }
            />
            <Route
              path={`${path}/purchase/shipment/create`}
              exact
              component={ ShipmentCreate }
            />
          </Switch>
        </Box>
      </Box>
    </>
  );
};

export default connect(mapStateToProps, { logout })(Admin);
