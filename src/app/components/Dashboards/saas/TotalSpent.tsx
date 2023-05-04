import { Box, Card, useTheme } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { H2, H5 } from "../../typography/typography";
import { FC } from "react";
import Chart from "react-apexcharts";
import useObservable from "@core/hooks/use-observable.hook";
import SaleOrderService from "@app/services/http/sale-order.service";
import { useEffect, useState } from "react";
import { DashboardDTO } from "@app/models/sale-order.model";

const TotalSpent: FC = () => {
  const {subscribeOnce} = useObservable();
  const [result, setResult] = useState<DashboardDTO[]>([]);

  useEffect(()=>{
    subscribeOnce(SaleOrderService.getDashboardAllMonth(), (data)=>{
      setResult(data as unknown as DashboardDTO[]);
    })
  },[])
  const budgets : number[] = [];
  if(result.length !== 0){
    result.forEach(r => {
      budgets.push(r.budget);
    })
  }    
  const data = {
    series: [
      {
        name: "Doanh thu",
        data: budgets,
      },
    ],
    categories: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
  };
  
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: "transparent",
      toolbar: { show: false },
    },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: false },
    // fill: { opacity: 1 },
    grid: {
      show: false,
    },
    states: {
      active: {
        filter: { type: "none" },
      },
      hover: {
        filter: { type: "none" },
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      categories: data.categories,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontWeight: 500,
        },
      },
    },
    yaxis: { show: false },

    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
        rangeBarOverlap: false,
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number) => `${val.toLocaleString("vn")}đ`,
      },
    },

    responsive: [
      {
        breakpoint: 550,
        options: {
          chart: {
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          xaxis: {
            labels: { show: false },
          },
          yaxis: {
            show: true,
            labels: {
              style: {
                colors: theme.palette.text.disabled,
                fontFamily: theme.typography.fontFamily,
                fontWeight: 500,
              },
            },
          },
        },
      },
    ],
  };

  const chartSeries = data.series;

  return (
    <Card
      sx={{
        paddingX: 4,
        height: "100%",
        paddingBottom: "1.5rem",
        paddingTop: "calc(1.5rem + 15px)",
        [theme.breakpoints.down(425)]: { padding: "1.5rem" },
      }}
    >
      <H5>Tổng doanh thu bán hàng</H5>
      <H2 color="primary.main">{`${budgets.length !== 0 && budgets.reduce((total, value)=>total + value).toLocaleString("vn")} đ`}</H2>

      <Box
        sx={{
          "& .apexcharts-tooltip *": {
            fontFamily: theme.typography.fontFamily,
            fontWeight: 500,
          },
          "& .apexcharts-tooltip": {
            boxShadow: 0,
            borderRadius: 4,
            alignItems: "center",
            "& .apexcharts-tooltip-text-y-value": { color: "primary.main" },
            "& .apexcharts-tooltip.apexcharts-theme-light": {
              border: `1px solid ${theme.palette.divider}`,
            },
            "& .apexcharts-tooltip-series-group:last-child": {
              paddingBottom: 0,
            },
          },
        }}
      >
        <Chart
          height={245}
          options={chartOptions}
          series={chartSeries}
          type="bar"
        />
      </Box>
    </Card>
  );
};

export default TotalSpent;
