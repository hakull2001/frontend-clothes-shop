import {
  Box,
  Card,
  Container,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { H5, Small } from "../../typography/typography";
import { FC, useEffect, useRef, useState } from "react";
import ScrollBar from "simplebar-react";
import { PaginationOption } from "@core/services/http/http.service";
import PaymentUserService from "@app/services/http/payment.user.service";
import { PaymentUser } from "@app/models/payment.user.model";
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT, DEFAULT_PAGINATION_OPTION } from "@app/shared/constants/common";
import { User } from "@app/models/user.model";
import useObservable from "@core/hooks/use-observable.hook";
import { useSnackbar } from "notistack";
import { useStyles } from "../make-style";
import { useSelector } from "react-redux";
import { GlobalState } from "@app/store";
import useForceUpdate from "@core/hooks/use-force-update.hook";
import dayjs from "dayjs";

const commonCSS = {
  minWidth: 120,
  "&:nth-of-type(2)": { minWidth: 170 },
  "&:nth-of-type(3)": { minWidth: 80 },
};

// Styled components
const HeadTableCell = styled(TableCell)(() => ({
  fontSize: 12,
  fontWeight: 600,
  "&:first-of-type": { paddingLeft: 0 },
  "&:last-of-type": { paddingRight: 0 },
}));

const BodyTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  padding: 0,
  paddingLeft: "1rem",
  paddingTop: "0.7rem",
  "&:first-of-type": { paddingLeft: 0 },
  "&:last-of-type": { paddingRight: 0 },
  [theme.breakpoints.down("sm")]: { ...commonCSS },
  [theme.breakpoints.between(960, 1270)]: { ...commonCSS },
}));

const RecentOrders: FC = () => {
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
    subscribeUntilDestroy(PaymentUserService.getListForAdmin(pagination), (response) => {
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
    <Card sx={{ padding: "2rem" }}>
      <Container maxWidth="xl" className={classes.container}>
      <Typography variant="h4" className={classes.screenName}>
        Vấn tin tài khoản khách hàng
      </Typography>
      <Box style={{ display: "flex" }}>
      </Box>
      <Paper style={{ marginTop: 10}}>
        <TableContainer style={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tài khoản</TableCell>
                <TableCell>Số tiền nạp</TableCell>
                <TableCell>Nội dung chuyển</TableCell>
                <TableCell>Thời gian</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!!paymentUsers.length &&
                paymentUsers.map((item, index) => (
                  
                  <TableRow hover key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.user.username}</TableCell>
                    <TableCell>{Number(item.vnpAmount).toLocaleString("vn")}</TableCell>
                    <TableCell>{item.vnpOrderInfo}</TableCell>
                    <TableCell>{dayjs(item.createdAt).format(DEFAULT_DATETIME_FORMAT)}</TableCell>
                    {/* <TableCell style={{color:item.paymentStatus==1 ? 'green' : 'red'}}>{item.paymentStatus == 1 ? "Thành công" : "Chờ thanh toán"}</TableCell> */}
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
    </Card>
  );
};

const orderList = [
  {
    orderNo: "#JY7685",
    name: "Nike Air max 170",
    image: "/static/products/shoe-1.png",
    price: 654,
    totalOrder: 325,
    totalAmount: "$1,45,660",
  },
  {
    orderNo: "#JY7686",
    name: "Cactus Plant",
    image: "/static/products/bonsai.png",
    price: 654,
    totalOrder: 40,
    totalAmount: "$1,45,420",
  },
  {
    orderNo: "#JY7687",
    name: "Minimal Pot",
    image: "/static/products/airbud.png",
    price: 654,
    totalOrder: 57,
    totalAmount: "$45,660",
  },
  {
    orderNo: "#JY7688",
    name: "Adidas Blaze",
    image: "/static/products/shoe-2.png",
    price: 654,
    totalOrder: 125,
    totalAmount: "$12,660",
  },
];
const selectAuth = (state: GlobalState) => state.auth;

export default RecentOrders;
