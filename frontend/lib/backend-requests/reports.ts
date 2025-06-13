import { formatDate, makeBackendRequest } from "@/utils/misc";
import { Prisma, ProductCategory } from "@prisma/client";
import { AppDispatch } from "../store/store";

export type DailyReportView = {
  day: Date;
  orders_count: number;
  total_sales: Prisma.Decimal;
  total_profit: Prisma.Decimal;
};

export type DailyCategoryReportView = {
  day: Date;
  category_id: ProductCategory["category_id"];
  category_name: ProductCategory["name"];
  total_sold: number;
  total_value: Prisma.Decimal;
  total_profit: Prisma.Decimal;
};

export async function getDailyReport(
  dispatch?: AppDispatch
): Promise<DailyReportView[]> {
  return await makeBackendRequest<DailyReportView[]>(
    `today`,
    "GET",
    {},
    dispatch
  );
}

export async function getDailyReportsRange(
  { start, end }: { start?: Date; end?: Date },
  dispatch?: AppDispatch
): Promise<DailyReportView[]> {
  const start_date = start || new Date();
  const end_date = end || start_date;
  const options: Intl.DateTimeFormatOptions[] = [
    { year: "numeric" },
    { month: "2-digit" },
    { day: "2-digit" },
  ];
  return await makeBackendRequest<DailyReportView[]>(
    `daily-reports/by-dates?start_date=${
      //
      formatDate(start_date, options, "-")
    }&end_date=${
      //
      formatDate(end_date, options, "-")
    }`,
    "GET",
    {},
    dispatch
  );
}

export function fixDailyReportViewArray(array: DailyReportView[]) {
  return array.map((r) => ({
    day: new Date(r.day),
    orders_count: r.orders_count,
    total_sales: new Prisma.Decimal(r.total_sales || 0),
    total_profit: new Prisma.Decimal(r.total_profit || 0),
  }));
}

export async function getDailyCategoryReport(
  categoryId?: number,
  dispatch?: AppDispatch
): Promise<DailyCategoryReportView[]> {
  return await makeBackendRequest<DailyCategoryReportView[]>(
    `today/by-categories?${
      categoryId ? "?category_id=" + categoryId.toString() : ""
    }`,
    "GET",
    {},
    dispatch
  );
}

export async function getDailyCategoryReportsRange(
  { start, end, categoryId }: { start?: Date; end?: Date; categoryId?: number },
  dispatch?: AppDispatch
): Promise<DailyCategoryReportView[]> {
  const start_date = start || new Date();
  const end_date = end || start_date;
  const options: Intl.DateTimeFormatOptions[] = [
    { year: "numeric" },
    { month: "2-digit" },
    { day: "2-digit" },
  ];
  return await makeBackendRequest<DailyCategoryReportView[]>(
    `category-daily-reports/by-dates?start_date=${
      //
      formatDate(start_date, options, "-")
    }&end_date=${
      //
      formatDate(end_date, options, "-")
    }${categoryId ? "&category_id=" + categoryId.toString() : ""}`,
    "GET",
    {},
    dispatch
  );
}

export function fixDailyCategoryReportViewArray(
  array: DailyCategoryReportView[]
) {
  return array.map((r) => ({
    day: new Date(r.day),
    category_id: r.category_id,
    category_name: r.category_name,
    total_sold: r.total_sold,
    total_value: new Prisma.Decimal(r.total_value),
    total_profit: new Prisma.Decimal(r.total_profit),
  }));
}
