import { DailyReportView } from "@/lib/backend-requests/reports";
import { Prisma } from "@prisma/client";

export type ReducedReport = {
  totalOrdersCount: number;
  averageOrdersCount: number;
  totalDailySales: Prisma.Decimal;
  averageDailySales: Prisma.Decimal;
  totalDailyProfit: Prisma.Decimal;
  averageDailyProfit: Prisma.Decimal;
};

export function reduceReport(report: DailyReportView[]): ReducedReport {
  const result: ReducedReport = {
    totalOrdersCount: 0,
    averageOrdersCount: 0,
    totalDailySales: Prisma.Decimal(0),
    averageDailySales: Prisma.Decimal(0),
    totalDailyProfit: Prisma.Decimal(0),
    averageDailyProfit: Prisma.Decimal(0),
  };
  result.totalOrdersCount = report.reduce<typeof result.totalOrdersCount>(
    (acc, r) => acc + r.orders_count,
    result.totalOrdersCount
  );
  result.averageOrdersCount =
    Math.round((result.totalOrdersCount / report.length) * 100) / 100;

  result.totalDailySales = report.reduce<typeof result.totalDailySales>(
    (acc, r) => acc.add(r.total_sales),
    result.totalDailySales
  );
  result.averageDailySales = result.totalDailySales
    .dividedBy(report.length)
    .mul(100)
    .round()
    .div(100);

  result.totalDailyProfit = report.reduce<typeof result.totalDailyProfit>(
    (acc, r) => acc.add(r.total_profit),
    result.totalDailyProfit
  );
  result.averageDailyProfit = result.totalDailyProfit
    .dividedBy(report.length)
    .mul(100)
    .round()
    .div(100);
  return result;
}
