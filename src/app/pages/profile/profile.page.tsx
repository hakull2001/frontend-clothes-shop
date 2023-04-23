import React, { useEffect, useState, useRef } from "react";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Box, Grid, Paper, Snackbar, Tooltip, Typography } from "@material-ui/core";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { useStyles } from "./make-style";
import { GlobalState } from "@app/store";
import UserService from "@app/services/http/user.service";
import useObservable from "@core/hooks/use-observable.hook";
import { User } from "@app/models/user.model";
import ProfileForm from "@app/components/profile-form";
import AppBar from "@app/components/app-bar";
import CustomBreadcrumbs from "@app/components/custom-breadcrumbs";
import OrderInfo from "../order-info";
import { DELIVERY_STATE, TYPE_ALERT } from "@app/shared/constants/common";
import OrderDetail from "../order-detail";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import axios from "axios";
import { Alert, AlertTitle } from "@mui/material";
import PaymentComponent from "@app/components/payment-component";
import PaymentUserService from "@app/services/http/payment.user.service";
import { useSnackbar } from "notistack";
const handleLinkActiving = ({ isActive }: { isActive: boolean }) => {
  return isActive
    ? {
        fontWeight: "bold",
        color: "red",
      }
    : {};
};

const TypographyPrimary: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = (props) => {
  return (
    <Typography noWrap color="textPrimary" {...props}>
      {props.children}
    </Typography>
  );
};

