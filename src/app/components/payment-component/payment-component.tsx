import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Visibility as VisibilityIcon,
  Create as CreateIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@material-ui/icons";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { CreateUserDto, UpdateUserDto, User } from "@app/models/user.model";
import UserService from "@app/services/http/user.service";
import useObservable from "@core/hooks/use-observable.hook";
import { useStyles } from "./make-style";
import ConfirmDialog from "@app/components/confirm-dialog";
import { PaginationOption } from "@core/services/http/http.service";
import {
  DEFAULT_PAGINATION_OPTION,
  TYPE_ALERT,
} from "@app/shared/constants/common";
import { GlobalState } from "@app/store";
import useForceUpdate from "@core/hooks/use-force-update.hook";
import PopupDialog from "@app/components/popup-dialog";
import UserForm from "@app/components/user-form";
import { PaymentUser } from "@app/models/payment.user.model";
import PaymentUserService from "@app/services/http/payment.user.service";


type PropTypes = {
    onUpdateSuccess: () => void;
  };
  
  function PaymentComponent(props: PropTypes) {
    const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const { id: userId } = useSelector(selectAuth);

  const [forceUpdate, setForceUpdate] = useForceUpdate();
  const { subscribeOnce, subscribeUntilDestroy } = useObservable();

  const typingTimeoutRef = useRef<any>(null);

  const [total, setTotal] = useState(0);
  const [paymentUsers, setPaymentUsers] = useState<PaymentUser[]>([]);
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [recordForAction, setRecordForAction] = useState<any>(new User(null));
  const [pagination, setPagination] = useState(() => {
    const options: PaginationOption = {
      ...DEFAULT_PAGINATION_OPTION,
    };
    return options;
  });

  useEffect(() => {
    subscribeUntilDestroy(PaymentUserService.getList(pagination), (response) => {
        setPaymentUsers(response.data as PaymentUser[]);
      setTotal(response.pagination?.total || 0);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, forceUpdate]);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    const newPagination: PaginationOption = {
      ...pagination,
      page: newPage + 1,
    };
    setPagination(newPagination);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newPagination: PaginationOption = {
      ...pagination,
      page: 1,
      perPage: +event.target.value,
    };
    setPagination(newPagination);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchState(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      const newPaginationOption: PaginationOption = {
        ...pagination,
        like: {
          username: value,
        },
      };
      setPagination(newPaginationOption);
    }, 500);
  };

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Typography variant="h4" className={classes.screenName}>
        Vấn tin tài khoản
      </Typography>
      <Box style={{ display: "flex" }}>
      </Box>
      <Paper style={{ marginTop: 10}}>
        <TableContainer style={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Số tiền</TableCell>
                <TableCell>Ngân hàng</TableCell>
                <TableCell>Nội dung chuyển</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Mã Bill</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!!paymentUsers.length &&
                paymentUsers.map((item, index) => (
                  
                  <TableRow hover key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{Number(item.vnpAmount).toLocaleString("vn")}</TableCell>
                    <TableCell>{item.vnpBankCode}</TableCell>
                    <TableCell>{item.vnpOrderInfo}</TableCell>
                    <TableCell>{item.vnpPayDate}</TableCell>
                    <TableCell>{item.vnpTxnref}</TableCell>
                    <TableCell style={{color:item.paymentStatus==1 ? 'green' : 'red'}}>{item.paymentStatus == 1 ? "Thành công" : "Chờ thanh toán"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={pagination.page - 1}
          rowsPerPage={pagination.perPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
    </Container>
  );
  }
  
  const selectAuth = (state: GlobalState) => state.auth;
  
  export default PaymentComponent;