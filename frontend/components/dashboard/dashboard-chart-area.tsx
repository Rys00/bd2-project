"use client";

import {
  DailyReportView,
  fixDailyReportViewArray,
} from "@/lib/backend-requests/reports";
import { InteractiveChart } from "./interactive-chart";

const DashboardChartArea = ({
  sixMonthsReport,
}: {
  sixMonthsReport: DailyReportView[];
}) => {
  sixMonthsReport = fixDailyReportViewArray(sixMonthsReport);

  return (
    <div className="flex flex-col gap-6">
      <InteractiveChart
        title="Całkowity zysk"
        data={sixMonthsReport.map((r) => ({
          date: r.day.toLocaleString(),
          values: {
            sales: r.total_sales.toNumber(),
            profit: r.total_profit.toNumber(),
          },
        }))}
        config={{
          sales: {
            label: "Przychód",
            color: "var(--color-accent)",
          },
          profit: {
            label: "Zysk",
            color: "var(--color-primary)",
          },
        }}
      />
      <InteractiveChart
        title="Liczba zamówień"
        data={sixMonthsReport.map((r) => ({
          date: r.day.toLocaleString(),
          values: {
            orders: r.orders_count,
          },
        }))}
        config={{
          orders: {
            label: "Zamówienia",
            color: "var(--color-primary)",
          },
        }}
      />
    </div>
  );
};

export default DashboardChartArea;
