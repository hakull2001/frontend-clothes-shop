import { Box, Grid, useTheme } from "@mui/material";
import Analytics from "../../components/Dashboards/saas/Analytics";
import SaaSCard from "../../components/Dashboards/saas/Card";
import RecentOrders from "../../components/Dashboards/saas/RecentOrders";
import TopSelling from "../../components/Dashboards/saas/TopSelling";
import TotalSpent from "../../components/Dashboards/saas/TotalSpent";
// import useTitle from "hooks/useTitle";
import BucketIcon from "../../../icons/BucketIcon";
import EarningIcon from "../../../icons/EarningIcon";
import PeopleIcon from "../../../icons/PeopleIcon";
import WindowsLogoIcon from "../../../icons/WindowsLogoIcon";
import { FC, useEffect, useState } from "react";
import { GlobalState } from "@app/store";
import { useSelector } from "react-redux";
import { DELIVERY_INDEX } from "@app/shared/constants/common";
import useObservable from "@core/hooks/use-observable.hook";
import SaleOrderService from "@app/services/http/sale-order.service";
const SaaS: FC = () => {
  const { deliveries } = useSelector(selectDelivery);
  const {subscribeOnce} = useObservable();
  const theme = useTheme();

  const [result, setResult] = useState({
    saleOrders : 0,
    budget : 0,
    products : 0,
    customers : 0
  });
  useEffect(()=>{
    subscribeOnce(SaleOrderService.getDashboard(), (data)=>{
        setResult(data);
    })
  }, []) 
  const {saleOrders, budget, products, customers} = result;
  const cardList = [
    {
      price: saleOrders,
      Icon: BucketIcon,
      title: "Đơn hàng",
      color: theme.palette.primary.main,
    },
    {
      price: `${budget.toLocaleString("vn")}đ`,
      title: "Doanh thu hôm nay",
      Icon: EarningIcon,
      color: theme.palette.primary.dark,
    },
    {
      price: products,
      Icon: WindowsLogoIcon,
      title: "Sản phẩm đã bán",
      color: theme.palette.primary.light,
    },
    {
      price: customers,
      Icon: PeopleIcon,
      title: "Khách hàng mới",
      color: theme.palette.primary.main,
    },
  ];

  return (
    <Box pt={2} pb={4}>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {cardList.map((card, index) => (
          <Grid item lg={3} xs={6} key={index}>
            <SaaSCard card={card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} pt={4}>
        <Grid item lg={8} md={7} xs={12}>
          <TotalSpent />
        </Grid>
        <Grid item lg={4} md={5} xs={12}>
          <Analytics />
        </Grid>

        <Grid item lg={8} md={7} xs={12}>
          <RecentOrders />
        </Grid>
        <Grid item lg={4} md={5} xs={12}>
          <TopSelling />
        </Grid>
      </Grid>
    </Box>
  );
};
const selectDelivery = (state: GlobalState) => state.delivery;

export default SaaS;