function Profile() {
  const classes = useStyles();
  const navigate = useNavigate();

  const { subscribeOnce } = useObservable();

  const location = useLocation();
  const { id: userId } = useSelector(selectAuth);
  const query = new URLSearchParams(location.search);

  const [title, setTitle] = useState("Thông tin tài khoản");
  const [state, setState] = useState(DELIVERY_STATE.WAITING_TO_CONFIRM);
  const [breadcrumbs, setBreadcrumbs] = useState({
    navigation: [{ title: "Trang chủ", linkTo: "/" }],
    textPrimary: "Thông tin tài khoản",
  });
  const [currentUser, setCurrentUser] = useState(new User(null));
  const [totalPayment, setTotalPayment] = useState(0);
  useEffect(() => {
    if (userId) {
      subscribeOnce(UserService.getUserById(userId), (data) => {
        setCurrentUser(data);
      });
      subscribeOnce(PaymentUserService.getTotalPayment(), (data) => {
          setTotalPayment(Number(data));
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  useEffect(() => {
    if (location.pathname === "/profile") {
      setTitle("Thông tin tài khoản");
      setBreadcrumbs({
        navigation: [{ title: "Trang chủ", linkTo: "/" }],
        textPrimary: "Thông tin tài khoản",
      });
    } else if (location.pathname === "/profile/order") {
      setState(query.get("state") ?? DELIVERY_STATE.WAITING_TO_CONFIRM);
      setTitle("Đơn hàng");
      setBreadcrumbs({
        navigation: [{ title: "Trang chủ    ", linkTo: "/" }],
        textPrimary: "Đơn hàng",
      });
    } else if (location.pathname === "/profile/recharge") {
      setTitle("Nạp tiền");
      setBreadcrumbs({
        navigation: [{ title: "Trang chủ", linkTo: "/" }],
        textPrimary: "Nạp tiền",
      });
    } else if (location.pathname.includes("/profile/order-detail/")) {
      setTitle("Chi tiết đơn hàng");

      setBreadcrumbs({
        navigation: [
          { title: "Trang chủ", linkTo: "/" },
          { title: "Đơn hàng", linkTo: `/profile/order?state=${state}` },
        ],
        textPrimary: "Chi tiết đơn hàng",
      });
    }

  }, [location]);
  const { enqueueSnackbar } = useSnackbar();


  const onUpdateSuccess = () => {
    if (userId) {
      subscribeOnce(UserService.getUserById(userId), (data) => {
        setCurrentUser(data);
      });
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [url, setUrl] = useState("");
  const amountRef =  useRef<HTMLInputElement>(null);
  const token = localStorage.getItem("app_access_token");
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const handlePayment = async ()=>{
      if(amount.length === 0)
        alert("Vui lòng nhập số tiền bạn muốn nạp");
      else if(Number(amount) < 100000)
        alert("Số tiền nạp tối thiểu là 100.000đ");
        else
      if (userId && token) {
        try {
          const response =  await axios.post(`http://localhost:8080/api/users/payment`, {"vnpAmount" : amount}, config);
          setUrl(response.data);
        } catch (error) {
          console.error(error);
        }
      }
   
  }

  const [amount, setAmount] = useState("");
  const onValueChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };
  const value = window.location.href.substring("http://localhost:3000/profile/recharge".length);
  
  
  useEffect(() => {

    if (value) {
      
      subscribeOnce(UserService.checkPayment(value), () => {
        setIsOpenPopup(false);
        enqueueSnackbar(`Bạn vừa nạp ${Number(amount).toLocaleString("vn")} đ`, {
          variant: TYPE_ALERT.SUCCESS,
        });
      });
    }

  }, [userId]);
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <AppBar />
      <Box paddingTop={2} className={classes.container}>
        {!!breadcrumbs.navigation.length && (
          <CustomBreadcrumbs
            navigation={breadcrumbs.navigation}
            textPrimary={breadcrumbs.textPrimary}
          />
        )}
        <Box paddingTop={2} style={{ display: "flex" }}>
          <Grid item xs={3} md={3} style={{ marginRight: "1em" }}>
            <Paper>
    
              <Box className={classes.menuLeft}>
           <Box style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
           <Avatar
            src={"https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/335927079_1254078845530328_7323165439294785281_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=95XwKXeFvMYAX_DkSG7&_nc_ht=scontent.fsgn2-4.fna&oh=00_AfBttsoB2xPquf_V9-BKAe2wvKsIVEQ7m55NspifngiHIg&oe=6449BF8C"}
            sx={{
              height: 100,
              mb: 2,
              width: 100
            }}
          />
                <Tooltip
                  title={
                    !!currentUser.id &&
                    currentUser?.firstName + " " + currentUser?.lastName
                  }
                  placement="top-start"
                  arrow
                  classes={{ tooltip: classes.customWidth }}
                >
                  <span>
                    <TypographyPrimary className={classes.typographyBolder}>
                      {!!currentUser.id &&
                        currentUser?.firstName + " " + currentUser?.lastName}
                    </TypographyPrimary>
                  </span>
                </Tooltip>
                <TypographyPrimary className={classes.typographyBolder}>
                  <p style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <p style={{marginRight:4}}>Số tiền đã nạp:{" "}</p>
                  <p style={{color:'green'}}>{totalPayment.toLocaleString("vn") + "đ"}</p></p>
                  <p style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:-40, marginBottom:-20}}>
                    <p style={{marginRight:4}}>Số dư:{" "}</p>
                  <p style={{color:'green'}}>{currentUser?.amount?.toLocaleString("vn") + "đ"}</p></p>
              
                </TypographyPrimary>
                <Box>
                  <ul style={{ listStyle: "none" }}>
                    <li className={classes.itemNavLink}>
                      <NavLink
                        className={classes.navLink}
                        to="/profile"
                        style={handleLinkActiving}
                        end
                      >
                        <i className={clsx("fa fa-edit", classes.menuIcon)}></i>{""}
                        Thông tin tài khoản
                      </NavLink>
                    </li>
                    <li className={classes.itemNavLink}>
                      <NavLink
                        className={classes.navLink}
                        to={`/profile/order?state=${DELIVERY_STATE.WAITING_TO_CONFIRM}`}
                        style={handleLinkActiving}
                      >
                        <i
                          className={clsx("fa fa-list-alt", classes.menuIcon)}
                        ></i>{"   "}
                        Đơn hàng
                      </NavLink>
                    </li>
                    <li className={classes.itemNavLink}>
                      <NavLink
                        className={classes.navLink}
                        to="/profile/recharge"
                        style={handleLinkActiving}
                      >
                        <i
                          className={clsx("fa fa-money-bill", classes.menuIcon)}
                        ></i>{""}
                        Nạp tiền
                      </NavLink>
                    </li>
                  </ul>
                </Box>
              </Box>
                         </Box>

            </Paper>
          </Grid>
          <Grid item xs={9} md={9}>
            <Routes>
              <Route
                path=""
                element={<ProfileForm onUpdateSuccess={onUpdateSuccess} />}
              />
              <Route
                path="order"
                element={
                  <Box style={{ padding: "1em 1em 1em 0" }}>
                    <Paper>
                      <Box style={{ padding: "0.5em" }}>
                        <OrderInfo />
                      </Box>
                    </Paper>
                  </Box>
                }
              />
              <Route
                path="order-detail/:saleOrderId"
                element={<OrderDetail />}
              />
              <Route
                path="recharge"
                element={
                <>  <Box style={{ padding: "1em 1em 1em 0" }}>
                    <Paper>
                      <Box style={{ padding: "0.5em" }}>
                    <Box style={{marginLeft: 24,
                    marginTop: 0}}>
                    <Button variant="outlined" onClick={handleClickOpen} style={{color:'#000000'}}>
                      Nạp tiền
                    </Button>
                    </Box>
                    <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>Nạp tiền</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Nội dung chuyển khoản: naptien + username VD: naptien levanha
                        </DialogContentText>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Số tiền muốn nạp (VNĐ)"
                          type="email"
                          fullWidth
                          onChange={onValueChange}
                          inputRef={amountRef}
                          variant="standard" />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button onClick={() => {
                          handlePayment();
                          if (url.length !== 0)
                            window.location.assign(url);
                          //   handlePayment(amount);
                          // if(url.length !== 0)
                          //   window.location.assign(url);
                          // handlePayment
                          // handleClose();
                        } }>Nạp tiền</Button>
                      </DialogActions>
                    </Dialog>
                    <Box style={{marginTop : -75}}>
                    <PaymentComponent onUpdateSuccess={onUpdateSuccess}></PaymentComponent>

                    </Box>
                      </Box>
                    </Paper>
                  </Box>
                    </>
                }
              >
              </Route>
            </Routes>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

const selectAuth = (state: GlobalState) => state.auth;

export default Profile;
