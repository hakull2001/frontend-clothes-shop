import { Box, Card, useTheme } from "@mui/material";
import { ApexOptions } from "apexcharts";
import FlexBox from "../../flexbox";
import { H5 } from "../../typography/typography";
import { FC } from "react";
import Chart from "react-apexcharts";
import AnalyticsPopover from "./AnalyticsPopover";
import { useEffect, useState } from "react";
import useObservable from "@core/hooks/use-observable.hook";
import SaleOrderService from "@app/services/http/sale-order.service";
import { SaleOrder } from "@app/models/sale-order.model";
import { PaginationOption } from "@core/services/http/http.service";
import { DEFAULT_PAGINATION_OPTION } from "@app/shared/constants/common";
import useForceUpdate from "@core/hooks/use-force-update.hook";
import { log } from "console";



const Analytics: FC = () => {
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState(() => {
    const options: PaginationOption = {
      ...DEFAULT_PAGINATION_OPTION,
    };
    return options;
  });
  const callbackFunction = (childData) => {
    setMessage(childData)
  };

  const { subscribeUntilDestroy } = useObservable();
  const [forceUpdate, setForceUpdate] = useForceUpdate();

  const [saleOrders, setSaleOrders] = useState<SaleOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [daGiao, setDaGiao] = useState<SaleOrder[]>([]);
  const [dangGiao, setDangGiao] = useState<SaleOrder[]>([]);
  const [daHuy, setDaHuy] = useState<SaleOrder[]>([]);
  const [choXacNhan, setChoXacNhan] = useState<SaleOrder[]>([]);

  const theme = useTheme();
  useEffect(() => {
    subscribeUntilDestroy(
      SaleOrderService.getList(),
      (response) => {
        setSaleOrders(response.result?.data as SaleOrder[]);    
        setDaGiao((response.result?.data as SaleOrder[]).filter(saleOrder => {
          return saleOrder.delivery.index === "DaGiao"
        }));   
        setDangGiao((response.result?.data as SaleOrder[]).filter(saleOrder => {
          return saleOrder.delivery.index === "DangGiaoHang"
        }));   
        setChoXacNhan((response.result?.data as SaleOrder[]).filter(saleOrder => {
          return saleOrder.delivery.index === "ChoXacNhan"
        }));   
        setDaHuy((response.result?.data as SaleOrder[]).filter(saleOrder => {
          return saleOrder.delivery.index === "DaHuy"
        }));   
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, forceUpdate]);
  
  
  const data = {
    series: [saleOrders.length, choXacNhan.length, dangGiao.length, daGiao.length, daHuy.length],
  };
  
  const chartOptions: ApexOptions = {
    chart: { background: "transparent" },
    colors: [theme.palette.primary.main, "#FF9777", "#FF8C00", "#006400", "#FF0000"],
    labels: ["Tổng đơn hàng", "Chờ xác nhận", "Đang vận chuyển", "Đã giao", "Đã hủy"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: { show: false },
          value: { show: false },
        },
        hollow: { size: "28%" },
        track: {
          background: theme.palette.divider,
          margin: 12,
        },
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
    stroke: {
      lineCap: "round",
      curve: "smooth",
    },
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "inherit",
      fontSize: "13px",
      fontWeight: 500,
      onItemClick: { toggleDataSeries: false },
      onItemHover: { highlightDataSeries: true },
    },
    tooltip: {
      enabled: true,
      style: { fontFamily: "inherit" },
      y: {
        formatter: (value) => `${value}`,
      },
    },
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
  };
  
  const chartSeries = data.series;
  return (
    <Card
      sx={{
        padding: "2rem",
        height: "100%",
        [theme.breakpoints.down(425)]: { padding: "1.5rem" },
      }}
    >
      <FlexBox alignItems="center" justifyContent="space-between">
        <H5>Thống kê đơn hàng</H5>
        <AnalyticsPopover  />
      </FlexBox>

      <Box
        sx={{
          paddingTop: 2,
          "& .apexcharts-tooltip": {
            boxShadow: "none",
            "& .apexcharts-active": { paddingBottom: 0 },
            "&.apexcharts-theme-light": {
              border: "none",
              color: "white",
              borderRadius: "8px",
            },
          },
          "& .apexcharts-legend.position-bottom.apexcharts-align-center, .apexcharts-legend.position-top.apexcharts-align-center":
            { justifyContent: "space-evenly" },
          [theme.breakpoints.down(425)]: { padding: 0 },
        }}
      >
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="radialBar"
          height={350}
        />
      </Box>
    </Card>
  );
};

export default Analytics;
